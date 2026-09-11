import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** clsx + tailwind-merge — later conflicting utility classes win cleanly. */
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
