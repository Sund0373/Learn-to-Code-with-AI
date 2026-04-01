interface InfoCalloutProps {
  variant: "info" | "warning" | "tip" | "success";
  content: string;
}

const config = {
  info: {
    border: "border-l-blue-500",
    bg: "bg-blue-50",
    icon: "i",
    iconBg: "bg-blue-500",
    text: "text-blue-900",
  },
  warning: {
    border: "border-l-amber-500",
    bg: "bg-amber-50",
    icon: "!",
    iconBg: "bg-amber-500",
    text: "text-amber-900",
  },
  tip: {
    border: "border-l-green-500",
    bg: "bg-green-50",
    icon: "~",
    iconBg: "bg-green-600",
    text: "text-green-900",
  },
  success: {
    border: "border-l-green-500",
    bg: "bg-green-50",
    icon: "\u2713",
    iconBg: "bg-green-600",
    text: "text-green-900",
  },
};

export default function InfoCallout({ variant, content }: InfoCalloutProps) {
  const c = config[variant];
  return (
    <div className={`my-4 flex gap-3 rounded-r-lg border-l-4 ${c.border} ${c.bg} p-4`}>
      <span
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${c.iconBg} text-xs font-bold text-white`}
      >
        {c.icon}
      </span>
      <p className={`text-sm leading-relaxed ${c.text}`}>{content}</p>
    </div>
  );
}
