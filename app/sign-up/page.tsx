import Link from "next/link";
import { SignUpForm } from "@/forms/sign-up";

const SignUpPage = () => {
  return (
    <main className="grid place-items-center h-screen">
      <div className="space-y-6">
        <h1 className="font-bold text-3xl text-center">注册</h1>
        <SignUpForm />
        <div className="text-sm text-muted-foreground text-center">
          已经有账号？
          <Link href="/sign-in" className="underline underline-offset-4">
            登录
          </Link>
        </div>
      </div>
    </main>
  );
};

export default SignUpPage;
