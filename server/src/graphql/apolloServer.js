const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const { authenticateJWT } = require("../auth/authenticateJWT");

const { resolvers } = require("./resolvers");
const { typeDefs } = require("./typeDefs");

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
});

const startApolloServer = async (app, port) => {
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
};

module.exports = {
  startApolloServer,
};
