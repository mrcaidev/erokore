import { forbidden, notFound } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { findCollection } from "@/server/collection";
import { hasPermission } from "@/utils/permission";
import { Operations } from "./operations";

export type CollectionPageProps = {
  params: Promise<{ slug: string }>;
};

const CollectionPage = async ({ params }: CollectionPageProps) => {
  const { slug } = await params;
  const collection = await findCollection(slug);

  if (!collection) {
    return notFound();
  }

  if (!hasPermission(collection, "viewer")) {
    return forbidden();
  }

  return (
    <main className="max-w-7xl px-8 py-24 mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <h1 className="text-3xl font-bold">{collection.title}</h1>
        <Operations collection={collection} />
      </div>
      <div className="flex items-center gap-2 text-sm">
        <Avatar className="size-8">
          <AvatarImage
            src={collection.updater.avatarUrl}
            alt={`${collection.updater.nickname}的头像`}
          />
          <AvatarFallback className="text-muted-foreground uppercase">
            {collection.updater.nickname[0]}
          </AvatarFallback>
        </Avatar>
        <div className="text-muted-foreground">
          最后更新于 {collection.updatedAt.toLocaleString("zh")}
        </div>
      </div>
    </main>
  );
};

export default CollectionPage;
