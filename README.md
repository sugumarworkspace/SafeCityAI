<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

**Home page**  
<img width="378" height="671" alt="Home_Page" src="https://github.com/user-attachments/assets/366c2ef3-ddac-4988-b127-d91e5c75928f" />
**Report car accident**  
<img width="373" height="672" alt="Incident_Car_Accident" src="https://github.com/user-attachments/assets/5f97ff1c-5f01-4281-8bf1-2eaf476f5c8e" />  
**Report fire accident**  
<img width="376" height="675" alt="Incident-Fire_Accident" src="https://github.com/user-attachments/assets/17f844da-9ab8-4bd8-bc4c-464cd2ffa305" />  
**Report crowd fighting**  
<img width="376" height="674" alt="Incident_Crowd_Fight" src="https://github.com/user-attachments/assets/73624c75-3527-427f-9554-d26a1326029a" />  

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

# Application Architecture Overview
This application follows a client-side architecture where the user's browser is responsible for all the logic.

**1. Frontend (React Application):** A single-page application built with React and TypeScript. It handles the user interface, state management, and user interactions.  
**2. Browser APIs:** The app directly uses the browser's built-in Geolocation API to securely get the user's current coordinates without sending them to a custom backend server first.  
**3. Google Gemini API:** The core analysis is performed by the Gemini model. The frontend service constructs a detailed prompt containing the user's incident report and sends it directly to the Gemini API.  
**4. Google Maps Grounding:** Instead of making separate calls to the Google Maps Places API, we leverage Gemini's built-in grounding capabilities. By providing the user's coordinates along with the prompt, we instruct Gemini to use Google Maps as a tool to find relevant, real-world emergency services nearby. The API response includes both the AI-generated text and structured data (groundingChunks) containing direct links and information about the places found on Google Maps.  
This serverless, client-side approach is efficient for this proof-of-concept, as it simplifies deployment and reduces infrastructure overhead.  

## Architecture Diagram
```mermaid
graph TD
    subgraph "User's Browser (Client-Side)"
        A[User] --> B{React UI: IncidentForm};
        B -- 1. User enters incident description --> B;
        B -- 2. Clicks 'Get My Location' --> C[Browser Geolocation API];
        C -- 3. Returns Lat/Lng coordinates --> D[App Component State];
        B -- 4. Clicks 'Analyze & Find Help' --> E[geminiService];
        D -- Passes description & location --> E;
        E -- 8. Parses response into structured data --> D;
        D -- 9. Updates UI with results --> F{React UI: ResultsDisplay};
        A -- Sees classified incident and nearby services --> F;
    end

    subgraph "Google Cloud Platform"
        G[Google Gemini API <br> gemini-2.5-flash];
        H[Google Maps Platform <br>];
        G -- 6. Internally queries for nearby places --> H;
    end

    E -- 5. Sends API request with prompt and location for grounding --> G;
    G -- 7. Returns generated text and 'groundingChunks' with map data --> E;

    style A fill:#f9f,stroke:#333,stroke-width:2px;
    style G fill:#bbf,stroke:#333,stroke-width:2px;
    style H fill:#9f9,stroke:#333,stroke-width:2px;

    style A fill:#f9f,stroke:#333,stroke-width:2px;
    style G fill:#bbf,stroke:#333,stroke-width:2px;
    style H fill:#9f9,stroke:#333,stroke-width:2px;
```
## We’re planning to:
* Maintain and log incidents in Firebase for persistence and analytics.
* Build dashboards for past incident analysis, trends, and city-level heatmaps.
* Use historical data to forecast high-risk zones or times using AI-based prediction.
* Add multilingual and voice reporting support for inclusive public use.
* Integrate directly with municipal safety systems or community alert networks.
