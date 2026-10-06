import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="text-center p-10">
      <h1 className="text-2xl font-bold mb-2">Page not found</h1>
      <p className="text-gray-600 mb-4">The page you are looking for does not exist.</p>
      <Link to="/" className="bg-blue-600 text-white px-4 py-2 rounded">Go to jobs</Link>
    </div>
  );
}
