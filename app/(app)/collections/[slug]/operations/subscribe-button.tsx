"use client";

import { EyeIcon, EyeOffIcon } from "lucide-react";
import { startTransition, useOptimistic } from "react";
import { toast } from "sonner";
import {
  subscribeToCollection,
  unsubscribeFromCollection,
} from "@/actions/subscription";
import { Button } from "@/components/ui/button";
import type { PersonalizedCollection } from "@/utils/types";

export type SubscribeButtonProps = {
  collection: PersonalizedCollection;
};

export const SubscribeButton = ({ collection }: SubscribeButtonProps) => {
  const subscribed = collection.mySubscribed;

  const [optimisticSubscribed, toggleOptimisticSubscribed] = useOptimistic<
    boolean,
    void
  >(subscribed, (subscribed) => !subscribed);

  const handleClick = async () => {
    startTransition(() => {
      toggleOptimisticSubscribed();
    });

    const action = subscribed
      ? unsubscribeFromCollection
      : subscribeToCollection;
    const res = await action(collection.slug);
    if (res?.error) {
      toast.error(res.error);
    }
  };

  return (
    <Button variant="secondary" onClick={handleClick}>
      {optimisticSubscribed ? <EyeOffIcon /> : <EyeIcon />}
      {optimisticSubscribed ? "取消关注" : "关注"}
    </Button>
  );
};
