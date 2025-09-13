"use client";

import { valibotResolver } from "@hookform/resolvers/valibot";
import { Loader2Icon, UserRoundPlusIcon } from "lucide-react";
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
import { signUp } from "@/server/auth";

const signUpFormSchema = v.pipe(
  v.object({
    email: v.pipe(v.string(), v.email("格式错误")),
    password: v.pipe(
      v.string(),
      v.minLength(8, "最短 8 个字符"),
      v.maxLength(20, "最长 20 个字符"),
    ),
    confirmPassword: v.string(),
    nickname: v.pipe(
      v.string(),
      v.minLength(2, "最短 2 个字符"),
      v.maxLength(20, "最长 20 个字符"),
    ),
  }),
  v.forward(
    v.partialCheck(
      [["password"], ["confirmPassword"]],
      (input) => input.password === input.confirmPassword,
      "两次输入的密码不一致",
    ),
    ["confirmPassword"],
  ),
);

export const SignUpForm = () => {
  const form = useForm({
    resolver: valibotResolver(signUpFormSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      nickname: "",
    },
  });

  const [pending, setPending] = useState(false);

  const handleSubmit = form.handleSubmit(
    async (values: v.InferOutput<typeof signUpFormSchema>) => {
      setPending(true);
      const res = await signUp(values);
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
                <Input {...field} type="password" placeholder="8-20 个字符" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>确认密码</FormLabel>
              <FormControl>
                <Input {...field} type="password" placeholder="再次输入密码" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="nickname"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>昵称</FormLabel>
              <FormControl>
                <Input {...field} placeholder="2-20 个字符" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={pending} className="w-full">
          {pending ? (
            <Loader2Icon className="animate-spin" />
          ) : (
            <UserRoundPlusIcon />
          )}
          注册
        </Button>
      </form>
    </Form>
  );
};
