import { fetchUserData } from './db';
import jwtDecode from 'jwt-decode';
import Auth0 from 'react-native-auth0';

const auth0Domain = process.env.EXPO_PUBLIC_AUTH0_DOMAIN ?? '';
const auth0ClientId = process.env.EXPO_PUBLIC_AUTH0_CLIENT_ID ?? '';
const auth0 = new Auth0({ domain: auth0Domain, clientId: auth0ClientId });

/**
 * Checks if the user has valid credentials.
 * @returns {Promise<boolean>} A promise that resolves to a boolean indicating if the user has valid credentials.
 */
export const hasValidCredentials = async () => {
  try {
    const validCredentials =
      await auth0.credentialsManager.hasValidCredentials();
    return validCredentials;
  } catch (error) {
    console.error('Error:', error);
  }
};

/**
 * Retrieves the user credentials using the `getCredentials` function from the `useAuth0` hook.
 * @returns {Promise<any>} A promise that resolves to the user credentials.
 */
export const getUserCredentials = async () => {
  try {
    const credentials = await auth0.credentialsManager.getCredentials();
    if (credentials) {
      return credentials;
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

/**
 * Checks if the user has completed the onboarding process.
 * @returns A promise that resolves to a boolean indicating whether the user has completed onboarding.
 */
export const hasOnboarded = async () => {
  try {
    const userData = await fetchUserData();
    if (userData) {
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error:', error);
  }
};

/**
 * Retrieves the authenticated user from the credentials.
 * @returns {Promise<any>} The authenticated user.
 */
export const getAuth0User = async () => {
  const credentials = await getUserCredentials();

  try {
    if (credentials) {
      const user = jwtDecode(credentials.idToken);
      if (user) {
        return user;
      }
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

/**
 * Creates a user by sending a POST request to the API endpoint.
 * This function requires the user to be authenticated and have valid credentials.
 * It retrieves the user's credentials and Auth0 user information before making the API call.
 *
 * @returns {Promise<Response>} The API response from creating the user.
 */
export const createUser = async () => {
  const credentials = await getUserCredentials();
  const user = await getAuth0User();

  if (user && credentials) {
    const { sub, email } = user as { sub: string; email: string };
    const apiResponse = await fetch(
      process.env.EXPO_PUBLIC_API_URL + '/users/create',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${credentials?.accessToken}`
        },
        body: JSON.stringify({ userId: sub, email }) // Use the type annotated properties
      }
    );

    return apiResponse;
  }
};
