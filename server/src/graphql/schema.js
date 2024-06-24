const { NoteModel } = require("../models/NoteModel");
const { CommentModel } = require("../models/CommentModel");
const { AuthenticationError } = require("apollo-server-express");

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

  Mutation: {
    postComment: async (_, { noteId, comment }, { req }) => {
      const user = req.user;
      console.log(user);
      if (!user)
        throw new AuthenticationError(
          "You must be logged in to post a comment."
        );

      try {
        const newComment = new CommentModel({
          postedBy: user._id,
          comment,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        const savedComment = await newComment.save();

        await NoteModel.findByIdAndUpdate(noteId, {
          $push: { comments: savedComment._id },
        });
        const populatedComment = await CommentModel.findById(savedComment._id)
          .populate("postedBy", "_id username")
          .exec();

        return populatedComment;
      } catch (error) {
        console.error("Error posting comment:", error);
        throw new Error("Failed to post comment");
      }
    },
    
    deleteComment: async (_, { commentId }, { req }) => {
      const user = req.user;
      if (!user) {
        throw new AuthenticationError(
          "You must be logged in to delete a comment."
        );
      }

      try {
        const comment = await CommentModel.findById(commentId);

        if (!comment) {
          console.log("No comment");
          throw new Error("Comment not found");
        }

        if (comment.postedBy.toString() !== user._id.toString()) {
          throw new AuthenticationError(
            "You are not authorized to delete this comment."
          );
        }

        await CommentModel.findByIdAndDelete(commentId);

        return { success: true, message: "Comment deleted successfully" };
      } catch (error) {
        console.error("Error deleting comment:", error);
      }
    },
  },
};

module.exports = { typeDefs, resolvers };
