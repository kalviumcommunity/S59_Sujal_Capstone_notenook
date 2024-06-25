const typeDefs = `#graphql
  type User {
    _id: ID!
    username: String!
  }

  type Comment {
    _id: ID!
    postedBy: User!
    comment: String!
    createdAt: String!
    updatedAt: String!
  }

  type DeleteCommentResponse {
    success: Boolean!
    message: String
  }

  type Query {
    getCommentsByNoteId(noteId: ID!): [Comment]
  }

  type Mutation {
    postComment(noteId: ID!, comment: String!): Comment
    deleteComment(commentId: ID!): DeleteCommentResponse
  }
`;

module.exports = { typeDefs };
