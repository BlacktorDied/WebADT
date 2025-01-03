import styles from "./Header.module.scss";
import { useEffect, useState } from "react";
import Link from "next/link";

import Close from "@/icons/close.svg";
import { useLoggedIn } from "@/hooks";

export default function Header() {
    const [hidden, setHidden] = useState<boolean>(true);
    const [isSignUp, setIsSignUp] = useState<boolean>(false);
    const loggedIn = useLoggedIn();

    async function handleAuth(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        const response = await fetch("/api/auth", {
            method: "POST",
            body: formData,
        });

        const data = await response.json();
        if (data.error) {
            alert(data.error);
        } else {
            location.reload();
        }
    }

    return (
        <header className={styles.main}>
            <a href="/">
                <img
                    className={styles.main__logo}
                    src="/img/logo.png"
                    alt="SCP Foundation logo"
                />
            </a>
            <nav className={styles.main__nav}>
                <ul className={styles.main__wrapper}>
                    <li>
                        <Link href="/">Home</Link>
                    </li>
                    <li>
                        <Link href="/scps">SCPs</Link>
                    </li>
                    <li>
                        <Link href="/employees">Staff</Link>
                    </li>
                    <li>
                        <Link href="/facility">Facilities</Link>
                    </li>
                    {!loggedIn ? (
                        <li
                            className={styles.main__logIn}
                            onClick={() => {
                                setHidden(false);
                                setIsSignUp(false);
                            }}
                        >
                            Log in
                        </li>
                    ) : (
                        <li
                            className={styles.main__logOut}
                            onClick={() => {
                                document.cookie =
                                    "auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                                location.reload();
                            }}
                        >
                            Log out
                        </li>
                    )}
                </ul>
            </nav>

            {hidden ? null : !isSignUp ? (
                <div className={styles.form}>
                    <form className={styles.form__logIn} onSubmit={handleAuth}>
                        <Close
                            onClick={() => setHidden(true)}
                            className={styles.form__close}
                        />
                        <input type="hidden" name="action" value="logIn" />
                        <input
                            type="text"
                            name="username"
                            id="username"
                            placeholder="Username"
                        />
                        <input
                            type="password"
                            name="password"
                            id="password"
                            placeholder="Password"
                        />
                        <div className={styles.form__options}>
                            <button>Log in</button>
                            <div onClick={() => setIsSignUp(true)}>Sign up</div>
                        </div>
                    </form>
                </div>
            ) : (
                <div className={styles.form}>
                    <form className={styles.form__signUp} onSubmit={handleAuth}>
                        <Close
                            onClick={() => setHidden(true)}
                            className={styles.form__close}
                        />
                        <input type="hidden" name="action" value="signUp" />
                        <input
                            type="text"
                            name="username"
                            id="username"
                            placeholder="Username"
                        />
                        <input
                            type="password"
                            name="password"
                            id="password"
                            placeholder="Password"
                        />
                        <input
                            type="password"
                            name="confirmPassword"
                            id="confirmPassword"
                            placeholder="Confirm password"
                        />
                        <div className={styles.form__options}>
                            <div onClick={() => setIsSignUp(false)}>Log in</div>
                            <button>Sign up</button>
                        </div>
                    </form>
                </div>
            )}
        </header>
    );
}
