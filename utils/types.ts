import type {
  attitudeEnum,
  collaborationsTable,
  collectionItemsTable,
  collectionsTable,
  defaultablePermissionLevelEnum,
  invitationsTable,
  permissionLevelEnum,
  reactionsTable,
  subscriptionsTable,
  usersTable,
} from "@/database/schema";

export type User = typeof usersTable.$inferSelect;
export type InsertUser = typeof usersTable.$inferInsert;
export type UpdateUser = Partial<InsertUser>;
export type PrivateUser = Omit<User, "passwordSalt" | "passwordHash">;
export type PublicUser = Omit<
  PrivateUser,
  "createdAt" | "updatedAt" | "deletedAt"
>;

export type PermissionLevel = (typeof permissionLevelEnum.enumValues)[number];
export type DefaultablePermissionLevel =
  (typeof defaultablePermissionLevelEnum.enumValues)[number];

export type Collection = typeof collectionsTable.$inferSelect;
export type InsertCollection = typeof collectionsTable.$inferInsert;
export type UpdateCollection = Partial<InsertCollection>;
export type PersonalizedCollection = Collection & {
  creator: PublicUser;
  updater: PublicUser;
  myPermissionLevel: DefaultablePermissionLevel | null;
  mySubscribed: boolean;
};

export type Collaboration = typeof collaborationsTable.$inferSelect;
export type InsertCollaboration = typeof collaborationsTable.$inferInsert;
export type UpdateCollaboration = Partial<InsertCollaboration>;
export type CollaboratorEnrichedCollaboration = Collaboration & {
  collaborator: PublicUser;
};
export type CollectionEnrichedCollaboration = Collaboration & {
  collection: Collection;
};

export type Subscription = typeof subscriptionsTable.$inferSelect;
export type InsertSubscription = typeof subscriptionsTable.$inferInsert;
export type UpdateSubscription = Partial<InsertSubscription>;
export type SubscriberEnrichedSubscription = Subscription & {
  subscriber: PublicUser;
};
export type CollectionEnrichedSubscription = Subscription & {
  collection: Collection;
};

export type Invitation = typeof invitationsTable.$inferSelect;
export type InsertInvitation = typeof invitationsTable.$inferInsert;
export type UpdateInvitation = Partial<InsertInvitation>;
export type InviterEnrichedInvitation = Invitation & {
  inviter: PublicUser;
};
export type CollectionEnrichedInvitation = Invitation & {
  collection: Collection;
};

export type CollectionItem = typeof collectionItemsTable.$inferSelect;
export type InsertCollectionItem = typeof collectionItemsTable.$inferInsert;
export type UpdateCollectionItem = Partial<InsertCollectionItem>;
export type PersonalizedCollectionItem = CollectionItem & {
  creator: PublicUser;
  updater: PublicUser;
  myAttitude: Attitude | null;
  myComment: string;
};

export type Attitude = (typeof attitudeEnum.enumValues)[number];

export type Reaction = typeof reactionsTable.$inferSelect;
export type InsertReaction = typeof reactionsTable.$inferInsert;
export type UpdateReaction = Partial<InsertReaction>;
export type ReactorEnrichedReaction = Reaction & {
  reactor: PublicUser;
};
export type CollectionItemEnrichedReaction = Reaction & {
  collectionItem: CollectionItem;
};

export type SourceConfig<T = unknown> = {
  source: string;
  name?: string;
  rules?: {
    match: (input: string) => T | undefined;
    priority?: number;
  }[];
  scrape?: (
    id: T,
  ) => Promise<
    Pick<CollectionItem, "title" | "description" | "url" | "coverUrl">
  >;
  badge?: {
    icon?: "image" | "video";
    className?: string;
  };
};
