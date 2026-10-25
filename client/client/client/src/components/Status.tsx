export function LoadingText({ label }: { label: string }) {
  return <p className="m-0 text-[12px] text-ink-muted">{label}</p>;
}

export function ErrorNotice({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div>
      <p className="mb-2 mt-0 text-[12px] text-danger">{message}</p>
      {onRetry && (
        <button
          className="rounded-[6px] border border-line px-2 py-1 text-[12px] text-ink-dim hover:bg-panel hover:text-ink"
          onClick={onRetry}
        >
          Try again
        </button>
      )}
    </div>
  );
}
