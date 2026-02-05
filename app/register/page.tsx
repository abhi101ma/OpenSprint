import { registerAction } from "@/lib/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  return (
    <main className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-3xl font-bold">Create account</h1>
      <form action={registerAction} className="mt-6 space-y-4">
        <Input name="name" placeholder="Full Name" required />
        <Input name="email" type="email" placeholder="Email" required />
        <Input name="password" type="password" placeholder="Password" required />
        <Button type="submit" className="w-full">Register</Button>
      </form>
    </main>
  );
}
