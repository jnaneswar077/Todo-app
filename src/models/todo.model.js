import mongoose from "mongoose";

const todoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: 200,
      index: true
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1000
    },
    status: {
      type: String,
      enum: ["pending", "in_progress", "completed"],
      default: "pending",
      index: true
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
      index: true
    },
    dueDate: {
      type: Date,
      index: true
    },
    completedAt: {
      type: Date
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    tags: [{
      type: String,
      trim: true
    }]
  },
  { timestamps: true }
);

// Pre-save hook to set completedAt when status changes to completed
todoSchema.pre("save", function (next) {
  if (this.isModified("status") && this.status === "completed" && !this.completedAt) {
    this.completedAt = new Date();
  } else if (this.isModified("status") && this.status !== "completed") {
    this.completedAt = undefined;
  }
  next();
});

// Static method to get todos by user with pagination
todoSchema.statics.findByUser = function (userId, page = 1, limit = 10, filters = {}) {
  const skip = (page - 1) * limit;
  
  return this.find({ user: userId, ...filters })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("user", "username email");
};

// Instance method to mark as completed
todoSchema.methods.markAsCompleted = function () {
  this.status = "completed";
  this.completedAt = new Date();
  return this.save();
};

// Instance method to update status
todoSchema.methods.updateStatus = function (newStatus) {
  this.status = newStatus;
  if (newStatus === "completed") {
    this.completedAt = new Date();
  } else {
    this.completedAt = undefined;
  }
  return this.save();
};

export const Todo = mongoose.model("Todo", todoSchema);
