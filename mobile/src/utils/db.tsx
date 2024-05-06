import { getAuth0User, getUserCredentials } from './auth';
import type { LocalSleepWindow } from './interfaces';
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
 * Fetches coach data from the API.
 * @returns {Promise<object | boolean>} The coach data if successful, otherwise false.
 */
export const fetchCoachData = async () => {
  try {
    const userData = await fetchUserData();
    const userCredentials = await getUserCredentials();
    if (userData && userCredentials) {
      const accessToken = userCredentials.accessToken;

      if (accessToken) {
        const apiResponse = await fetch(
          process.env.EXPO_PUBLIC_API_URL +
            '/users/' +
            (userData as { coachId: string }).coachId,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          }
        );
        const coachData = await apiResponse.json();
        return coachData;
      }
    }
    return false;
  } catch (error) {
    console.error('Error:', error);
  }
};

/**
 * Fetches onboarding answers for a specific baby.
 * @param babyId - The ID of the baby to fetch answers for.
 * @returns An array of onboarding answers for the specified baby.
 */

export const fetchOnboardingAnswers = async (babyId: string) => {
  try {
    const user = await getAuth0User();
    const userCredentials = await getUserCredentials();
    if (user && userCredentials) {
      const accessToken = userCredentials.accessToken;

      if (accessToken) {
        const apiResponse = await fetch(
          process.env.EXPO_PUBLIC_API_URL + '/answers/search',
          {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${accessToken}`
            },
            body: JSON.stringify({
              userId: (user as { sub: string }).sub,
              babyId
            })
          }
        );
        const answers = await apiResponse.json();
        return answers;
      }
    }
    return false;
  } catch (error) {
    console.error('Error:', error);
  }
};

export const updateOnboardingAnswer = async (
  answerText: string,
  answerId: string
) => {
  try {
    const user = await getAuth0User();
    const userCredentials = await getUserCredentials();
    if (user && userCredentials) {
      const accessToken = userCredentials.accessToken;

      if (accessToken) {
        const apiResponse = await fetch(
          process.env.EXPO_PUBLIC_API_URL + '/answers/' + answerId + '/update',
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`
            },
            body: JSON.stringify({
              answer_text: answerText
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

export const updateEvent = async (eventId: string, valuesToUpdate: object) => {
  try {
    const user = await getAuth0User();
    const userCredentials = await getUserCredentials();
    if (user && userCredentials) {
      const accessToken = userCredentials.accessToken;

      if (accessToken) {
        const apiResponse = await fetch(
          process.env.EXPO_PUBLIC_API_URL + '/events/' + eventId + '/update',
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`
            },
            body: JSON.stringify({
              ...valuesToUpdate
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
 * Creates a medicine by sending a POST request to the server.
 * @param medicineId - The ID of the medicine.
 * @param medicineName - The name of the medicine.
 * @returns The API response if successful, otherwise false.
 */
export const createMedicine = async (
  medicineId: string,
  medicineName: string
) => {
  const userCredentials = await getUserCredentials();
  const user = await getAuth0User();
  if (userCredentials) {
    const accessToken = userCredentials.accessToken;

    if (accessToken) {
      const apiResponse = await fetch(
        process.env.EXPO_PUBLIC_API_URL + '/medicines/create',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
          },
          body: JSON.stringify({
            userId: (user as { sub: string }).sub,
            name: medicineName,
            medicineId
          })
        }
      );
      return apiResponse;
    }
  }
};

/**
 * Creates an sleep window by sending a POST request to the server.
 * @param windowData - The data of the event to be created.
 * @returns The API response if successful, otherwise false.
 */
export const createWindow = async (windowData: object) => {
  try {
    const userCredentials = await getUserCredentials();
    if (userCredentials) {
      const accessToken = userCredentials.accessToken;
      if (accessToken) {
        const apiResponse = await fetch(
          process.env.EXPO_PUBLIC_API_URL + '/sleep-windows/create',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`
            },
            body: JSON.stringify({
              ...windowData
            })
          }
        );
        if (!apiResponse.ok) {
          throw new Error(
            `Failed to create window: ${await apiResponse.text()}`
          );
        }
        console.log('create window api response:', apiResponse);
        return apiResponse;
      }
    }
    return false;
  } catch (error) {
    console.error('Error creating window 1:', error);
    throw error;
  }
};

/**
 * Updates a sleep window by sending a PUT request to the server.
 * @param windowData - The data of the event to be updated.
 * @returns The API response if successful, otherwise false.
 */
export const updateWindow = async (windowData: LocalSleepWindow) => {
  try {
    const userCredentials = await getUserCredentials();
    if (userCredentials) {
      const accessToken = userCredentials.accessToken;
      if (accessToken) {
        const apiResponse = await fetch(
          process.env.EXPO_PUBLIC_API_URL +
            '/sleep-windows/' +
            windowData.windowId +
            '/update',
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`
            },
            body: JSON.stringify({
              ...windowData
            })
          }
        );
        if (!apiResponse.ok) {
          throw new Error(
            `Failed to update window: ${await apiResponse.text()}`
          );
        }
        return apiResponse;
      }
    }
    return false;
  } catch (error) {
    console.error('Error updating window:', error);
    throw error;
  }
};

/**
 * Deletes a sleep window by sending a DELETE request to the server.
 * @param windowId - The ID of the window to be deleted.
 * @returns The API response if successful, otherwise false.
 */
export const deleteWindow = async (windowId: string) => {
  try {
    const userCredentials = await getUserCredentials();
    if (userCredentials) {
      const accessToken = userCredentials.accessToken;
      if (accessToken) {
        const apiResponse = await fetch(
          process.env.EXPO_PUBLIC_API_URL +
            '/sleep-windows/' +
            windowId +
            '/delete',
          {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          }
        );
        if (!apiResponse.ok) {
          throw new Error(
            `Failed to delete window: ${await apiResponse.text()}`
          );
        }
        return apiResponse;
      }
    }
    return false;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

/**
 * Creates an sleep window by sending a POST request to the server.
 * @param eventData - The data of the event to be created.
 * @param windowsData - The data of the event to be created.
 * @returns The API response if successful, otherwise false.
 */
export const createSleepEvent = async (
  eventData: object,
  windowsData: object[]
) => {
  try {
    const userCredentials = await getUserCredentials();
    const user = await getAuth0User();
    if (userCredentials) {
      const accessToken = userCredentials.accessToken;

      if (accessToken) {
        const eventResponse = await fetch(
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

        if (!eventResponse.ok) {
          throw new Error(
            `Failed to create event: ${await eventResponse.text()}`
          );
        }

        const event = await eventResponse.json();

        for (const windowData of windowsData) {
          const windowResponse = await fetch(
            process.env.EXPO_PUBLIC_API_URL + '/sleep-windows/create',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`
              },
              body: JSON.stringify({
                eventId: event.eventId,
                ...windowData
              })
            }
          );

          if (!windowResponse.ok) {
            throw new Error(
              `Failed to create window: ${await windowResponse.text()}`
            );
          }
        }
      }
    }
    return false;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const fetchPlan = async () => {
  try {
    const user = await fetchUserData();
    // const baby = user.babies[0];
    const userCredentials = await getUserCredentials();

    if (userCredentials) {
      const accessToken = userCredentials.accessToken;

      if (accessToken) {
        const apiResponse = await fetch(
          process.env.EXPO_PUBLIC_API_URL +
            '/plans/' +
            user.user_plans[0].planId,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`
            }
          }
        );
        if (apiResponse.status === 200) {
          const json = await apiResponse.json();
          console.log('json', json);
          return json;
        }
        return null;
      }
    }
    return null;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

/**
 * Fetches the events for the user.
 * @returns The API response if successful, otherwise false.
 */
export const fetchEvents = async () => {
  try {
    const userCredentials = await getUserCredentials();
    const user = await getAuth0User();
    if (userCredentials) {
      const accessToken = userCredentials.accessToken;
      const { sub } = user as { sub: string };
      const userId = sub;
      if (accessToken) {
        const apiResponse = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/events/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          }
        );
        const events = await apiResponse.json();
        return events;
      }
    }
    return false;
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
 * Fetches files for a specific baby.
 * @param babyId - The ID of the baby to fetch answers for.
 * @returns An array of file objects for the specified baby.
 */

export const fetchFiles = async (babyId: string) => {
  try {
    const user = await getAuth0User();
    const userCredentials = await getUserCredentials();
    if (user && userCredentials) {
      const accessToken = userCredentials.accessToken;

      if (accessToken) {
        const apiResponse = await fetch(
          process.env.EXPO_PUBLIC_API_URL + '/files/search',
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${accessToken}`
            },
            body: JSON.stringify({
              babyId
            })
          }
        );
        const answers = await apiResponse.json();
        return answers;
      }
    }
    return false;
  } catch (error) {
    console.error('Error:', error);
  }
};
