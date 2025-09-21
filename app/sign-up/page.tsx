import type { Route } from "next";
import Link from "next/link";
import { SignUpForm } from "./form";

export type SignUpPageProps = {
  searchParams: Promise<{ next?: Route }>;
};

const SignUpPage = async ({ searchParams }: SignUpPageProps) => {
  const { next = "/" } = await searchParams;

  return (
    <main className="grid place-items-center h-screen">
      <div className="space-y-6">
        <h1 className="font-bold text-3xl text-center">注册</h1>
        <SignUpForm />
        <div className="text-sm text-muted-foreground text-center">
          已经有账号？
          <Link
            href={`/sign-in?next=${encodeURIComponent(next)}`}
            className="underline underline-offset-4"
          >
            登录
          </Link>
        </div>
      </div>
    </main>
  );
};

export default SignUpPage;
