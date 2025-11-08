
export interface GeolocationCoordinates {
  latitude: number;
  longitude: number;
}

export interface GroundingChunk {
  maps?: {
    uri: string;
    title: string;
  };
  web?: {
    uri: string;
    title: string;
  };
}

export interface EmergencyService {
  name: string;
  address: string;
  uri?: string;
  title?: string;
}

export interface ClassificationResult {
  category: string;
  services: EmergencyService[];
}
