declare module '@react-google-maps/api' {
  export interface LoadScriptProps {
    googleMapsApiKey: string;
    libraries?: Array<'places' | 'drawing' | 'geometry' | 'localContext' | 'visualization'>;
  }
} 