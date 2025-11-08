
import { GoogleGenAI } from "@google/genai";
import type { GeolocationCoordinates, ClassificationResult, EmergencyService, GroundingChunk } from '../types';

// This parsing is brittle and depends on the model following instructions.
// In a production app, more robust parsing or a different API structure would be ideal.
const parseGeminiResponse = (text: string, groundingChunks: GroundingChunk[]): ClassificationResult => {
    const lines = text.split('\n').filter(line => line.trim() !== '');

    let category = "Other";
    const services: EmergencyService[] = [];

    const categoryLine = lines.find(line => line.toLowerCase().startsWith('category:'));
    if (categoryLine) {
        category = categoryLine.split(':')[1].trim();
    }

    const servicesHeaderIndex = lines.findIndex(line => line.toLowerCase().startsWith('services:'));
    if (servicesHeaderIndex !== -1) {
        for (let i = servicesHeaderIndex + 1; i < lines.length; i++) {
            const line = lines[i];
            if (line.startsWith('-')) {
                const nameMatch = line.match(/Name: (.*?)(,|$)/);
                const addressMatch = line.match(/Address: (.*)/);
                
                if (nameMatch && addressMatch) {
                    const name = nameMatch[1].trim();
                    const address = addressMatch[1].trim();
                    
                    const matchingChunk = groundingChunks.find(chunk => 
                        chunk.maps && (chunk.maps.title.includes(name) || name.includes(chunk.maps.title))
                    );

                    services.push({
                        name,
                        address,
                        uri: matchingChunk?.maps?.uri,
                        title: matchingChunk?.maps?.title,
                    });
                }
            }
        }
    }
    
    // If text parsing fails but we have grounding chunks, use them
    if (services.length === 0 && groundingChunks.length > 0) {
        groundingChunks.forEach(chunk => {
            if(chunk.maps) {
                services.push({
                    name: chunk.maps.title,
                    address: "Address not parsed, see map for details.",
                    uri: chunk.maps.uri,
                    title: chunk.maps.title,
                })
            }
        });
    }


    return { category, services };
};


export const analyzeIncident = async (description: string, location: GeolocationCoordinates): Promise<ClassificationResult> => {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set");
    }
    
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const prompt = `
    Analyze the following incident report.
    First, classify the incident into one of these categories: "Fire", "Medical", "Police", "Traffic Accident", "Other".
    Second, based on the user's location, find up to 3 of the nearest relevant emergency services. 
    - For "Fire", find fire stations. 
    - For "Medical" or "Traffic Accident", find hospitals or emergency rooms. 
    - For "Police", find police stations.

    Incident Report: "${description}"

    Provide the response strictly in the following format, and nothing else:

    Category: [The category you chose]

    Services:
    - Name: [Name of the first service], Address: [Address of the first service]
    - Name: [Name of the second service], Address: [Address of the second service]
    - Name: [Name of the third service], Address: [Address of the third service]
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                tools: [{ googleMaps: {} }],
                toolConfig: {
                    retrievalConfig: {
                        latLng: {
                            latitude: location.latitude,
                            longitude: location.longitude,
                        }
                    }
                }
            },
        });

        const groundingChunks: GroundingChunk[] = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        const resultText = response.text;
        return parseGeminiResponse(resultText, groundingChunks);
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to analyze the incident. The AI model may be temporarily unavailable.");
    }
};
