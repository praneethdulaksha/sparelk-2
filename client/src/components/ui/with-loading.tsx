import React, { ComponentType, useState } from "react";
import { Button } from "./button";
import { RefreshCcw } from "lucide-react";
import { ErrorMessage } from "./error-message";

interface WithLoadingProps {
  isLoading?: boolean;
  error?: string | null;
  retry?: () => void;
}

/**
 * Higher-order component that adds loading and error states to any component
 * @param WrappedComponent The component to wrap
 * @param LoadingComponent Optional custom loading component
 * @returns A new component with loading and error handling
 */
export function withLoading<P extends object>(
  WrappedComponent: ComponentType<P>,
  LoadingComponent?: ComponentType<any>
) {
  return function WithLoadingComponent(props: P & WithLoadingProps) {
    const { isLoading, error, retry, ...componentProps } = props;

    if (isLoading) {
      if (LoadingComponent) {
        return <LoadingComponent />;
      }

      return (
        <div className="w-full py-8 flex flex-col items-center justify-center">
          <div className="h-10 w-10 rounded-full border-4 border-slate-200 border-t-orange-500 animate-spin mb-4"></div>
          <p className="text-slate-500">Loading...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="w-full py-4 flex flex-col space-y-4">
          <ErrorMessage message={error} />
          {retry && (
            <div className="flex justify-center">
              <Button
                onClick={retry}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                <RefreshCcw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>
          )}
        </div>
      );
    }

    return <WrappedComponent {...(componentProps as P)} />;
  };
}

/**
 * A hook for managing loading and error states
 */
export function useLoadingState() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startLoading = () => {
    setIsLoading(true);
    setError(null);
  };

  const stopLoading = () => {
    setIsLoading(false);
  };

  const setLoadingError = (errorMessage: string) => {
    setError(errorMessage);
    setIsLoading(false);
  };

  const clearError = () => {
    setError(null);
  };

  return {
    isLoading,
    error,
    startLoading,
    stopLoading,
    setLoadingError,
    clearError,
  };
}
