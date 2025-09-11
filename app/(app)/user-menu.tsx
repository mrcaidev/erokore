import { LogInIcon, LogOutIcon } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getCurrentUser, signOut } from "@/server/user";

export const UserMenu = async () => {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <Button variant="ghost" size="icon" asChild>
        <Link href="/sign-in" aria-label="登录">
          <LogInIcon />
        </Link>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="cursor-pointer">
        <Avatar className="size-10">
          <AvatarImage src={user.avatarUrl} alt="你的头像" />
          <AvatarFallback className="text-muted-foreground uppercase">
            {user.nickname[0]}
          </AvatarFallback>
        </Avatar>
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
