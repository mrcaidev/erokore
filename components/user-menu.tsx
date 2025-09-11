import { LogInIcon, LogOutIcon, UserRoundPlusIcon } from "lucide-react";
import Link from "next/link";
import { getCurrentUser, signOut } from "@/server/auth";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export const UserMenu = async () => {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="outline" asChild>
          <Link href="/sign-up">
            <UserRoundPlusIcon />
            注册
          </Link>
        </Button>
        <Button asChild>
          <Link href="/sign-in">
            <LogInIcon />
            登录
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className="size-10">
          <AvatarImage src={undefined} alt="你的头像" />
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
