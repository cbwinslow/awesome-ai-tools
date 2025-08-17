import { useState } from "react";

export default function Combine() {
  const [text, setText] = useState("");
  const [image, setImage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setImage("");
    try {
      const sumRes = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const sumData = await sumRes.json();
      if (!sumRes.ok) throw new Error(sumData.error || "Summary failed");
      const imgRes = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: sumData.summary }),
      });
      const imgData = await imgRes.json();
      if (!imgRes.ok) throw new Error(imgData.error || "Image failed");
      setImage(imgData.url);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h1>Summarize then Generate Image</h1>
      <form onSubmit={handleSubmit}>
        <textarea value={text} onChange={(e) => setText(e.target.value)} />
        <button type="submit">Go</button>
      </form>
      {image && <img src={image} alt="Result" />}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
