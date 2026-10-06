import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import Spinner from "../components/Spinner";
import ErrorBox from "../components/ErrorBox";
import ConfirmModal from "../components/ConfirmModal";
import { useToast } from "../toast";
import { errMsg, timeAgo } from "../utils";

export default function Dashboard() {
  const toast = useToast();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("");
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    setError("");
    api.get("/jobs")
      .then((r) => setJobs(r.data))
      .catch((e) => setError(errMsg(e)))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { document.title = "Manage jobs - JobBoard"; load(); }, [load]);

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/jobs/${toDelete.id}`);
      setJobs((list) => list.filter((x) => x.id !== toDelete.id));
      toast("Job deleted");
      setToDelete(null);
    } catch (e) {
      toast(errMsg(e), "error");
    } finally {
      setDeleting(false);
    }
  };

  const shown = jobs.filter((j) =>
    `${j.title} ${j.company} ${j.location || ""}`.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
        <div>
          <h1 className="text-xl font-bold">Manage Jobs</h1>
          {!loading && !error && <p className="text-sm text-gray-500">{jobs.length} total</p>}
        </div>
        <Link to="/admin/new" className="bg-green-600 text-white px-4 py-2 rounded">+ Add Job</Link>
      </div>

      {jobs.length > 0 && (
        <input type="search" placeholder="Filter jobs..." value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full border border-gray-300 bg-white p-2.5 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
      )}

      {loading && <Spinner />}
      {!loading && error && <ErrorBox message={error} onRetry={load} />}

      {!loading && !error && (
        <>
          {shown.map((j) => (
            <div key={j.id} className="bg-white border rounded-lg p-3 mb-2 flex flex-wrap justify-between items-center gap-2">
              <div>
                <p className="font-semibold">{j.title}</p>
                <p className="text-sm text-gray-600">
                  {j.company}{j.location && ` · ${j.location}`} · {timeAgo(j.postedOn)}
                </p>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Link to={`/jobs/${j.id}`} className="text-gray-600 hover:underline">View</Link>
                <Link to={`/admin/edit/${j.id}`} className="text-blue-600 hover:underline">Edit</Link>
                <button onClick={() => setToDelete(j)} className="text-red-600 hover:underline">Delete</button>
              </div>
            </div>
          ))}
          {jobs.length === 0 && (
            <div className="text-center bg-white border rounded-lg p-8">
              <p className="text-gray-600 mb-3">No jobs yet. Add your first job.</p>
              <Link to="/admin/new" className="bg-green-600 text-white px-4 py-2 rounded">+ Add Job</Link>
            </div>
          )}
          {jobs.length > 0 && shown.length === 0 && (
            <p className="text-center text-gray-500 py-6">No jobs match your filter.</p>
          )}
        </>
      )}

      {toDelete && (
        <ConfirmModal
          title="Delete this job?"
          message={`"${toDelete.title}" at ${toDelete.company} will be removed permanently.`}
          busy={deleting}
          onConfirm={confirmDelete}
          onCancel={() => !deleting && setToDelete(null)}
        />
      )}
    </div>
  );
}
