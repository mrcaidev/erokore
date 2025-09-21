import Link from "next/link";
import type { PropsWithChildren } from "react";
import { UserMenu } from "./user-menu";

const AppLayout = ({ children }: PropsWithChildren) => {
  return (
    <>
      {children}
      <header className="fixed inset-x-0 top-0 bg-background/70 backdrop-blur-lg z-50">
        <div className="flex justify-between items-center max-w-7xl px-8 py-5 mx-auto">
          <Link href="/" className="font-medium text-lg">
            Erokore
          </Link>
          <UserMenu />
        </div>
      </header>
    </>
  );
};

export default AppLayout;
