import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/user-avatar";
import { listEnrichedCollaborations } from "@/server/collaboration";
import type { PersonalizedCollection } from "@/utils/types";

export type CollaboratorListProps = {
  collection: PersonalizedCollection;
  limit?: number;
};

export const CollaboratorList = async ({
  collection,
  limit = 5,
}: CollaboratorListProps) => {
  const collaborations = await listEnrichedCollaborations(collection.id);

  return (
    <div className="flex justify-between items-center">
      <ul className="flex items-center gap-1">
        {collaborations.slice(0, limit).map((collaboration) => (
          <li key={collaboration.id}>
            <UserAvatar
              user={collaboration.collaborator}
              hoverable
              className="size-10"
            />
          </li>
        ))}
        {collaborations.length > limit && (
          <li>
            <Avatar className="size-10">
              <AvatarFallback className="text-muted-foreground">
                +{collaborations.length - limit}
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
        <Link href={`/collections/${collection.slug}/collaborators`}>更多</Link>
      </Button>
    </div>
  );
};
