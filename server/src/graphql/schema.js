const { NoteModel } = require("../models/NoteModel");
const { CommentModel } = require("../models/CommentModel");
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
  type Query {
    getCommentsByNoteId(noteId: ID!): [Comment]
  }
`;

const resolvers = {
  Query: {
    getCommentsByNoteId: async (_, { noteId }) => {
      try {
        const note = await NoteModel.findById(noteId).populate({
          path: "comments",
          populate: {
            path: "postedBy",
            select: "_id username",
          },
        });

        if (!note) {
          throw new Error("Note not found");
        }

        return note.comments;
      } catch (error) {
        console.error("Error fetching comments:", error);
        throw new Error("Failed to fetch comments");
      }
    },
  },
};

module.exports = { typeDefs, resolvers };
