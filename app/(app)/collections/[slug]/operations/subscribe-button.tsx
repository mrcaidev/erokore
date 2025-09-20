"use client";

import { EyeIcon, EyeOffIcon } from "lucide-react";
import { startTransition, useOptimistic } from "react";
import {
  subscribeToCollection,
  unsubscribeFromCollection,
} from "@/actions/subscription";
import { Button } from "@/components/ui/button";
import type { FullCollection } from "@/database/types";

export type SubscribeButtonProps = {
  collection: FullCollection;
};

export const SubscribeButton = ({ collection }: SubscribeButtonProps) => {
  const subscribed = collection.my.subscribed;

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
    await action(collection.id);
  };

  return (
    <Button variant="secondary" onClick={handleClick}>
      {optimisticSubscribed ? <EyeOffIcon /> : <EyeIcon />}
      {optimisticSubscribed ? "取消关注" : "关注"}
    </Button>
  );
};
