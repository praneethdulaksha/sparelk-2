import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ErrorMessageProps {
  message?: string;
  className?: string;
}

export function ErrorMessage({
  message = "Error loading content. Please try again.",
  className,
}: ErrorMessageProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 text-red-500 rounded-md p-3 bg-red-50 border border-red-200",
        className
      )}
    >
      <AlertCircle className="h-4 w-4" />
      <p className="text-sm">{message}</p>
    </div>
  );
}
