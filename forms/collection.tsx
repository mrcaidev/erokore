"use client";

import { valibotResolver } from "@hookform/resolvers/valibot";
import { CheckIcon, ChevronLeftIcon, Loader2Icon } from "lucide-react";
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
import { createCollection, editCollection } from "@/server/collection";
import type { PersonalizedCollection } from "@/utils/types";

const collectionFormSchema = v.object({
  title: v.pipe(
    v.string(),
    v.minLength(1, "必填"),
    v.maxLength(20, "最长 20 个字符"),
  ),
  description: v.pipe(v.string(), v.maxLength(200, "最长 200 个字符")),
});

export type CollectionFormProps = {
  mode: "create" | "edit";
  collection?: PersonalizedCollection;
};

export const CollectionForm = ({ mode, collection }: CollectionFormProps) => {
  const form = useForm({
    resolver: valibotResolver(collectionFormSchema),
    defaultValues: collection ?? {
      title: "",
      description: "",
    },
  });

  const [pending, setPending] = useState(false);

  const handleSubmit = form.handleSubmit(
    async (values: v.InferOutput<typeof collectionFormSchema>) => {
      setPending(true);
      const res =
        mode === "create"
          ? await createCollection(values)
          : mode === "edit" && collection?.id
            ? await editCollection({ id: collection.id, ...values })
            : { error: "编辑失败，请稍后重试" };
      setPending(false);
      toast.error(res.error);
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
            <Link
              href={
                mode === "edit" && collection?.slug
                  ? `/collections/${collection.slug}`
                  : "/"
              }
            >
              <ChevronLeftIcon />
              返回
            </Link>
          </Button>
          <Button type="submit" disabled={pending}>
            {pending ? <Loader2Icon className="animate-spin" /> : <CheckIcon />}
            确定
          </Button>
        </div>
      </form>
    </Form>
  );
};
