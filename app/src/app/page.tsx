import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
        Learn to Code with AI
      </h1>
      <p className="mt-4 text-lg text-gray-500">
        Your full-stack training template is running. Let&apos;s get started.
      </p>
      <div className="mt-8">
        <Link href="/learn" className="btn-primary">
          Start the Tutorial
        </Link>
      </div>
    </div>
  );
}
