
export function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-pulse text-center">
        <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-4"></div>
        <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded mx-auto"></div>
      </div>
    </div>
  );
}
