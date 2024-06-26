const {
  ApolloServerPluginDrainHttpServer,
} = require("@apollo/server/plugin/drainHttpServer");
const { WebSocketServer } = require("ws");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const { useServer } = require("graphql-ws/lib/use/ws");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const { authenticateJWT } = require("../auth/authenticateJWT");

const { resolvers } = require("./resolvers");
const { typeDefs } = require("./typeDefs");

function createApolloServer(server) {
  const wsServer = new WebSocketServer({
    server,
    path: "/graphql",
  });
  const schema = makeExecutableSchema({ typeDefs, resolvers });
  const serverCleanup = useServer(
    {
      schema,
    },
    wsServer
  );

  const apolloServer = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer: server }),

      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });
  return apolloServer;
}

async function startApolloServer(apolloServer, app, port) {
  try {
    await apolloServer.start();
    app.use(
      "/graphql",
      authenticateJWT,
      expressMiddleware(apolloServer, {
        context: async ({ req }) => ({ req }),
      })
    );
    console.log(`Apollo Server ready at http://localhost:${port}/graphql`);
  } catch (error) {
    console.error("Failed to start Apollo Server:", error);
  }
}

module.exports = {
  createApolloServer,
  startApolloServer,
};
