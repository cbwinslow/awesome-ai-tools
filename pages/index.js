import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1>Awesome AI Tools Demo</h1>
      <ul>
        <li>
          <Link href="/summarize">Summarize Text</Link>
        </li>
        <li>
          <Link href="/generate-image">Generate Image</Link>
        </li>
        <li>
          <Link href="/combine">Summarize & Generate Image</Link>
        </li>
      </ul>
    </div>
  );
}
