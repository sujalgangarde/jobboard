export const TYPES = ["Full-time", "Part-time", "Internship", "Contract"];

export const typeColor = {
  "Full-time": "bg-blue-100 text-blue-700",
  "Part-time": "bg-purple-100 text-purple-700",
  Internship: "bg-green-100 text-green-700",
  Contract: "bg-orange-100 text-orange-700",
};

export function timeAgo(dateStr) {
  if (!dateStr) return "";
  const d = Math.floor((Date.now() - new Date(dateStr)) / 86400000);
  if (d <= 0) return "Posted today";
  if (d === 1) return "Posted yesterday";
  if (d < 30) return `Posted ${d} days ago`;
  const m = Math.floor(d / 30);
  return m === 1 ? "Posted 1 month ago" : `Posted ${m} months ago`;
}

export function errMsg(err) {
  if (!err.response) return "Cannot reach the server. Make sure the backend is running.";
  return err.response.data?.error || "Something went wrong. Please try again.";
}
