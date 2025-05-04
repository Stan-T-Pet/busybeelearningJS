// File: src/pages/_app.js
import { SessionProvider } from "next-auth/react";
import ThemeManager from "../components/ThemeManager";
import MusicPlayer from "@/components/MusicPlayer";
import "../styles/globals.css";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }) {
  const router = useRouter();

  // Pages where MusicPlayer should be hidden
  const hideMusicPlayerOn = ["/login", "/register"];

  return (
    <SessionProvider session={pageProps.session}>
      <ThemeManager>
        <Component {...pageProps} />
        {!hideMusicPlayerOn.includes(router.pathname) && <MusicPlayer />}
      </ThemeManager>
    </SessionProvider>
  );
}