import {
  makeRemoteExecutableSchema,
  introspectSchema,
  mergeSchemas
} from 'graphql-tools'
import { HttpLink } from 'apollo-link-http'
import fetch from 'node-fetch'
import { ApolloServer } from 'apollo-server'
import { Binding } from 'graphql-binding'

const createRemoteExecutableSchema = async (uri) => {
  const link = new HttpLink({
    uri: uri,
    fetch
  })
  // Introspect schema
  const remoteSchema = await introspectSchema(link)
  // Make remote executable schema
  const remoteExecutableSchema = makeRemoteExecutableSchema({
    schema: remoteSchema,
    link
  })
  return remoteExecutableSchema
}

const linkTypeDefs = `
  extend type Term {
    user: User
  }
  extend type Phrase {
    user: User
  }
  extend type User {
    terms: [Term]
    phrases: [Phrase]
  }
`

class ResourceBinding extends Binding {
  constructor (schema) {
    super({ schema })
  }
}

const createNewSchema = async () => {
  const userUri       = 'https://us1.prisma.sh/playground/User/dev'
  const termUri       = 'https://eu1.prisma.sh/playground/Term/dev'
  const phraseUri     = 'https://us1.prisma.sh/playground/Phrase/dev'
  const userSchema    = await createRemoteExecutableSchema(userUri)
  const termSchema    = await createRemoteExecutableSchema(termUri)
  const phraseSchema  = await createRemoteExecutableSchema(phraseUri)
  const userBinding   = new ResourceBinding(userSchema)
  const termBinding   = new ResourceBinding(termSchema)
  const phraseBinding = new ResourceBinding(phraseSchema)

  return mergeSchemas({
    schemas: [
      userSchema,
      termSchema,
      phraseSchema,
      linkTypeDefs
    ],
    resolvers: {
      User: {
        terms: {
          fragment: `... on User { id }`,
          resolve: async (user, args, context, info) => {
            let terms = await termBinding.query.terms(
              {where: { userId: user.id }},
              info
            )
            return terms
          }
        },
        phrases: {
          fragment: `... on User { id }`,
          resolve: async (user, args, context, info) => {
            let phrases = await phraseBinding.query.phrases(
              {where: { userId: user.id }},
              info
            )
            return phrases
          }
        }
      },
      Term: {
        user: {
          fragment: `... on Term { userId }`,
          resolve: async (term, args, context, info) => {
            let user = await userBinding.query.user(
              {where: {id: term.userId}},
              info
            )
            return user
          }
        }
      },
      Phrase: {
        user: {
          fragment: `... on Phrase { userId }`,
          resolve: async (phrase, args, context, info) => {
            let user = await userBinding.query.user(
              {where: {id: phrase.userId}},
              info
            )
            return user
          }
        }
      }
    }
  })
}

const runServer = async () => {
  // Get newly merged schema
  const schema = await createNewSchema()
  // start server with the new schema
  const server = new ApolloServer({ schema })
  server.listen().then(({url}) => {
    console.log(`Running at ${url}`)
  });
}

try {
  runServer()
} catch (err) {
  console.error(err)
}
