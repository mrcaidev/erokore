import { PlusIcon, RssIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RecentFolderList } from "./recent-folder-list";

const HomePage = () => {
  return (
    <main className="fixed left-0 right-0 top-2/5">
      <div className="space-y-4 w-fit mx-auto">
        <div className="grid grid-cols-2 gap-2">
          <Button asChild>
            <Link href="/folders/new">
              <PlusIcon />
              创建清单
            </Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link href="/folders/following">
              <RssIcon />
              我关注的
            </Link>
          </Button>
        </div>
        <RecentFolderList />
      </div>
    </main>
  );
};

export default HomePage;
