import { PublicHeader } from "@/components/public/header";

const steps = ["Submit a problem", "Get approved and published", "Launch sprint board", "Collaborate and publish solution"];

export default function HowPage() {
  return (
    <main>
      <PublicHeader />
      <div className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="text-3xl font-bold">How it works</h1>
        <ol className="mt-6 space-y-3">{steps.map((step, i) => <li key={step} className="rounded-md border p-4">{i + 1}. {step}</li>)}</ol>
      </div>
    </main>
  );
}
