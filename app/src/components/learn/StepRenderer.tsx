import { Section, ContentBlock } from "@/data/types";
import CodeBlock from "./CodeBlock";
import TerminalBlock from "./TerminalBlock";
import InfoCallout from "./InfoCallout";

function renderBlock(block: ContentBlock, index: number) {
  switch (block.type) {
    case "text":
      return (
        <p key={index} className="my-3 text-sm leading-relaxed text-gray-700">
          {block.content.split("`").map((part, i) =>
            i % 2 === 1 ? (
              <code
                key={i}
                className="rounded bg-gray-100 px-1.5 py-0.5 text-xs font-medium text-action-primary"
              >
                {part}
              </code>
            ) : (
              <span key={i}>{part}</span>
            )
          )}
        </p>
      );

    case "code":
      return (
        <CodeBlock
          key={index}
          code={block.content}
          language={block.language}
          label={block.label}
        />
      );

    case "terminal":
      return (
        <TerminalBlock
          key={index}
          command={block.content}
          label={block.label}
        />
      );

    case "file-tree":
      return (
        <div key={index} className="my-4 overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
          {block.label && (
            <div className="border-b border-gray-200 bg-gray-100 px-4 py-2">
              <span className="text-xs font-medium text-gray-500">{block.label}</span>
            </div>
          )}
          <pre className="overflow-x-auto p-4">
            <code className="text-xs leading-relaxed text-gray-600">{block.content}</code>
          </pre>
        </div>
      );

    case "callout":
      return (
        <InfoCallout
          key={index}
          variant={block.variant || "info"}
          content={block.content}
        />
      );

    case "checklist":
      return (
        <ul key={index} className="my-4 space-y-2">
          {(block.items || []).map((item, i) => (
            <li key={i} className="flex gap-3 text-sm text-gray-700">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border border-gray-300 bg-white text-xs text-gray-400">
                {i + 1}
              </span>
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      );

    default:
      return null;
  }
}

interface StepRendererProps {
  sections: Section[];
}

export default function StepRenderer({ sections }: StepRendererProps) {
  return (
    <div className="space-y-8">
      {sections.map((section, sIdx) => (
        <section key={sIdx}>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {section.title}
          </h3>
          <div>{section.blocks.map((block, bIdx) => renderBlock(block, bIdx))}</div>
        </section>
      ))}
    </div>
  );
}
