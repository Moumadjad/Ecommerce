import { twMerge } from "tailwind-merge";

const BASE_BUTTON =
  "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900 disabled:opacity-50 disabled:pointer-events-none";

const BUTTON_VARIANTS = {
  primary: "bg-amber-700 text-white shadow-sm hover:bg-amber-600 focus-visible:ring-amber-600",
  secondary:
    "bg-white text-gray-700 border border-gray-300 shadow-sm hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-700 focus-visible:ring-amber-600",
  ghost:
    "text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800 focus-visible:ring-amber-600",
  danger: "bg-red-600 text-white shadow-sm hover:bg-red-500 focus-visible:ring-red-500",
  dangerGhost:
    "text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 focus-visible:ring-red-500",
};

const BUTTON_SIZES = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-5 py-2.5 text-base",
};

export function btn(variant = "primary", size = "md", extra = "") {
  return twMerge(BASE_BUTTON, BUTTON_VARIANTS[variant], BUTTON_SIZES[size], extra);
}

export function input(extra = "") {
  return twMerge(
    "block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 shadow-sm transition-colors focus:border-amber-600 focus:ring-1 focus:ring-amber-600 focus:outline-none",
    extra
  );
}

export function label(extra = "") {
  return twMerge("block text-sm font-medium text-gray-700 dark:text-gray-300", extra);
}

export function card(extra = "") {
  return twMerge(
    "rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm",
    extra
  );
}

export function link(extra = "") {
  return twMerge(
    "text-amber-700 hover:text-amber-600 dark:text-amber-400 dark:hover:text-amber-300 font-medium transition-colors",
    extra
  );
}
