"use client";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { debounce } from "lodash-es";
import { CheckIcon, Loader2Icon, XIcon } from "lucide-react";
import { useCallback, useId, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as v from "valibot";
import {
  createCollectionItem,
  editCollectionItem,
} from "@/actions/collection-item";
import { inferCollectionItem } from "@/actions/infer";
import { sourceConfigs } from "@/sources";
import type { CollectionItem } from "@/utils/types";
import { Button } from "./ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";

const formSchema = v.object({
  source: v.picklist(
    sourceConfigs.map((sourceConfig) => sourceConfig.source),
    "来源无效",
  ),
  title: v.pipe(
    v.string(),
    v.minLength(1, "必填"),
    v.maxLength(200, "最长 200 个字符"),
  ),
  description: v.pipe(v.string(), v.maxLength(500, "最长 500 个字符")),
  url: v.union([v.literal(""), v.pipe(v.string(), v.url("格式错误"))]),
  coverUrl: v.union([v.literal(""), v.pipe(v.string(), v.url("格式错误"))]),
});

export type CollectionItemFormDialogContentProps = {
  collectionSlug: string;
  mode: "create" | "edit";
  collectionItem?: CollectionItem;
  closeDialog?: () => void;
};

export const CollectionItemFormDialogContent = ({
  collectionSlug,
  mode,
  collectionItem,
  closeDialog,
}: CollectionItemFormDialogContentProps) => {
  const form = useForm({
    resolver: valibotResolver(formSchema),
    defaultValues: collectionItem ?? {
      source: "custom",
      title: "",
      description: "",
      url: "",
      coverUrl: "",
    },
  });

  const [input, setInput] = useState("");
  const [inferring, setInferring] = useState(false);

  const handleInfer = useCallback(
    debounce(async (input: string) => {
      if (!input) {
        return;
      }
      setInferring(true);
      const res = await inferCollectionItem(input);
      if (res.ok) {
        form.setValue("source", res.source);
        form.setValue("title", res.title ?? "");
        form.setValue("description", res.description ?? "");
        form.setValue("url", res.url ?? "");
        form.setValue("coverUrl", res.coverUrl ?? "");
      } else {
        toast.error(res.error);
      }
      setInferring(false);
    }, 200),
    [],
  );

  const [pending, setPending] = useState(false);

  const handleSubmit = form.handleSubmit(async (values) => {
    setPending(true);
    const res =
      mode === "create"
        ? await createCollectionItem(collectionSlug, values)
        : mode === "edit" && collectionItem
          ? await editCollectionItem(collectionItem.slug, values)
          : { error: "操作失败，请稍后重试" };
    if (res?.error) {
      toast.error(res.error);
    } else {
      form.reset();
      setInput("");
      closeDialog?.();
    }
    setPending(false);
  });

  const formId = useId();

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{mode === "create" ? "添加作品" : "编辑作品"}</DialogTitle>
        <DialogDescription>
          {mode === "create" ? "好东西就要一起分享！" : "修改作品的信息"}
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={handleSubmit} className="space-y-4" id={formId}>
          {mode === "create" && (
            <FormItem>
              <FormLabel>智能识别</FormLabel>
              <div className="relative">
                <Textarea
                  value={input}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    setInput(newValue);
                    handleInfer(newValue);
                  }}
                  placeholder="在这里粘贴番号、JM 号、链接等，智能识别作品信息"
                />
                {inferring && (
                  <Loader2Icon className="absolute right-2 bottom-2 size-4 text-muted-foreground animate-spin" />
                )}
              </div>
            </FormItem>
          )}
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
                      {sourceConfigs.map((sourceConfig) => (
                        <SelectItem
                          key={sourceConfig.source}
                          value={sourceConfig.source}
                        >
                          {sourceConfig.name ?? sourceConfig.source}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
            name="coverUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>封面</FormLabel>
                <FormControl>
                  <Input placeholder="https://" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="secondary">
            <XIcon />
            取消
          </Button>
        </DialogClose>
        <Button type="submit" form={formId} disabled={pending}>
          {pending ? <Loader2Icon className="animate-spin" /> : <CheckIcon />}
          确定
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};
