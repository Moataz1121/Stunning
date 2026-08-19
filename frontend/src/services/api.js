const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

/**
 * Sends prompt and selected integrations to the backend API.
 * @param {string} prompt - User app prompt (10-2000 chars)
 * @param {string[]} integrations - Selected dummy integration names
 * @returns {Promise<string>} The generated AI architecture text
 */
export async function generateArchitecture(prompt, integrations) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        integrations,
      }),
    });
  } catch (netError) {
    throw new Error(
      'Unable to connect to the backend server. Please make sure the backend is running.',
      { cause: netError },
    );
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    let errorMessage = 'Failed to generate response. Please try again.';
    if (data?.message) {
      errorMessage = Array.isArray(data.message)
        ? data.message.join(', ')
        : data.message;
    }
    throw new Error(errorMessage);
  }

  if (!data || typeof data.result !== 'string') {
    throw new Error('Invalid response payload received from server.');
  }

  return data.result;
}
