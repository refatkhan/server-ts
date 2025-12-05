import express from 'express';
import { todoControllers } from './todo.controller';
import { userRoute } from '../user/user.route';

const route = express.Router();
route.post("/", todoControllers.createTodo)
route.get("/", todoControllers.getTodo);
route.get("/:id", todoControllers.getSingleTodo);
route.put("/:id", todoControllers.updateTodo);
route.delete("/:id", todoControllers.deleteTodo)

export const todoRouter = route;