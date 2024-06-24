const { ApolloServer } = require("@apollo/server");
const { typeDefs, resolvers } = require("./schema");

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: (err) => {
    console.error(err);
    return new Error("Internal server error");
  },
});

module.exports = apolloServer;
