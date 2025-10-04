import axios from "axios";

/**
 * Extracts an error message from various error types
 * (including BukkaResponse format).
 * @param error - The error object thrown during an API call or other operations.
 * @returns The extracted error message as a string.
 */
export const extractErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    // Check if API returned a BukkaResponse-like object
    const responseData = error.response?.data;
    if (responseData?.responseMessage) {
      return responseData.responseMessage;
    }

    // Fallback to plain message if present
    return error.message || "An unknown error occurred.";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unknown error occurred.";
};
