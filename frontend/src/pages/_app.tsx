import "@fontsource/poppins/400.css";
import "@fontsource/poppins/700.css";
import "../styles/globals.css";
import type { AppProps } from "next/app";

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
