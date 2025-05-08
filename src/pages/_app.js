// File: src/pages/_app.js
import { SessionProvider } from "next-auth/react";
import ThemeManager from "../components/ThemeManager";
import MusicPlayer from "@/components/MusicPlayer";
import "../styles/globals.css";
import { useRouter } from "next/router";
import { MathJaxContext } from "better-react-mathjax";

const mathConfig = {
  loader: { load: ["[tex]/ams"] },
  tex: {
    packages: { "[+]": ["ams"] },
    inlineMath: [["\\(", "\\)"]],
    displayMath: [["\\[", "\\]"]]
  }
};

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const hideMusicPlayerOn = ["/login", "/register"];

  return (
    <SessionProvider session={pageProps.session}>
      <MathJaxContext config={mathConfig}>
        <ThemeManager>
          <Component {...pageProps} />
          {!hideMusicPlayerOn.includes(router.pathname) && <MusicPlayer />}
        </ThemeManager>
      </MathJaxContext>
    </SessionProvider>
  );
}