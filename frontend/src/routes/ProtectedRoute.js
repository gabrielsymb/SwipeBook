import { jsx as _jsx } from "react/jsx-runtime";
import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/AuthStore";
export const ProtectedRoute = ({ layout: Layout, }) => {
    const { isLoggedIn, checkAuth } = useAuthStore();
    useEffect(() => {
        checkAuth();
    }, [checkAuth]);
    if (!isLoggedIn) {
        return _jsx(Navigate, { to: "/login", replace: true });
    }
    return (_jsx(Layout, { children: _jsx(Outlet, {}) }));
};
