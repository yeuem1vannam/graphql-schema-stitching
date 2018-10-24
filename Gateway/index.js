import {
  makeRemoteExecutableSchema,
  introspectSchema,
  mergeSchemas
} from 'graphql-tools'
import { HttpLink } from 'apollo-link-http'
import fetch from 'node-fetch'
import { ApolloServer } from 'apollo-server'

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
`

const createNewSchema = async () => {
  const userUri = 'https://us1.prisma.sh/playground/User/dev'
  const termUri = 'https://eu1.prisma.sh/playground/Term/dev'
  const phraseUri = 'https://us1.prisma.sh/playground/Phrase/dev'
  const userSchema = await createRemoteExecutableSchema(userUri)
  const termSchema = await createRemoteExecutableSchema(termUri)
  const phraseSchema = await createRemoteExecutableSchema(phraseUri)
  return mergeSchemas({
    schemas: [
      userSchema,
      termSchema,
      phraseSchema,
      linkTypeDefs
    ],
    resolvers: {
      Term: {
        user: {
          fragment: `... on Term { userId }`,
          resolve(term, args, context, info) {
            console.log(term.userId)
            return info.mergeInfo.delegateToSchema({
              schema: termSchema,
              operation: 'query',
              fieldName: 'user',
              args: {
                where: {
                  id: term.userId
                }
              },
              context,
              info
            })
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
