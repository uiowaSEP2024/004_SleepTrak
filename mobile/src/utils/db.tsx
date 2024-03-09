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
  answers: Array<{ questionId: number; answer: string; babyId: string }>
) => {
  for (const answer of answers) {
    await createOnboardingAnswer(
      answer.questionId,
      answer.answer,
      answer.babyId
    );
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
  questionId: number,
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
              answer
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
