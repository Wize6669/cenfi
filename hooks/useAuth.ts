'use client'

import { useContext } from "react";
import { AuthContext } from "@/context/authContext";
import { AuthContextInterface } from "@/interfaces/AuthContext";

function useAuth(): AuthContextInterface {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

export { useAuth };
