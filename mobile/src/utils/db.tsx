import { getAuth0User, getUserCredentials } from './auth';

// Fetches user data from db
export const fetchUserData = async () => {
  try {
    const user = await getAuth0User();
    const userCredentials = await getUserCredentials();
    if (user && userCredentials) {
      const accessToken = userCredentials.accessToken;

      if (accessToken) {
        const apiResponse = await fetch(
          process.env.EXPO_PUBLIC_API_URL +
            '/users/' +
            (user as { sub: string }).sub,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          }
        );
        const userData = await apiResponse.json();
        return userData;
      }
    }
    return false;
  } catch (error) {
    console.error('Error:', error);
  }
};
