import { FolderPlusIcon, ListIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const HomePage = () => {
  return (
    <main className="grid place-items-center h-screen">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <Button variant="secondary" asChild>
          <Link href="/subscriptions">
            <ListIcon />
            我关注的
          </Link>
        </Button>
        <Button asChild>
          <Link href="/collections/create">
            <FolderPlusIcon />
            创建作品集
          </Link>
        </Button>
      </div>
    </main>
  );
};

export default HomePage;
