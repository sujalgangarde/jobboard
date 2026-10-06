import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api";
import Spinner from "../components/Spinner";
import ErrorBox from "../components/ErrorBox";
import { useToast } from "../toast";
import { errMsg, timeAgo, typeColor } from "../utils";

export default function JobDetail() {
  const { id } = useParams();
  const toast = useToast();
  const [job, setJob] = useState(null);
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setJob(null); setError(""); setNotFound(false);
    api.get(`/jobs/${id}`)
      .then((r) => { setJob(r.data); document.title = `${r.data.title} - JobBoard`; })
      .catch((e) => (e.response?.status === 404 ? setNotFound(true) : setError(errMsg(e))));
  }, [id]);

  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast("Link copied");
    } catch {
      toast("Could not copy link", "error");
    }
  };

  if (notFound)
    return (
      <div className="max-w-3xl mx-auto p-4 text-center">
        <p className="mb-3">This job no longer exists.</p>
        <Link to="/" className="bg-blue-600 text-white px-4 py-2 rounded">Browse jobs</Link>
      </div>
    );
  if (error) return <div className="max-w-3xl mx-auto p-4"><ErrorBox message={error} /></div>;
  if (!job) return <Spinner />;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <Link to="/" className="text-blue-600">← Back to jobs</Link>
      <div className="bg-white border rounded-lg p-5 mt-3">
        <div className="flex justify-between items-start gap-2">
          <h1 className="text-2xl font-bold">{job.title}</h1>
          {job.type && (
            <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${typeColor[job.type] || "bg-gray-100"}`}>
              {job.type}
            </span>
          )}
        </div>
        <p className="text-gray-700 mt-1">{job.company}{job.location && ` · ${job.location}`}</p>
        <p className="text-sm text-gray-500 mb-4">
          {job.salary && `${job.salary} · `}{timeAgo(job.postedOn)}
        </p>

        <h2 className="font-semibold mb-1">About this job</h2>
        <p className="whitespace-pre-line mb-6">{job.description || "No description provided."}</p>

        <div className="flex flex-wrap gap-2">
          {job.contactEmail && (
            <a href={`mailto:${job.contactEmail}?subject=${encodeURIComponent("Application: " + job.title)}`}
              className="bg-blue-600 text-white px-5 py-2 rounded">
              Apply by email
            </a>
          )}
          <button onClick={share} className="border px-4 py-2 rounded hover:bg-gray-100">Copy link</button>
        </div>
      </div>
    </div>
  );
}
