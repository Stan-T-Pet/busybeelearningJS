import { SessionProvider } from "next-auth/react";
import ThemeManager from "../components/ThemeManager";

export default function App({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
      <ThemeManager>
        <Component {...pageProps} />
      </ThemeManager>
    </SessionProvider>
  );
}
