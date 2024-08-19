"use client"

import DashboardAdmin from "@/components/DashboardAdmin";
import { AuthProvider } from "@/context/authContext";

export default function Home() {
    return (
        <AuthProvider>
            <DashboardAdmin />
        </AuthProvider>
    );
}
