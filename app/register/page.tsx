import { RegisterForm } from "./form";

export default function RegisterPage() {
  return (
    <main className="grid place-items-center h-screen">
      <div className="space-y-6">
        <h1 className="font-bold text-3xl text-center">注册</h1>
        <RegisterForm />
      </div>
    </main>
  );
}
