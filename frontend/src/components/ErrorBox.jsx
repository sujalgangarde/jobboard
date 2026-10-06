export default function ErrorBox({ message, onRetry }) {
  return (
    <div className="border border-red-200 bg-red-50 text-red-700 rounded-lg p-4 text-center">
      <p className="mb-2">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="bg-red-600 text-white px-4 py-1.5 rounded">
          Try again
        </button>
      )}
    </div>
  );
}
