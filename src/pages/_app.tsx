import { AppProps } from "next/app";
import { useEffect } from "react";
import { supabase } from "../lib/client";
import "styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    supabase.auth.onAuthStateChange(async (event, session) => {
      await fetch("/api/auth", {
        method: "POST",
        headers: new Headers({
          "Content-Type": "application/json",
        }),
        credentials: "same-origin",
        body: JSON.stringify({ event, session: session }),
      });
    });
  });
  return <Component {...pageProps} />;
}

export default MyApp;
