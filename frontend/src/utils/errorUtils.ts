/**
 * Extracts error message from various error types, prioritizing backend detail field
 * @param error - Error object from API request
 * @returns User-friendly error message
 */
export const getErrorMessage = (error: Error | null | undefined): string => {
    if (!error) return 'Error desconocido';
    const axiosError = error as any;
    return axiosError?.response?.data?.detail || error.message || 'Error desconocido';
};
