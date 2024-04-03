const API_URL: string = import.meta.env.VITE_API_URL!;

const DOMAIN: string = import.meta.env.VITE_AUTH0_DOMAIN!;
const CLIENT_ID: string = import.meta.env.VITE_AUTH0_CLIENT_ID!;
const AUDIENCE: string = import.meta.env.VITE_AUTH0_API_AUDIENCE;

const TWILIO_ACCOUNT_SID: string = import.meta.env.VITE_TWILIO_ACCOUNT_SID!;
const TWILIO_API_KEY: string = import.meta.env.VITE_TWILIO_API_KEY!;
const TWILIO_API_SECRET: string = import.meta.env.VITE_TWILIO_API_SECRET!;
const TWILIO_SERVICE_SID: string = import.meta.env.VITE_TWILIO_SERVICE_SID!;

export {
  API_URL,
  DOMAIN,
  CLIENT_ID,
  AUDIENCE,
  TWILIO_ACCOUNT_SID,
  TWILIO_API_KEY,
  TWILIO_API_SECRET,
  TWILIO_SERVICE_SID
};
