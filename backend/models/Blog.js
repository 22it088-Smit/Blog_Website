const mongoose = require("mongoose")

const BlogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add a title"],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    content: {
      type: String,
      required: [true, "Please add content"],
    },
    coverImage: {
      type: String,
      default: "default-blog.jpg",
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tags: [String],
    category: {
      type: String,
      required: [true, "Please add a category"],
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    dislikes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "published",
    },
    viewCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

// Create index for search
BlogSchema.index({ title: "text", content: "text", tags: "text" })

// Virtual for blog's comments
BlogSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "blog",
  justOne: false,
})

// Get like count
BlogSchema.virtual("likeCount").get(function () {
  return this.likes.length
})

// Get dislike count
BlogSchema.virtual("dislikeCount").get(function () {
  return this.dislikes.length
})

module.exports = mongoose.model("Blog", BlogSchema)
