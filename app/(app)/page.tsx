import { PlusIcon, RssIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RecentCollectionList } from "./recent-collection-list";

const HomePage = () => {
  return (
    <main className="fixed left-0 right-0 top-2/5">
      <div className="space-y-4 w-fit mx-auto">
        <div className="grid grid-cols-2 gap-2">
          <Button asChild>
            <Link href="/collections/create">
              <PlusIcon />
              创建作品集
            </Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link href="/collections/subscribed">
              <RssIcon />
              我关注的
            </Link>
          </Button>
        </div>
        <RecentCollectionList />
      </div>
    </main>
  );
};

export default HomePage;
