import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api";
import Spinner from "../components/Spinner";
import { useToast } from "../toast";
import { TYPES, errMsg } from "../utils";

const empty = {
  title: "", company: "", location: "", type: "Full-time",
  salary: "", contactEmail: "", description: "",
};

const FIELDS = [
  { name: "title", label: "Job title", required: true, placeholder: "e.g. Java Backend Developer" },
  { name: "company", label: "Company", required: true, placeholder: "e.g. Acme Technologies" },
  { name: "location", label: "Location", placeholder: "e.g. Pune or Remote" },
  { name: "salary", label: "Salary", placeholder: "e.g. ₹6-9 LPA" },
  { name: "contactEmail", label: "Contact email (applications go here)", type: "email", placeholder: "hr@company.com" },
];

export default function JobForm() {
  const { id } = useParams();
  const nav = useNavigate();
  const toast = useToast();
  const [job, setJob] = useState(empty);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(!!id);
  const [notFound, setNotFound] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    document.title = `${id ? "Edit" : "Add"} job - JobBoard`;
    if (!id) return;
    api.get(`/jobs/${id}`)
      .then((r) => setJob({ ...empty, ...r.data }))
      .catch((e) => (e.response?.status === 404 ? setNotFound(true) : toast(errMsg(e), "error")))
      .finally(() => setLoading(false));
  }, [id]);

  const change = (e) => {
    setJob({ ...job, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: undefined });
  };

  const validate = () => {
    const er = {};
    if (!job.title.trim()) er.title = "Job title is required";
    if (!job.company.trim()) er.company = "Company is required";
    if (job.contactEmail && !/^\S+@\S+\.\S+$/.test(job.contactEmail)) er.contactEmail = "Enter a valid email";
    return er;
  };

  const submit = async (e) => {
    e.preventDefault();
    const er = validate();
    setErrors(er);
    if (Object.keys(er).length) {
      toast("Please fix the highlighted fields", "error");
      return;
    }
    setSaving(true);
    try {
      if (id) await api.put(`/jobs/${id}`, job);
      else await api.post("/jobs", job);
      toast(id ? "Job updated" : "Job posted");
      nav("/admin");
    } catch (err) {
      if (err.response?.data?.fields) setErrors(err.response.data.fields);
      toast(errMsg(err), "error");
      setSaving(false);
    }
  };

  if (loading) return <Spinner />;
  if (notFound)
    return (
      <div className="max-w-xl mx-auto p-4 text-center">
        <p className="mb-3">This job no longer exists.</p>
        <Link to="/admin" className="bg-blue-600 text-white px-4 py-2 rounded">Back to dashboard</Link>
      </div>
    );

  const cls = (n) =>
    `w-full border p-2.5 rounded focus:outline-none focus:ring-2 ${
      errors[n] ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-blue-500"}`;

  return (
    <form onSubmit={submit} noValidate className="max-w-xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">{id ? "Edit Job" : "Add Job"}</h1>
      <div className="bg-white border rounded-lg p-4">
        {FIELDS.map((f) => (
          <div key={f.name} className="mb-3">
            <label htmlFor={f.name} className="block text-sm font-medium mb-1">
              {f.label}{f.required && <span className="text-red-600"> *</span>}
            </label>
            <input id={f.name} name={f.name} type={f.type || "text"} value={job[f.name] ?? ""}
              onChange={change} placeholder={f.placeholder} className={cls(f.name)} />
            {errors[f.name] && <p className="text-red-600 text-sm mt-1">{errors[f.name]}</p>}
          </div>
        ))}

        <div className="mb-3">
          <label htmlFor="type" className="block text-sm font-medium mb-1">Job type</label>
          <select id="type" name="type" value={job.type ?? ""} onChange={change} className={cls("type")}>
            {TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>

        <div className="mb-1">
          <label htmlFor="description" className="block text-sm font-medium mb-1">Description</label>
          <textarea id="description" name="description" rows="8" maxLength={3000}
            value={job.description ?? ""} onChange={change}
            placeholder="What will the person do? What skills are needed?"
            className={cls("description")} />
          <p className="text-xs text-gray-500 text-right">{(job.description || "").length}/3000</p>
          {errors.description && <p className="text-red-600 text-sm">{errors.description}</p>}
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <button disabled={saving} className="bg-blue-600 text-white px-5 py-2 rounded disabled:opacity-60">
          {saving ? "Saving..." : id ? "Save changes" : "Post job"}
        </button>
        <Link to="/admin" className="border px-5 py-2 rounded bg-white">Cancel</Link>
      </div>
    </form>
  );
}
