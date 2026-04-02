import { Section, ContentBlock } from "@/data/types";
import CodeBlock from "./CodeBlock";
import TerminalBlock from "./TerminalBlock";
import InfoCallout from "./InfoCallout";
import SeedDatabase from "./SeedDatabase";

const componentMap: Record<string, React.ComponentType> = {
  SeedDatabase,
};

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

    case "link":
      return (
        <a
          key={index}
          href={block.content}
          target="_blank"
          rel="noopener noreferrer"
          className="my-4 flex items-center gap-2 rounded-lg border border-action-primary/20 bg-blue-50 px-4 py-3 text-sm font-medium text-action-primary hover:bg-blue-100 transition-colors"
        >
          <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          {block.label || block.content}
        </a>
      );

    case "component": {
      const Component = componentMap[block.content];
      if (!Component) return null;
      return <Component key={index} />;
    }

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
