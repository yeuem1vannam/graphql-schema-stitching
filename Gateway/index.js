import {
  makeRemoteExecutableSchema,
  introspectSchema,
  mergeSchemas
} from 'graphql-tools'
import { HttpLink } from 'apollo-link-http'
import fetch from 'node-fetch'
import { ApolloServer } from 'apollo-server'

const graphqlApis = [{
  uri: 'https://us1.prisma.sh/playground/User/dev'
}, {
  uri: 'https://us1.prisma.sh/playground/Phrase/dev'
}, {
  uri: 'https://eu1.prisma.sh/playground/Term/dev'
}]

const createRemoteExecutableSchemas = async () => {
  let schemas = []
  // iterate over all the the GraphQL APIs
  for (let i = 0; i < graphqlApis.length; i++) {
    // Create Apollo link with URI and headers of the GraphQL API
    const link = new HttpLink({
      uri: graphqlApis[i].uri,
      fetch
    })
    // Introspect schema
    const remoteSchema = await introspectSchema(link)
    // Make remote executable schema
    const remoteExecutableSchema = makeRemoteExecutableSchema({
      schema: remoteSchema,
      link
    })
    schemas.push(remoteExecutableSchema)
  }
  return schemas
}

const createNewSchema = async () => {
  const schemas = await createRemoteExecutableSchemas()
  return mergeSchemas({
    schemas
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
