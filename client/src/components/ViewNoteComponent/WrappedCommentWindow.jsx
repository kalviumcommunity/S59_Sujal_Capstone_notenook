import React from "react";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import CommentsWindow from "./CommentsWindow";

const client = new ApolloClient({
  uri: "http://localhost:8080/graphql",
  cache: new InMemoryCache(),
});

function WrappedCommentsWindow() {
  return (
    <ApolloProvider client={client}>
      <CommentsWindow />
    </ApolloProvider>
  );
}

export default WrappedCommentsWindow;
