import Link from "next/link";

export function PublicHeader() {
  return (
    <header className="border-b bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-xl font-bold">OpenSprint</Link>
        <nav className="flex gap-4 text-sm">
          <Link href="/about">About</Link>
          <Link href="/how-it-works">How it works</Link>
          <Link href="/problems">Problems</Link>
          <Link href="/gallery">Gallery</Link>
          <Link href="/login">Login</Link>
        </nav>
      </div>
    </header>
  );
}
