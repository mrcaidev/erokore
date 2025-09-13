import { forbidden, notFound } from "next/navigation";
import { findCollectionBySlug } from "@/server/collection";
import { findCurrentUser } from "@/server/user";
import { hasPermission } from "@/utils/permission";

export type CollectionPageProps = {
  params: Promise<{ slug: string }>;
};

const CollectionPage = async ({ params }: CollectionPageProps) => {
  const { slug } = await params;
  const [user, collection] = await Promise.all([
    findCurrentUser(),
    findCollectionBySlug(slug),
  ]);

  if (!collection) {
    return notFound();
  }

  if (!hasPermission({ collection, user, permissionLevel: "viewer" })) {
    return forbidden();
  }

  return <div>作品集 {collection.title}</div>;
};

export default CollectionPage;
