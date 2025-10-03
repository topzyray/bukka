import axios from "axios";

/**
 * Extracts an error message from various error types
 * @param error - The error object thrown during an API call or other operations.
 * @returns The extracted error message as a string.
 */

export const extractErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message || "An unknown error occurred.";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unknown error occurred.";
};
