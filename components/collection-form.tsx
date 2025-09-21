"use client";

import { valibotResolver } from "@hookform/resolvers/valibot";
import { CheckIcon, ChevronLeftIcon, Loader2Icon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as v from "valibot";
import { createCollection, editCollection } from "@/actions/collection";
import { permissionLevels } from "@/constants/enums";
import type { Collection } from "@/utils/types";
import { PermissionLevelSelect } from "./permission-level-select";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

const collectionFormSchema = v.object({
  title: v.pipe(
    v.string(),
    v.minLength(1, "必填"),
    v.maxLength(20, "最长 20 个字符"),
  ),
  description: v.pipe(v.string(), v.maxLength(200, "最长 200 个字符")),
  collaboratorPermissionLevel: v.picklist(permissionLevels, "权限等级无效"),
  anyonePermissionLevel: v.picklist(permissionLevels, "权限等级无效"),
});

export type CollectionFormProps = {
  mode: "create" | "edit";
  collection?: Collection;
};

export const CollectionForm = ({ mode, collection }: CollectionFormProps) => {
  const form = useForm({
    resolver: valibotResolver(collectionFormSchema),
    defaultValues: collection ?? {
      title: "",
      description: "",
      collaboratorPermissionLevel: "contributor" as const,
      anyonePermissionLevel: "none" as const,
    },
  });

  const [pending, setPending] = useState(false);

  const handleSubmit = form.handleSubmit(async (values) => {
    setPending(true);
    const res =
      mode === "create"
        ? await createCollection(values)
        : mode === "edit" && collection?.id
          ? await editCollection(collection.slug, values)
          : { error: "操作失败，请稍后重试" };
    toast.error(res.error);
    setPending(false);
  });

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
        <FormField
          control={form.control}
          name="collaboratorPermissionLevel"
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between items-center gap-2">
                <FormLabel>协作者的默认权限等级</FormLabel>
                <FormControl>
                  <PermissionLevelSelect
                    options={[
                      { value: "none", disabled: true },
                      { value: "viewer" },
                      { value: "rater" },
                      { value: "contributor" },
                      { value: "admin" },
                    ]}
                    {...field}
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="anyonePermissionLevel"
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between items-center gap-2">
                <FormLabel>获得链接的任何人的权限等级</FormLabel>
                <FormControl>
                  <PermissionLevelSelect
                    options={[
                      { value: "none" },
                      { value: "viewer" },
                      { value: "rater" },
                      { value: "contributor" },
                      { value: "admin", disabled: true },
                    ]}
                    {...field}
                  />
                </FormControl>
              </div>
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
