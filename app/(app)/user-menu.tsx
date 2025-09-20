import { LogInIcon, LogOutIcon } from "lucide-react";
import Link from "next/link";
import { cache } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserAvatar } from "@/components/user-avatar";
import { selectOnePrivateUserById } from "@/repository/user";
import { signOut } from "@/server/auth";
import { getSession } from "@/utils/session";

const fetchCurrentUser = cache(async () => {
  const session = await getSession();

  if (!session) {
    return undefined;
  }

  const user = await selectOnePrivateUserById(session.id);
  return user;
});

export const UserMenu = async () => {
  const user = await fetchCurrentUser();

  if (!user) {
    return (
      <Button variant="ghost" asChild>
        <Link href="/sign-in">
          <LogInIcon />
          登录
        </Link>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="cursor-pointer">
        <UserAvatar user={user} className="size-10" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-48">
        <DropdownMenuLabel className="space-y-1">
          <div>{user.nickname}</div>
          <div className="font-normal text-xs text-muted-foreground">
            {user.email}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuItem onClick={signOut}>
          <LogOutIcon />
          登出
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
