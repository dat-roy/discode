import React from "react"
import { useLocation } from "react-router-dom";

export default function Register() {
    const { state } = useLocation();
    const { email } = state;
    
    return (
        <div>Register page for: { email }</div>
    )
} 