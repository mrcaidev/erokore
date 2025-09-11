import { LoginForm } from "./form";

export default function LoginPage() {
  return (
    <main className="grid place-items-center h-screen">
      <div className="space-y-6">
        <h1 className="font-bold text-3xl text-center">登录</h1>
        <LoginForm />
      </div>
    </main>
  );
}
