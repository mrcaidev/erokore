import Link from "next/link";
import { redirect } from "next/navigation";
import { Paginator } from "@/components/paginator";
import {
  countSubscriptionsBySubscriberId,
  selectManyCollectionEnrichedSubscriptionsBySubscriberId,
} from "@/database/subscription";
import { getSession } from "@/utils/session";
import { buildAuthUrl, normalizePage } from "@/utils/url";

const fetchPageData = async (page: number) => {
  const session = await getSession();

  if (!session) {
    return redirect(buildAuthUrl("/sign-in", "/subscriptions"));
  }

  const [subscriptionsTotal, subscriptions] = await Promise.all([
    countSubscriptionsBySubscriberId(session.id),
    selectManyCollectionEnrichedSubscriptionsBySubscriberId(session.id, {
      limit: 10,
      offset: (page - 1) * 10,
    }),
  ]);
  return { subscriptionsTotal, subscriptions };
};

export type SubscriptionPageProps = {
  searchParams: Promise<{ page?: string }>;
};

const SubscriptionsPage = async ({ searchParams }: SubscriptionPageProps) => {
  const { page } = await searchParams;
  const { subscriptionsTotal, subscriptions } = await fetchPageData(
    normalizePage(page),
  );

  return (
    <main className="max-w-7xl px-8 py-24 mx-auto">
      <div className="space-y-4 mb-4">
        <h1 className="mb-4 text-3xl font-bold">我关注的</h1>
        <div className="space-y-3 order-2 md:order-1">
          <ul className="divide-y py-4">
            {subscriptions.map((subscription) => (
              <li key={subscription.id}>
                <div className="space-y-1 relative px-4 py-3 hover:bg-accent transition-colors">
                  <div className="font-medium text-lg">
                    {subscription.collection.title}
                  </div>
                  <div className="text-muted-foreground text-sm">
                    {subscription.collection.description || "暂无描述"}
                  </div>
                  <Link
                    href={`/collections/${subscription.collection.slug}`}
                    className="absolute inset-0"
                  />
                </div>
              </li>
            ))}
          </ul>
          <Paginator
            total={subscriptionsTotal}
            page={normalizePage(page)}
            pageSize={10}
          />
        </div>
      </div>
    </main>
  );
};

export default SubscriptionsPage;
