"use client";

import { valibotResolver } from "@hookform/resolvers/valibot";
import { ChevronLeftIcon, Loader2Icon, PlusIcon } from "lucide-react";
import Link from "next/link";
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
import { Textarea } from "@/components/ui/textarea";
import { createCollection } from "@/server/collection";

const createCollectionFormSchema = v.object({
  title: v.pipe(
    v.string(),
    v.minLength(1, "必填"),
    v.maxLength(20, "需要 1-20 个字符"),
  ),
  description: v.pipe(
    v.string(),
    v.minLength(0, "需要 0-200 个字符"),
    v.maxLength(200, "需要 0-200 个字符"),
  ),
});

export const CreateCollectionForm = () => {
  const form = useForm({
    resolver: valibotResolver(createCollectionFormSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const [pending, setPending] = useState(false);

  const handleSubmit = form.handleSubmit(
    async (values: v.InferOutput<typeof createCollectionFormSchema>) => {
      setPending(true);
      const res = await createCollection(values);
      if (res.error) {
        setPending(false);
        toast.error(res.error);
      }
    },
  );

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-4 w-xs">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>标题</FormLabel>
              <FormControl>
                <Input {...field} placeholder="1-20 个字符" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>描述</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="0-200 个字符" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-2">
          <Button variant="secondary" asChild>
            <Link href="/">
              <ChevronLeftIcon />
              返回
            </Link>
          </Button>
          <Button type="submit" disabled={pending} className="w-full">
            {pending ? <Loader2Icon className="animate-spin" /> : <PlusIcon />}
            创建
          </Button>
        </div>
      </form>
    </Form>
  );
};
