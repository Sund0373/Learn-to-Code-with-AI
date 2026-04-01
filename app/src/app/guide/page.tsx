import fs from "fs";
import path from "path";
import ReactMarkdown from "react-markdown";

export default function GuidePage() {
  const content = fs.readFileSync(
    path.join(process.cwd(), "..", "USER_GUIDE.md"),
    "utf-8"
  );

  return (
    <div className="mx-auto max-w-4xl py-8">
      <article className="prose prose-gray max-w-none">
        <ReactMarkdown>{content}</ReactMarkdown>
      </article>
    </div>
  );
}
