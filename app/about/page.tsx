import { PublicHeader } from "@/components/public/header";

export default function AboutPage() {
  return (
    <main>
      <PublicHeader />
      <div className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="text-3xl font-bold">About OpenSprint</h1>
        <p className="mt-4 text-muted-foreground">OpenSprint is a collaboration hub where businesses post practical problems and emerging technical talent builds production-minded solutions.</p>
      </div>
    </main>
  );
}
