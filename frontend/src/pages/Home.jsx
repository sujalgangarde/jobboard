import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import Spinner from "../components/Spinner";
import ErrorBox from "../components/ErrorBox";
import { TYPES, errMsg, timeAgo, typeColor } from "../utils";

export default function Home() {
  const [q, setQ] = useState("");
  const [type, setType] = useState("");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);

  useEffect(() => { document.title = "JobBoard - Find your next job"; }, []);

  useEffect(() => {
    let cancel = false;
    setLoading(true);
    setError("");
    const t = setTimeout(() => {
      api.get("/jobs", { params: { q, type } })
        .then((r) => !cancel && setJobs(r.data))
        .catch((e) => !cancel && setError(errMsg(e)))
        .finally(() => !cancel && setLoading(false));
    }, 300);
    return () => { cancel = true; clearTimeout(t); };
  }, [q, type, retry]);

  const filtered = q || type;
  const clear = () => { setQ(""); setType(""); };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="py-6 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold">Find your next job</h1>
        <p className="text-gray-600 mt-1">Search by job title, company or location</p>
      </div>

      <input
        type="search"
        autoFocus
        className="w-full border border-gray-300 bg-white p-3 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="e.g. Java developer, Pune, Acme"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />

      <div className="flex flex-wrap items-center gap-2 mb-4">
        {["", ...TYPES].map((t) => (
          <button key={t || "all"} onClick={() => setType(t)} aria-pressed={type === t}
            className={`px-3 py-1 rounded-full border text-sm ${
              type === t ? "bg-blue-600 text-white border-blue-600" : "bg-white hover:bg-gray-100"}`}>
            {t || "All"}
          </button>
        ))}
        {filtered && (
          <button onClick={clear} className="text-sm text-blue-600 underline ml-1">Clear</button>
        )}
      </div>

      {loading && <Spinner text="Loading jobs..." />}
      {!loading && error && <ErrorBox message={error} onRetry={() => setRetry((r) => r + 1)} />}

      {!loading && !error && (
        <>
          <p className="text-sm text-gray-500 mb-2">
            {jobs.length} {jobs.length === 1 ? "job" : "jobs"} found
          </p>
          {jobs.map((j) => (
            <Link key={j.id} to={`/jobs/${j.id}`}
              className="block bg-white border rounded-lg p-4 mb-3 hover:shadow-md hover:border-blue-300 transition">
              <div className="flex justify-between items-start gap-2">
                <h2 className="font-semibold text-lg">{j.title}</h2>
                {j.type && (
                  <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${typeColor[j.type] || "bg-gray-100"}`}>
                    {j.type}
                  </span>
                )}
              </div>
              <p className="text-gray-700">{j.company}{j.location && ` · ${j.location}`}</p>
              <p className="text-sm text-gray-500 mt-1">
                {j.salary && `${j.salary} · `}{timeAgo(j.postedOn)}
              </p>
            </Link>
          ))}
          {jobs.length === 0 && (
            <div className="text-center bg-white border rounded-lg p-8">
              <p className="text-gray-600 mb-3">No jobs match your search.</p>
              {filtered && (
                <button onClick={clear} className="bg-blue-600 text-white px-4 py-2 rounded">
                  Clear search
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
