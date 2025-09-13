import { forbidden, notFound } from "next/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { UserAvatar } from "@/components/user-avatar";
import { findCollection } from "@/server/collection";
import { hasPermission } from "@/utils/permission";
import { CollaboratorList } from "./collaborator-list";
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
      <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-8">
        <p className="order-2 md:order-1">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio repellat
          dignissimos quaerat explicabo corporis eveniet tempora quibusdam autem
          aperiam, sunt doloribus quo labore asperiores minus ipsam praesentium
          vero consequuntur. Distinctio.
        </p>
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
              <CollaboratorList collection={collection} />
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
