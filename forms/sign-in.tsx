"use client";

import { valibotResolver } from "@hookform/resolvers/valibot";
import { Loader2Icon, LogInIcon } from "lucide-react";
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
import { signIn } from "@/server/auth";

const signInFormSchema = v.object({
  email: v.pipe(v.string(), v.email("格式错误")),
  password: v.pipe(
    v.string(),
    v.minLength(8, "最短 8 个字符"),
    v.maxLength(20, "最长 20 个字符"),
  ),
});

export const SignInForm = () => {
  const form = useForm({
    resolver: valibotResolver(signInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [pending, setPending] = useState(false);

  const handleSubmit = form.handleSubmit(
    async (values: v.InferOutput<typeof signInFormSchema>) => {
      setPending(true);
      const res = await signIn(values);
      setPending(false);
      toast.error(res.error);
    },
  );

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-4 w-xs">
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
                <Input {...field} type="password" placeholder="请输入" />
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
};
