import { Loader2, InfoIcon } from "lucide-react";

type StatusBannerProps = {
  variant: "loading" | "empty";
  message: string;
  className?: string;
  details?: string;
};

export default function StatusBanner({
  variant,
  message,
  className = "",
  details,
}: StatusBannerProps) {
  if (variant === "loading") {
    return (
      <div
        aria-live="polite"
        className={`flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 ${className}`}
      >
        <Loader2 className="h-4 w-4 animate-spin text-teal-600" />
        <span>{message}</span>
      </div>
    );
  }

  return (
    <div
      className={`flex gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 ${className}`}
    >
      <InfoIcon size="16" strokeWidth={2} className="mt-0.5 shrink-0 text-teal-600" />
      <div className="flex flex-col gap-1">
        <span>{message}</span>
        {details ? <span className="text-xs text-gray-600 dark:text-gray-400">{details}</span> : null}
      </div>
    </div>
  );
}