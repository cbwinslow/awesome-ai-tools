import { useState } from "react";

export default function GenerateImage() {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setImage("");
    try {
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      setImage(data.url);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h1>Generate Image</h1>
      <form onSubmit={handleSubmit}>
        <input value={prompt} onChange={(e) => setPrompt(e.target.value)} />
        <button type="submit">Generate</button>
      </form>
      {image && <img src={image} alt="Generated" />}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
