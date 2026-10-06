export default function Spinner({ text = "Loading..." }) {
  return (
    <div className="flex items-center justify-center gap-3 py-10 text-gray-500">
      <div className="h-5 w-5 rounded-full border-2 border-gray-300 border-t-blue-600 animate-spin" />
      {text}
    </div>
  );
}
