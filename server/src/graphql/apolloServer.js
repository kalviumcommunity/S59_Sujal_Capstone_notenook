const { ApolloServer } = require("@apollo/server");
const { typeDefs, resolvers } = require("./schema");

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
});

module.exports = apolloServer;
