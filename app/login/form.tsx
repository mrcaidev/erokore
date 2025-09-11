"use client";

import { valibotResolver } from "@hookform/resolvers/valibot";
import { Loader2Icon, LogInIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as v from "valibot";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useUser } from "@/stores/user";
import { login } from "./actions";

const loginFormSchema = v.object({
  email: v.pipe(v.string(), v.email("格式错误")),
  password: v.pipe(
    v.string(),
    v.minLength(8, "需要 8-20 个字符"),
    v.maxLength(20, "需要 8-20 个字符"),
  ),
});

export function LoginForm() {
  const form = useForm({
    resolver: valibotResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [pending, setPending] = useState(false);

  const setUser = useUser((store) => store.setUser);

  const router = useRouter();

  const handleSubmit = form.handleSubmit(
    async (values: v.InferOutput<typeof loginFormSchema>) => {
      setPending(true);
      const res = await login(values);
      setPending(false);

      if (!res.ok) {
        toast.error(res.error);
        return;
      }

      toast.success(`欢迎回来，${res.user.nickname}！`);
      setUser(res.user);
      localStorage.setItem("token", res.jwt);
      router.push("/");
    },
  );

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-4 min-w-xs">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>邮箱</FormLabel>
              <FormControl>
                <Input {...field} type="email" placeholder="you@example.com" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>密码</FormLabel>
              <FormControl>
                <Input {...field} type="password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={pending} className="w-full">
          {pending ? <Loader2Icon className="animate-spin" /> : <LogInIcon />}
          登录
        </Button>
      </form>
    </Form>
  );
}
