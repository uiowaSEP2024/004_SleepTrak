import { getAuth0User, getUserCredentials } from './auth';

/**
 * Fetches user data from the API.
 * @returns {Promise<object | boolean>} The user data if successful, otherwise false.
 */
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

/**
 * Fetches onboarding questions from the API.
 * @returns {Promise<Array<Object>>} - The array of onboarding questions.
 */
export const fetchOnboardingQuestions = async () => {
  try {
    const userCredentials = await getUserCredentials();
    if (userCredentials) {
      const accessToken = userCredentials.accessToken;

      if (accessToken) {
        const apiResponse = await fetch(
          process.env.EXPO_PUBLIC_API_URL + '/questions/all',
          {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          }
        );
        const questions = await apiResponse.json();
        return questions;
      }
    }
    return false;
  } catch (error) {
    console.error('Error:', error);
  }
};

/**
 * Fetches onboarding questions for a specific screen number.
 * @param screenNumber - The screen number to fetch questions for.
 * @returns An array of onboarding questions for the specified screen number.
 */
export const fetchOnboardingQuestionsForScreen = async (
  screenNumber: number
) => {
  const questions = await fetchOnboardingQuestions();
  return questions.filter(
    (question: { onboarding_screen: number }) =>
      question.onboarding_screen === screenNumber
  );
};

/**
 * Creates onboarding answers in the database.
 * @param answers - An array of objects containing the question ID, answer, and baby ID.
 * @returns A Promise that resolves when all the onboarding answers are created.
 */
export const createOnboardingAnswers = async (
  answers: Record<string, string>,
  babyId: string
) => {
  for (const questionId of Object.keys(answers)) {
    await createOnboardingAnswer(questionId, answers[questionId], babyId);
  }
};

/**
 * Creates an onboarding answer for a given question, answer, and baby ID.
 * @param questionId - The ID of the question.
 * @param answer - The answer to the question.
 * @param babyId - The ID of the baby.
 * @returns A Promise that resolves to the API response or false if there was an error.
 */
export const createOnboardingAnswer = async (
  questionId: string,
  answer: string,
  babyId: string
) => {
  try {
    const userCredentials = await getUserCredentials();
    const user = await getAuth0User();
    if (userCredentials) {
      const accessToken = userCredentials.accessToken;

      if (accessToken) {
        const apiResponse = await fetch(
          process.env.EXPO_PUBLIC_API_URL + '/answers/create',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`
            },
            body: JSON.stringify({
              userId: (user as { sub: string }).sub,
              babyId,
              questionId,
              answer_text: answer,
              answerId:
                (user as { sub: string }).sub + '_' + babyId + '_' + questionId
            })
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

/**
 * Creates a user with the given first name, last name, and role.
 * @param firstName - The first name of the user.
 * @param lastName - The last name of the user.
 * @param role - The role of the user.
 * @returns A Promise that resolves to the response from the API.
 */
export const createUser = async (
  firstName: string,
  lastName: string,
  role: string
) => {
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
          Authorization: `Bearer ${credentials.accessToken}`
        },
        body: JSON.stringify({
          userId: sub,
          first_name: firstName,
          last_name: lastName,
          email,
          role
        })
      }
    );
    const response = await apiResponse.json();
    return response;
  }
};

/**
 * Creates a new baby with the given name and date of birth.
 *
 * @param name - The name of the baby.
 * @param dob - The date of birth of the baby.
 * @returns The ID of the created baby.
 */
export const createBaby = async (name: string, dob: string) => {
  const credentials = await getUserCredentials();
  const userData = await fetchUserData();
  const user = await getAuth0User();

  if (user && credentials) {
    let babyIdx = 0;
    if (userData) {
      babyIdx = userData.babies.length;
    }

    const { sub } = user as { sub: string };
    const babyId = sub + '_' + babyIdx;
    await fetch(process.env.EXPO_PUBLIC_API_URL + '/babies/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${credentials.accessToken}`
      },
      body: JSON.stringify({ parentId: sub, babyId, name, dob })
    });
    return babyId;
  }
};

/**
 * Creates an event by sending a POST request to the server.
 * @param eventData - The data of the event to be created.
 * @returns The API response if successful, otherwise false.
 */
export const createEvent = async (eventData: object) => {
  try {
    const userCredentials = await getUserCredentials();
    const user = await getAuth0User();
    if (userCredentials) {
      const accessToken = userCredentials.accessToken;

      if (accessToken) {
        const apiResponse = await fetch(
          process.env.EXPO_PUBLIC_API_URL + '/events/create',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`
            },
            body: JSON.stringify({
              ownerId: (user as { sub: string }).sub,
              ...eventData
            })
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
