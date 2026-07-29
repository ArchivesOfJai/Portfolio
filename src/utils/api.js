const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export async function fetchApi(endpoint, options = {}) {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : '/' + endpoint;
  const primaryUrl = `${API_BASE}${cleanEndpoint}`;

  try {
    const response = await fetch(primaryUrl, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    return await response.json();
  } catch (primaryError) {
    // Fallback attempt using relative path via Vite dev server proxy
    try {
      const fallbackResponse = await fetch(cleanEndpoint, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      });
      return await fallbackResponse.json();
    } catch (fallbackError) {
      throw new Error("Backend API Server (Port 3000) is offline. Please launch start-portfolio.bat or run 'npm start' in /backend.");
    }
  }
}
