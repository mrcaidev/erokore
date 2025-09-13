import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { listCollaborators } from "@/database/collaboration";
import type { PersonalizedCollection } from "@/utils/types";

export type CollaboratorListProps = {
  collection: PersonalizedCollection;
  limit?: number;
};

export const CollaboratorList = async ({
  collection,
  limit = 5,
}: CollaboratorListProps) => {
  const collaborators = await listCollaborators(collection.id);

  return (
    <div className="flex justify-between items-center">
      <ul className="flex items-center gap-1">
        {collaborators.slice(0, limit).map((collaborator) => (
          <li key={collaborator.id}>
            <Avatar className="size-10">
              <AvatarImage
                src={collaborator.user.avatarUrl}
                alt={`${collaborator.user.nickname}的头像`}
              />
              <AvatarFallback className="text-muted-foreground uppercase">
                {collaborator.user.nickname[0]}
              </AvatarFallback>
            </Avatar>
          </li>
        ))}
        {collaborators.length > limit && (
          <li>
            <Avatar className="size-10">
              <AvatarFallback className="text-muted-foreground uppercase">
                +{collaborators.length - limit}
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
