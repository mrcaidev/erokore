import type { PropsWithChildren } from "react";
import { UserMenu } from "./user-menu";

const AppLayout = ({ children }: PropsWithChildren) => {
  return (
    <>
      {children}
      <div className="fixed top-6 right-8">
        <UserMenu />
      </div>
    </>
  );
};

export default AppLayout;
