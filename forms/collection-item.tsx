"use client";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as v from "valibot";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { sources } from "@/database/schema";
import { createCollectionItem } from "@/server/collection-item";
import { SOURCE_LABEL_MAP } from "@/utils/source";
import type { CollectionItem } from "@/utils/types";

const collectionItemFormSchema = v.object({
  source: v.picklist(sources, "来源无效"),
  title: v.pipe(
    v.string(),
    v.minLength(1, "必填"),
    v.maxLength(200, "最长 200 个字符"),
  ),
  description: v.pipe(v.string(), v.maxLength(500, "最长 500 个字符")),
  url: v.union([
    v.literal(""),
    v.pipe(v.string(), v.url("格式错误"), v.maxLength(500, "最长 500 个字符")),
  ]),
});

export type CollectionFormProps = {
  collectionId: number;
  mode: "create" | "edit";
  collectionItem?: CollectionItem;
  beforeSubmit?: () => void;
  afterSubmit?: () => void;
};

export const CollectionItemForm = ({
  collectionId,
  mode,
  collectionItem,
  beforeSubmit,
  afterSubmit,
}: CollectionFormProps) => {
  const form = useForm({
    resolver: valibotResolver(collectionItemFormSchema),
    defaultValues: collectionItem ?? {
      source: "custom" as const,
      title: "",
      description: "",
      url: "",
    },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    beforeSubmit?.();
    const res =
      mode === "create"
        ? await createCollectionItem({ ...values, collectionId, coverUrl: "" })
        : { error: "not implemented" };
    if (res?.error) {
      toast.error(res.error);
    }
    afterSubmit?.();
  });

  return (
    <Form {...form}>
      {/** biome-ignore lint/correctness/useUniqueElementIds: 跨组件引用 */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4"
        id="addCollectionItem"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>标题</FormLabel>
              <FormControl>
                <Input placeholder="1-200 个字符" {...field} />
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
                <Textarea placeholder="0-500 个字符" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>链接</FormLabel>
              <FormControl>
                <Input placeholder="https://" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="source"
          render={({ field }) => (
            <FormItem>
              <FormLabel>来源</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} {...field}>
                  <SelectTrigger>
                    <SelectValue placeholder="请选择" />
                  </SelectTrigger>
                  <SelectContent>
                    {sources.map((source) => (
                      <SelectItem key={source} value={source}>
                        {SOURCE_LABEL_MAP[source]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
