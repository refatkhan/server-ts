import { Request, Response } from "express";
import { todoServices } from "./todo.service";

const createTodo = async (req: Request, res: Response) => {
    const { user_id, title } = req.body;
    try {
        const result = await todoServices.todoCreate(user_id, title);
        res.status(201).json({
            status: true,
            message: "Todo Inserted",
            data: result.rows[0]
        })
    } catch (error: any) {
        res.status(500).json({
            status: false,
            message: error.message,
        })
    }
}

const getTodo = async (req: Request, res: Response) => {
    try {
        const result = await todoServices.getTodo();
        res.status(200).json({
            status: true,
            message: "Todos fetched successfully",
            data: result.rows
        })
    } catch (error: any) {
        res.status(500).json({
            status: false,
            message: error.message
        })
    }
}

const getSingleTodo = async (req: Request, res: Response) => {
    try {
        const result = await todoServices.getSingleTodo(req.params.id!)
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Todo not found" });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to fetch todo" });
    }
}
const updateTodo = async (req: Request, res: Response) => {
    const { title, completed } = req.body;

    try {
        const result = await todoServices.updateTodo(title, completed, req.params.id!)

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Todo not found" });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to update todo" });
    }
}
const deleteTodo = async (req: Request, res: Response) => {
    try {
        const result = await todoServices.deleteTodo(req.params.id!)

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Todo not found" });
        }

        res.json({ success: true, message: "Todo deleted", data: null });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to delete todo" });
    }
}
export const todoControllers = {
    createTodo,
    getTodo,
    getSingleTodo,
    updateTodo,
    deleteTodo
}
