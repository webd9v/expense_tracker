import React, { createContext, useState, useEffect } from "react";

const CsrfContext = createContext(null);

function CsrfProvider({ children }) {
    const [csrfToken, setCsrfToken] = useState(null);

    useEffect(() => {
        const fetchCsrfToken = async () => {
            try {
                const response = await fetch("/api/csrf_token/");
                if (response.ok) {
                    const data = await response.json();
                    setCsrfToken(data.csrfToken);
                } else {
                    console.error("Failed to fetch CSRF token");
                }
            } catch (error) {
                console.error("Error fetching CSRF token:", error);
            }
        };

        fetchCsrfToken(); // Fetch the token when the provider mounts
    }, []);

    return (
        <CsrfContext.Provider value={csrfToken}>
            {children}
        </CsrfContext.Provider>
    );
}

export { CsrfContext, CsrfProvider };
