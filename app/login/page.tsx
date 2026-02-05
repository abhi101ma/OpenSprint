import { loginAction } from "@/lib/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-3xl font-bold">Login</h1>
      <form action={loginAction} className="mt-6 space-y-4">
        <Input name="email" type="email" placeholder="Email" required />
        <Input name="password" type="password" placeholder="Password" required />
        <Button type="submit" className="w-full">Login</Button>
      </form>
      <p className="mt-4 text-sm">No account? <Link className="underline" href="/register">Register</Link></p>
    </main>
  );
}
