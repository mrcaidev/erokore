import type { PropsWithChildren } from "react";
import { UserMenu } from "@/components/user-menu";

const HasUserMenuLayout = ({ children }: PropsWithChildren) => {
  return (
    <>
      {children}
      <div className="fixed top-6 right-8">
        <UserMenu />
      </div>
    </>
  );
};

export default HasUserMenuLayout;
