const { ApolloServer } = require("@apollo/server");
const { resolvers } = require("./resolvers");
const { typeDefs } = require("./typeDefs");

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
});

module.exports = apolloServer;
