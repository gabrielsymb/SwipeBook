import React from "react";
interface ProtectedRouteProps {
    layout: React.ComponentType<{
        children: React.ReactNode;
    }>;
}
export declare const ProtectedRoute: React.FC<ProtectedRouteProps>;
export {};
