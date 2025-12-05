import express, { Request, Response } from 'express';
import config from './config';
import initDB, { pool } from './config/db';
import logger from './middleware/logger';
import { userRoute } from './modules/user/user.route';
import { todoRouter } from './modules/todo/todo.route';
import { authRoutes } from './modules/auth/auth.route';
const app = express()
const port = config.port;
app.use(express.json());
initDB();

app.get('/', logger, (req: Request, res: Response) => {
    res.send('Hello next level guys!')
})
//-----------------------> user crud----------------->
app.use("/users", userRoute)
//================TODOS======================//
app.use('/todos', todoRouter)

//============AUTH ROUTES==============//
app.use("/auth", authRoutes)
//unknown route 
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
        path: req.path,
    });
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
