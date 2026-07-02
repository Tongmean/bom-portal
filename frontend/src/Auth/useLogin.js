import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import apiClient from '../utility/apiClient';

export default function useLogin() {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { dispatch } = useAuthContext();

    const login = async (email, password) => {
        setIsLoading(true);
        setError(null); // Reset error before login attempt
        try {
            const response = await apiClient.post('/user/login', {
                email,
                password,
            });

            const userData = response.data.data; // Axios automatically parses JSON responses

            // Save user data in local storage
            localStorage.setItem('user', JSON.stringify(userData));

            // Update the auth context
            dispatch({ type: 'LOGIN', payload: userData });

            return true; // Explicitly return true on success
        } catch (error) {
            setError(error.response.data.msg || 'An unexpected error occurred');
            return false; // Explicitly return false on error
        } finally {
            setIsLoading(false);
        }
    };

    return { error, isLoading, login };
}