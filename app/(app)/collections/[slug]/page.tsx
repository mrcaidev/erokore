import { forbidden, notFound } from "next/navigation";
import { cache } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { UserAvatar } from "@/components/user-avatar";
import { selectManyEnrichedCollaborationsByCollectionId } from "@/repository/collaboration";
import { selectOnePersonalizedCollectionBySlug } from "@/repository/collection";
import { selectManyPersonalizedCollectionItemsByCollectionId } from "@/repository/collection-item";
import { evaluatePermissionLevel, hasPermission } from "@/utils/permission";
import { getSession } from "@/utils/session";
import { CollaboratorList } from "./collaborator-list";
import { CollectionItemList } from "./collection-item-list";
import { Operations } from "./operations";

const fetchPageData = cache(async (slug: string) => {
  const session = await getSession();

  const collection = await selectOnePersonalizedCollectionBySlug(
    slug,
    session?.id,
  );

  if (!collection) {
    return notFound();
  }

  if (!hasPermission(collection, "viewer")) {
    return forbidden();
  }

  const collectionItems =
    await selectManyPersonalizedCollectionItemsByCollectionId(
      collection.id,
      session?.id,
    );

  const collaborations = await selectManyEnrichedCollaborationsByCollectionId(
    collection.id,
  );

  return { collection, collectionItems, collaborations };
});

export type CollectionPageProps = {
  params: Promise<{ slug: string }>;
};

const CollectionPage = async ({ params }: CollectionPageProps) => {
  const { slug } = await params;
  const { collection, collectionItems, collaborations } =
    await fetchPageData(slug);

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
      <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] lg:grid-cols-[1fr_360px] gap-x-8">
        <div className="order-2 md:order-1">
          <CollectionItemList
            collectionItems={collectionItems}
            permissionLevel={evaluatePermissionLevel(collection)}
          />
        </div>
        <Accordion
          type="multiple"
          defaultValue={["description"]}
          className="order-1 md:order-2"
        >
          <AccordionItem value="description">
            <AccordionTrigger>描述</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              {collection.description || "暂无描述"}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="collaborator">
            <AccordionTrigger>协作者</AccordionTrigger>
            <AccordionContent>
              <CollaboratorList
                collectionSlug={collection.slug}
                collaborations={collaborations}
              />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="activity">
            <AccordionTrigger>活动记录</AccordionTrigger>
            <AccordionContent className="space-y-3">
              <div className="flex items-center gap-2">
                <UserAvatar user={collection.updater} hoverable />
                <div className="text-muted-foreground">
                  最后更新于 {collection.updatedAt.toLocaleString("zh")}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <UserAvatar user={collection.creator} hoverable />
                <div className="text-muted-foreground">
                  创建于 {collection.createdAt.toLocaleString("zh")}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </main>
  );
};

export default CollectionPage;
