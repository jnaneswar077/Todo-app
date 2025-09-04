import { Router } from "express";
import { 
  createTodo,
  getUserTodos,
  getTodoById,
  updateTodo,
  deleteTodo,
  updateTodoStatus,
  markTodoAsCompleted
} from "../controllers/todo.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// All todo routes are protected
router.use(verifyJWT);

// CRUD operations
router.route("/")
  .post(createTodo)
  .get(getUserTodos);

router.route("/:id")
  .get(getTodoById)
  .put(updateTodo)
  .delete(deleteTodo);

// Status management
router.route("/:id/status")
  .patch(updateTodoStatus);

router.route("/:id/complete")
  .patch(markTodoAsCompleted);

export default router;
