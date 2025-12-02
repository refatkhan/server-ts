import express, { Request, Response } from 'express';
import dotenv from "dotenv"
import { Pool } from 'pg'
import path from "path"
const app = express()
const port = 5000;
dotenv.config({ path: path.join(process.cwd(), '.env') })
app.use(express.json());

//db
const pool = new Pool({
    connectionString: `${process.env.POOL_URL}`
})
const initDB = async () => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        age  INT,
        phone VARCHAR(18),
        address TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
        )
        `);

    await pool.query(`
            CREATE TABLE IF NOT EXISTS todos(
            id SERIAL PRIMARY KEY,
            user_id INT REFERENCES users(id) ON DELETE CASCADE,
            title VARCHAR (200) NOT NULL,
            description TEXT,
            completed BOOLEAN DEFAULT false,
            deu_date DATE,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
    )
            `)
}

initDB();

app.get('/', (req: Request, res: Response) => {
    res.send('Hello next level guys!')
})

app.post('/', (req: Request, res: Response) => {
    console.log(req.body);
    res.status(201).json({
        success: true,
        message: " Sucess"
    })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
