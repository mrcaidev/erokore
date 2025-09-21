import Link from "next/link";
import type { PropsWithChildren } from "react";
import { UserMenu } from "./user-menu";

const AppLayout = ({ children }: PropsWithChildren) => {
  return (
    <>
      {children}
      <header className="flex justify-between items-center fixed inset-x-0 top-0 px-8 py-5 bg-background/70 backdrop-blur-lg">
        <Link href="/" className="font-medium text-lg">
          Erokore
        </Link>
        <UserMenu />
      </header>
    </>
  );
};

export default AppLayout;
