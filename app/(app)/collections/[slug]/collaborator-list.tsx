import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/user-avatar";
import type { CollaboratorEnrichedCollaboration } from "@/utils/types";

export type CollaboratorListProps = {
  collectionSlug: string;
  collaborations: CollaboratorEnrichedCollaboration[];
  total: number;
};

export const CollaboratorList = async ({
  collectionSlug,
  collaborations,
  total,
}: CollaboratorListProps) => {
  return (
    <div className="flex justify-between items-center">
      <ul className="flex items-center gap-1">
        {collaborations.map((collaboration) => (
          <li key={collaboration.id}>
            <UserAvatar
              user={collaboration.collaborator}
              hoverable
              className="size-10"
            />
          </li>
        ))}
        {collaborations.length < total && (
          <li>
            <Avatar className="size-10">
              <AvatarFallback className="text-muted-foreground">
                +{total - collaborations.length}
              </AvatarFallback>
            </Avatar>
          </li>
        )}
      </ul>
      <Button
        variant="link"
        className="px-1 text-muted-foreground hover:text-foreground"
        asChild
      >
        <Link href={`/collections/${collectionSlug}/collaborators`}>更多</Link>
      </Button>
    </div>
  );
};
