const API_URL = import.meta.env.VITE_API_URL!;
const DOMAIN: string = import.meta.env.VITE_AUTH0_DOMAIN!;
const CLIENT_ID: string = import.meta.env.VITE_AUTH0_CLIENT_ID!;
const AUDIENCE: string = import.meta.env.VITE_AUTH0_API_AUDIENCE;

export { API_URL, DOMAIN, CLIENT_ID, AUDIENCE };
