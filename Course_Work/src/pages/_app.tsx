import "@/styles/reusableStyles/globals.css";
import type { AppProps } from "next/app";

import Head from "next/head";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";

export default function Layout({ Component, pageProps }: AppProps) {
    return (
        <>
            <Head>
                <link rel="icon" href="/img/logo.png" />
                <title>SCP Foundation</title>
            </Head>
            <Header />
            <Component {...pageProps} />
            <Footer />
        </>
    );
}
