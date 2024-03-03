import { getUserCredentials } from './auth';

// Fetches user data from db
export const fetchUserData = async () => {
  try {
    const userCredentials = await getUserCredentials();
    if (userCredentials) {
      const userId = userCredentials.idToken;
      const accessToken = userCredentials.accessToken;

      if (accessToken) {
        const apiResponse = await fetch(
          process.env.EXPO_PUBLIC_API_URL + '/users/' + userId,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          }
        );
        return apiResponse;
      }
    }
    return false;
  } catch (error) {
    console.error('Error:', error);
  }
};
