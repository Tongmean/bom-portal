import { AuthContext } from './AuthContext';
import { useContext } from "react";

export const useAuthContext = () => {
    // step 3 
    // useContext ()
    const context = useContext(AuthContext);

    
    if(!context){
        throw Error('UseAuthContext must be inside AuthContextProvider');
    }

    return context;
}