import { createContext, useReducer, useEffect } from 'react';

// 1. Create Context
export const AuthContext = createContext();

// 2. Reducer to handle auth actions
export const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return { user: action.payload };
        case 'LOGOUT':
            return { user: null };
        default:
            return state;
    }
};

// 3. Context Provider
export const AuthContextProvider = ({ children }) => {
    // Initialize state with whatever is in localStorage
    const [state, dispatch] = useReducer(authReducer, {
        user: JSON.parse(localStorage.getItem('user')),
    });

    // Effect 1: Run once on mount — ensure state sync with localStorage
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            dispatch({ type: 'LOGIN', payload: user });
        } else {
            dispatch({ type: 'LOGOUT' });
        }
    }, []);

    // Effect 2: Listen to changes from other tabs
    useEffect(() => {
        const handleStorageChange = (event) => {
            if (event.key === 'user') {
                const newUser = JSON.parse(event.newValue);
                if (newUser) {
                    dispatch({ type: 'LOGIN', payload: newUser });
                } else {
                    dispatch({ type: 'LOGOUT' });
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    // Always update localStorage whenever context state changes
    useEffect(() => {
        if (state.user) {
            localStorage.setItem('user', JSON.stringify(state.user));
        } else {
            localStorage.removeItem('user');
        }
    }, [state.user]);

    return (
        <AuthContext.Provider value={{ ...state, dispatch }}>
            {children}
        </AuthContext.Provider>
    );
};