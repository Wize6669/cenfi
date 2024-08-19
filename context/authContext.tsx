import React, { useState, ReactNode } from 'react';
import { AuthContextInterface } from "@/interfaces/AuthContext";
import { User } from "@/interfaces/User";

const AuthContext = React.createContext<AuthContextInterface | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

function AuthProvider({ children }: AuthProviderProps) {
    const [authUser, setAuthUser] = useState<User | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    const value: AuthContextInterface = {
        authUser,
        setAuthUser,
        isLoggedIn,
        setIsLoggedIn,
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export { AuthContext, AuthProvider };
