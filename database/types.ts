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
} from "./schema";

// ----------------------------------------------------------------------------

export type User = typeof usersTable.$inferSelect;

export type InsertUser = typeof usersTable.$inferInsert;

export type PrivateUser = Omit<User, "passwordSalt" | "passwordHash">;

export type PublicUser = Omit<
  PrivateUser,
  "createdAt" | "updatedAt" | "deletedAt"
>;

// ----------------------------------------------------------------------------

export type PermissionLevel = (typeof permissionLevelEnum.enumValues)[number];

export type DefaultablePermissionLevel =
  (typeof defaultablePermissionLevelEnum.enumValues)[number];

// ----------------------------------------------------------------------------

export type Collection = typeof collectionsTable.$inferSelect;

export type InsertCollection = typeof collectionsTable.$inferInsert;

export type FullCollection = Collection & {
  creator: PublicUser;
  updater: PublicUser;
  my: {
    permissionLevel: DefaultablePermissionLevel | null;
    subscribed: boolean;
  };
};

// ----------------------------------------------------------------------------

export type Collaboration = typeof collaborationsTable.$inferSelect;

export type InsertCollaboration = typeof collaborationsTable.$inferInsert;

export type FullCollaboration = Collaboration & {
  collaborator: PublicUser;
};

// ----------------------------------------------------------------------------

export type Subscription = typeof subscriptionsTable.$inferSelect;

export type InsertSubscription = typeof subscriptionsTable.$inferInsert;

// ----------------------------------------------------------------------------

export type Invitation = typeof invitationsTable.$inferSelect;

export type InsertInvitation = typeof invitationsTable.$inferInsert;

export type FullInvitation = Invitation & {
  inviter: PublicUser;
};

// ----------------------------------------------------------------------------

export type CollectionItem = typeof collectionItemsTable.$inferSelect;

export type InsertCollectionItem = typeof collectionItemsTable.$inferInsert;

export type FullCollectionItem = CollectionItem & {
  creator: PublicUser;
  updater: PublicUser;
  my: {
    attitude: Attitude | null;
    comment: string;
  };
};

// ----------------------------------------------------------------------------

export type Attitude = (typeof attitudeEnum.enumValues)[number];

// ----------------------------------------------------------------------------

export type Reaction = typeof reactionsTable.$inferSelect;

export type InsertReaction = typeof reactionsTable.$inferInsert;

export type FullReaction = Reaction & {
  reactor: PublicUser;
};
