const mongoose = require("mongoose")

const CommentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, "Please add a comment"],
      maxlength: [500, "Comment cannot be more than 500 characters"],
    },
    blog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

// Virtual for comment's replies
CommentSchema.virtual("replies", {
  ref: "Comment",
  localField: "_id",
  foreignField: "parent",
  justOne: false,
})

module.exports = mongoose.model("Comment", CommentSchema)
