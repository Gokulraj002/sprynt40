import { Space_Grotesk, Inter } from "next/font/google";

/* Display face matches the bold geometric Sprynt40 wordmark. */
export const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display-face",
  display: "swap",
});

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
