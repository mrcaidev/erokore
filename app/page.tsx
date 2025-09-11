import { PlusIcon, RssIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserMenu } from "@/components/user-menu";

const HomePage = () => {
  return (
    <main className="relative h-screen">
      <div className="fixed top-6 right-8">
        <UserMenu />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-32">
        <Button asChild>
          <Link href="/lists/new">
            <PlusIcon />
            创建清单
          </Link>
        </Button>
        <Button variant="secondary" asChild>
          <Link href="/lists/following">
            <RssIcon />
            我关注的
          </Link>
        </Button>
      </div>
    </main>
  );
};

export default HomePage;
