export const typeDefs = /* GraphQL */ `type AggregatePhrase {
  count: Int!
}

type BatchPayload {
  count: Long!
}

scalar Long

type Mutation {
  createPhrase(data: PhraseCreateInput!): Phrase!
  updatePhrase(data: PhraseUpdateInput!, where: PhraseWhereUniqueInput!): Phrase
  updateManyPhrases(data: PhraseUpdateInput!, where: PhraseWhereInput): BatchPayload!
  upsertPhrase(where: PhraseWhereUniqueInput!, create: PhraseCreateInput!, update: PhraseUpdateInput!): Phrase!
  deletePhrase(where: PhraseWhereUniqueInput!): Phrase
  deleteManyPhrases(where: PhraseWhereInput): BatchPayload!
}

enum MutationType {
  CREATED
  UPDATED
  DELETED
}

interface Node {
  id: ID!
}

type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String
  endCursor: String
}

type Phrase {
  id: ID!
  phrase: String!
  userId: ID!
}

type PhraseConnection {
  pageInfo: PageInfo!
  edges: [PhraseEdge]!
  aggregate: AggregatePhrase!
}

input PhraseCreateInput {
  phrase: String!
  userId: ID!
}

type PhraseEdge {
  node: Phrase!
  cursor: String!
}

enum PhraseOrderByInput {
  id_ASC
  id_DESC
  phrase_ASC
  phrase_DESC
  userId_ASC
  userId_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
}

type PhrasePreviousValues {
  id: ID!
  phrase: String!
  userId: ID!
}

type PhraseSubscriptionPayload {
  mutation: MutationType!
  node: Phrase
  updatedFields: [String!]
  previousValues: PhrasePreviousValues
}

input PhraseSubscriptionWhereInput {
  mutation_in: [MutationType!]
  updatedFields_contains: String
  updatedFields_contains_every: [String!]
  updatedFields_contains_some: [String!]
  node: PhraseWhereInput
  AND: [PhraseSubscriptionWhereInput!]
  OR: [PhraseSubscriptionWhereInput!]
  NOT: [PhraseSubscriptionWhereInput!]
}

input PhraseUpdateInput {
  phrase: String
  userId: ID
}

input PhraseWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  phrase: String
  phrase_not: String
  phrase_in: [String!]
  phrase_not_in: [String!]
  phrase_lt: String
  phrase_lte: String
  phrase_gt: String
  phrase_gte: String
  phrase_contains: String
  phrase_not_contains: String
  phrase_starts_with: String
  phrase_not_starts_with: String
  phrase_ends_with: String
  phrase_not_ends_with: String
  userId: ID
  userId_not: ID
  userId_in: [ID!]
  userId_not_in: [ID!]
  userId_lt: ID
  userId_lte: ID
  userId_gt: ID
  userId_gte: ID
  userId_contains: ID
  userId_not_contains: ID
  userId_starts_with: ID
  userId_not_starts_with: ID
  userId_ends_with: ID
  userId_not_ends_with: ID
  AND: [PhraseWhereInput!]
  OR: [PhraseWhereInput!]
  NOT: [PhraseWhereInput!]
}

input PhraseWhereUniqueInput {
  id: ID
}

type Query {
  phrase(where: PhraseWhereUniqueInput!): Phrase
  phrases(where: PhraseWhereInput, orderBy: PhraseOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Phrase]!
  phrasesConnection(where: PhraseWhereInput, orderBy: PhraseOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): PhraseConnection!
  node(id: ID!): Node
}

type Subscription {
  phrase(where: PhraseSubscriptionWhereInput): PhraseSubscriptionPayload
}
`