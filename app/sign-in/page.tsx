import type { Route } from "next";
import Link from "next/link";
import { buildRelativeUrl } from "@/utils/url";
import { SignInForm } from "./form";

export type SignInPageProps = {
  searchParams: Promise<{ next?: Route }>;
};

const SignInPage = async ({ searchParams }: SignInPageProps) => {
  const { next } = await searchParams;

  return (
    <main className="grid place-items-center h-screen">
      <div className="space-y-6">
        <h1 className="font-bold text-3xl text-center">登录</h1>
        <SignInForm />
        <div className="text-sm text-muted-foreground text-center">
          还没有账号？
          <Link
            href={buildRelativeUrl("/sign-up", next ? { next } : undefined)}
            className="underline underline-offset-4"
          >
            注册
          </Link>
        </div>
      </div>
    </main>
  );
};

export default SignInPage;
