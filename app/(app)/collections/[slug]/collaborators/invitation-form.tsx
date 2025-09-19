"use client";

import { valibotResolver } from "@hookform/resolvers/valibot";
import {
  CopyCheckIcon,
  CopyIcon,
  Link2Icon,
  Loader2Icon,
  RotateCwIcon,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as v from "valibot";
import { PermissionLevelSelect } from "@/components/permission-level-select";
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
import { defaultablePermissionLevels } from "@/database/schema";
import { generateInvitation } from "@/server/invitation";
import { PERMISSION_LEVEL_LABEL_MAP } from "@/utils/permission";
import type { Invitation, PersonalizedCollection } from "@/utils/types";

const invitationFormSchema = v.object({
  permissionLevel: v.picklist(defaultablePermissionLevels, "权限等级无效"),
  expiresDay: v.pipe(
    v.number(),
    v.integer("天数必须是整数"),
    v.minValue(1, "最少 1 天"),
    v.maxValue(999, "最多 999 天"),
  ),
});

export type InvitationFormProps = {
  collection: PersonalizedCollection;
};

export const InvitationForm = ({ collection }: InvitationFormProps) => {
  const form = useForm({
    resolver: valibotResolver(invitationFormSchema),
    defaultValues: {
      permissionLevel: "default" as const,
      expiresDay: 7,
    },
  });

  const [invitation, setInvitation] = useState<Invitation | undefined>(
    undefined,
  );
  const [pending, setPending] = useState(false);

  const handleSubmit = form.handleSubmit(async (values) => {
    setPending(true);
    const res = await generateInvitation({
      collectionId: collection.id,
      permissionLevel: values.permissionLevel,
      expiresAt: new Date(Date.now() + values.expiresDay * 24 * 60 * 60 * 1000),
    });
    if (res.ok) {
      setInvitation(res.invitation);
    } else {
      toast.error(res.error);
    }
    setPending(false);
  });

  const invitationUrl = `${window.location.href}/invite?code=${invitation?.code ?? ""}`;
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(invitationUrl);
      setCopied(true);
      toast.success("复制成功");
    } catch {
      toast.error("复制失败，不过你可以手动选中复制~");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          control={form.control}
          name="permissionLevel"
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between items-center">
                <FormLabel>权限等级</FormLabel>
                <FormControl>
                  <PermissionLevelSelect
                    {...field}
                    options={[
                      {
                        value: "default",
                        label: `跟随默认（${PERMISSION_LEVEL_LABEL_MAP[collection.collaboratorPermissionLevel]}）`,
                      },
                      { value: "viewer" },
                      { value: "rater" },
                      { value: "contributor" },
                      { value: "admin" },
                    ]}
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="expiresDay"
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between items-center">
                <FormLabel>过期天数</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    placeholder="1-999"
                    className="max-w-20"
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={pending} className="w-full">
          {pending ? (
            <Loader2Icon className="animate-spin" />
          ) : invitation ? (
            <RotateCwIcon />
          ) : (
            <Link2Icon />
          )}
          {invitation ? "重新生成链接" : "生成邀请链接"}
        </Button>
        {invitation && (
          <div className="flex items-center">
            <Input value={invitationUrl} readOnly className="rounded-r-none" />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleCopy}
              aria-label="复制分享链接"
              className="rounded-l-none"
            >
              {copied ? <CopyCheckIcon /> : <CopyIcon />}
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
};
