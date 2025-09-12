import { notFound } from "next/navigation";
import { findOneCollectionById } from "@/database/collection";

export type CollectionPageParams = {
  id: string;
};

export type CollectionPageProps = {
  params: Promise<CollectionPageParams>;
};

const CollectionPage = async ({ params }: CollectionPageProps) => {
  const { id } = await params;
  const collection = await findOneCollectionById(id);

  if (!collection) {
    return notFound();
  }

  return <div>作品集 {collection.title}</div>;
};

export default CollectionPage;
