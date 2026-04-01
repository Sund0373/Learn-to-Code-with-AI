"use client";

interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
}

export default function LoadingOverlay({ isLoading, message }: LoadingOverlayProps) {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/70">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/30 border-t-white" />
      {message && (
        <p className="mt-4 px-4 text-center text-lg font-medium text-white">
          {message}
        </p>
      )}
    </div>
  );
}
