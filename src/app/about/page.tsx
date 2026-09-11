import type { Metadata } from "next";
import { SignalControlRoom } from "@/components/about/SignalControlRoom";

export const metadata: Metadata = {
  title: "About",
};

/** About page built around a scrollable signal-control-room narrative. */
export default function AboutPage() {
  return <SignalControlRoom />;
}
