import { Request, Response } from "express";
import { pool } from "../../config/db";
import { userServices } from "./user.service";

const createUser = async (req: Request, res: Response) => {
    const { name, email, age, password } = req.body;
    try {
        const result = await userServices.createUserDB(req.body);

        res.status(201).json({
            status: true,
            message: "Inserted successfully done",
            data: result.rows[0]
        })
    } catch (err: any) {
        res.status(500).json({
            message: err.message,
        })
    }
}

const getUsers = async (req: Request, res: Response) => {
    try {
        const result = await userServices.getUsers();
        res.status(200).json({
            success: true,
            message: "Users fetch success",
            data: result.rows,
        })

    } catch (error: any) {
        res.status(500).json({
            message: error,
        })
    }
}
const getSingleUser = async (req: Request, res: Response) => {
    try {
        const result = await userServices.getSingleUser(req.params.id as string)
        if (result.rows.length === 0) {
            res.status(400).json({
                success: false,
                message: "User not found",
            })
        } else {
            res.status(200).json({
                success: true,
                message: "user founded",
                data: result.rows[0]
            })
        }
    } catch (error: any) {
        res.status(500).json({
            message: error,
        })
    }
}
const updateUser = async (req: Request, res: Response) => {
    const { name, email, age } = req.body;
    try {
        const result = await userServices.updateUser(name, email, age, req.params.id!)
        if (result.rows.length === 0) {
            res.status(400).json({
                success: false,
                message: "User not found",
            })
        } else {
            res.status(200).json({
                success: true,
                message: "user updates founded",
                data: result.rows[0]
            })
        }
    } catch (error: any) {
        res.status(500).json({
            message: error,
        })
    }
}
const deleteUser = async (req: Request, res: Response) => {
    try {
        const result = await userServices.deleteUser(req.params.id!)
        if (result.rowCount === 0) {
            res.status(400).json({
                success: false,
                message: "Users not found",
            });
        } else {
            res.status(200).json({
                success: true,
                message: "Users deleted success",
                data: result.rows,
            })
        }
    } catch (error: any) {
        res.status(500).json({
            message: error,
        })
    }
}
export const userControllers = {
    createUser,
    getUsers,
    getSingleUser,
    updateUser,
    deleteUser,
}