import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Todo } from "../models/todo.model.js";

const createTodo = asyncHandler(async (req, res) => {
  const { title, description, priority, dueDate, tags } = req.body;

  if (!title || title.trim() === "") {
    throw new ApiError(400, "Title is required");
  }

  const todo = await Todo.create({
    title: title.trim(),
    description: description?.trim(),
    priority,
    dueDate,
    tags: tags || [],
    user: req.user._id
  });

  const createdTodo = await Todo.findById(todo._id).populate("user", "username email");

  if (!createdTodo) {
    throw new ApiError(500, "Something went wrong while creating the todo");
  }

  return res.status(201).json(
    new ApiResponse(200, createdTodo, "Todo created successfully")
  );
});

const getUserTodos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status, priority, search } = req.query;
  
  const filters = {};
  if (status) filters.status = { $regex: `^${status}$`, $options: "i" };
  if (priority) filters.priority = { $regex: `^${priority}$`, $options: "i" };
  if (search) {
    filters.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } }
    ];
  }

  const todos = await Todo.findByUser(req.user._id, parseInt(page), parseInt(limit), filters);
  const totalTodos = await Todo.countDocuments({ user: req.user._id, ...filters });

  return res.status(200).json(
    new ApiResponse(200, {
      todos,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalTodos,
        pages: Math.ceil(totalTodos / limit)
      }
    }, "Todos fetched successfully")
  );
});

const getTodoById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const todo = await Todo.findOne({ _id: id, user: req.user._id }).populate("user", "username email");

  if (!todo) {
    throw new ApiError(404, "Todo not found");
  }

  return res.status(200).json(
    new ApiResponse(200, todo, "Todo fetched successfully")
  );
});

const updateTodo = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description, priority, dueDate, tags, status } = req.body;

  const todo = await Todo.findOne({ _id: id, user: req.user._id });

  if (!todo) {
    throw new ApiError(404, "Todo not found");
  }

  const updatedTodo = await Todo.findByIdAndUpdate(
    id,
    {
      $set: {
        title: title?.trim(),
        description: description?.trim(),
        priority,
        dueDate,
        tags,
        status
      }
    },
    { new: true }
  ).populate("user", "username email");

  return res.status(200).json(
    new ApiResponse(200, updatedTodo, "Todo updated successfully")
  );
});

const deleteTodo = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const todo = await Todo.findOne({ _id: id, user: req.user._id });

  if (!todo) {
    throw new ApiError(404, "Todo not found");
  }

  await Todo.findByIdAndDelete(id);

  return res.status(200).json(
    new ApiResponse(200, {}, "Todo deleted successfully")
  );
});

const updateTodoStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status || !["pending", "in_progress", "completed"].includes(status)) {
    throw new ApiError(400, "Valid status is required");
  }

  const todo = await Todo.findOne({ _id: id, user: req.user._id });

  if (!todo) {
    throw new ApiError(404, "Todo not found");
  }

  const updatedTodo = await todo.updateStatus(status);
  const populatedTodo = await Todo.findById(updatedTodo._id).populate("user", "username email");

  return res.status(200).json(
    new ApiResponse(200, populatedTodo, "Todo status updated successfully")
  );
});

const markTodoAsCompleted = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const todo = await Todo.findOne({ _id: id, user: req.user._id });

  if (!todo) {
    throw new ApiError(404, "Todo not found");
  }

  const updatedTodo = await todo.markAsCompleted();
  const populatedTodo = await Todo.findById(updatedTodo._id).populate("user", "username email");

  return res.status(200).json(
    new ApiResponse(200, populatedTodo, "Todo marked as completed successfully")
  );
});

export {
  createTodo,
  getUserTodos,
  getTodoById,
  updateTodo,
  deleteTodo,
  updateTodoStatus,
  markTodoAsCompleted
};
