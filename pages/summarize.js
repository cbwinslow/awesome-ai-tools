import { useState } from "react";

export default function Summarize() {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSummary("");
    try {
      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      setSummary(data.summary);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h1>Summarize Text</h1>
      <form onSubmit={handleSubmit}>
        <textarea value={text} onChange={(e) => setText(e.target.value)} />
        <button type="submit">Summarize</button>
      </form>
      {summary && <p>Summary: {summary}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
