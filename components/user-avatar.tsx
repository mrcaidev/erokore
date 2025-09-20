import type { AvatarProps } from "@radix-ui/react-avatar";
import type { PublicUser } from "@/database/types";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";

export type UserAvatarProps = AvatarProps & {
  user: PublicUser;
  hoverable?: boolean;
};

const UnhoverableUserAvatar = ({ user, ...props }: UserAvatarProps) => {
  return (
    <Avatar {...props}>
      <AvatarImage src={user.avatarUrl} alt={`${user.nickname}的头像`} />
      <AvatarFallback className="text-muted-foreground uppercase">
        {user.nickname[0]}
      </AvatarFallback>
    </Avatar>
  );
};

export const UserAvatar = ({
  user,
  hoverable = false,
  ...props
}: UserAvatarProps) => {
  if (!hoverable) {
    return <UnhoverableUserAvatar user={user} {...props} />;
  }

  return (
    <HoverCard openDelay={300}>
      <HoverCardTrigger>
        <UnhoverableUserAvatar user={user} {...props} />
      </HoverCardTrigger>
      <HoverCardContent>
        <div className="flex items-center gap-3">
          <UnhoverableUserAvatar user={user} className="size-12 text-lg" />
          <div className="space-y-0.5">
            <div className="font-medium">{user.nickname}</div>
            <div className="text-sm text-muted-foreground">{user.email}</div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
