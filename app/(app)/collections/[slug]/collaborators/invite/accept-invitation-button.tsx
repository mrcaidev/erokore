"use client";

import { CheckIcon, Loader2Icon } from "lucide-react";
import { useParams, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { acceptInvitation } from "@/server/invitation";

export const AcceptInvitationButton = () => {
  const { slug } = useParams<{ slug: string }>();
  const searchParams = useSearchParams();
  const code = searchParams.get("code") ?? "";

  const [pending, setPending] = useState(false);

  const handleClick = async () => {
    setPending(true);
    const res = await acceptInvitation({ collectionSlug: slug, code });
    if (res.error) {
      toast.error(res.error);
    }
    setPending(false);
  };

  return (
    <Button onClick={handleClick} disabled={pending}>
      {pending ? <Loader2Icon className="animate-spin" /> : <CheckIcon />}
      同意
    </Button>
  );
};
