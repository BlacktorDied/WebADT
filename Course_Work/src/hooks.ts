import { useState, useEffect } from "react";

export const useLoggedIn = () => {
    const [loggedIn, setLoggedIn] = useState<boolean>(false);

    useEffect(() => {
        const authCookie = document.cookie
            .split(";")
            .map((str) => str.split("="))
            .find(([name]) => name === "auth")?.[1];

        if (authCookie) {
            fetch("/api/auth/validate", {
                method: "POST",
                body: authCookie,
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.success) {
                        setLoggedIn(true);
                    }
                });
        }
    }, []);

    return loggedIn;
};
