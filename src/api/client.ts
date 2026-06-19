import axios from 'axios';

// Base URL for the PokeAPI
const BASE_URL = 'https://pokeapi.co/api/v2/';

// Create Axios Instance
const client = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response Interceptor for centralized error management
client.interceptors.response.use(
  (response) => response,
  (error) => {
    let errorMessage = 'An unexpected error occurred.';

    if (!error.response) {
      // Network error / No connection
      errorMessage = 'Network error. Please check your internet connection and try again.';
    } else if (error.code === 'ECONNABORTED') {
      // Timeout error
      errorMessage = 'Request timed out. The server is taking too long to respond.';
    } else {
      // API specific errors
      switch (error.response.status) {
        case 404:
          errorMessage = 'The requested Pokémon resource was not found.';
          break;
        case 500:
          errorMessage = 'PokéAPI server error. Please try again later.';
          break;
        default:
          errorMessage = `API Error (${error.response.status}): ${error.response.data?.message || error.message}`;
      }
    }
    
    return Promise.reject(new Error(errorMessage));
  }
);

export default client;
