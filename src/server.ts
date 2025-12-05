import express, { Request, Response } from 'express';
import dotenv from "dotenv"
import { Pool, Query } from 'pg'
import path from "path"
import { error } from 'console';
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
//-----------------------> user crud----------------->
//user create
app.post('/users', async (req: Request, res: Response) => {
    const { name, email, age } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO users(name, email, age) VALUES ($1, $2, $3) RETURNING * `,
            [name, email, age]
        )
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
})
//all user
app.get('/users', async (req: Request, res: Response) => {
    try {
        const result = await pool.query(`SELECT * FROM users`);
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
})
//single user
app.get('/users/:id', async (req: Request, res: Response) => {

    try {
        const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [req.params.id]);
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
})

//update user
app.put('/users/:id', async (req: Request, res: Response) => {
    const { name, email, age } = req.body;
    try {
        const result = await pool.query(`UPDATE users SET name=$1,email=$2, age=$3 WHERE id=$4 RETURNING *`, [name, email, age, req.params.id]);
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
})

//delete users
app.delete('/users/:id', async (req: Request, res: Response) => {
    try {
        const result = await pool.query(`DELETE FROM users WHERE id = $1`, [req.params.id]);

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
})


//================TODOS======================//
//create todo
app.post('/todos', async (req: Request, res: Response) => {
    const { user_id, title } = req.body;
    try {
        const result = await pool.query(`INSERT INTO todos (user_id, title) VALUES ($1, $2) RETURNING *`, [user_id, title]);
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
})
//get all todos
app.get('/todos', async (req: Request, res: Response) => {
    try {
        const result = await pool.query(`SELECT * FROM todos`);
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
})
// Get single todo
app.get("/todos/:id", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM todos WHERE id = $1", [
            req.params.id,
        ]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Todo not found" });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to fetch todo" });
    }
});

// Update todo
app.put("/todos/:id", async (req, res) => {
    const { title, completed } = req.body;

    try {
        const result = await pool.query(
            "UPDATE todos SET title=$1, completed=$2 WHERE id=$3 RETURNING *",
            [title, completed, req.params.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Todo not found" });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to update todo" });
    }
});

// Delete todo
app.delete("/todos/:id", async (req, res) => {
    try {
        const result = await pool.query(
            "DELETE FROM todos WHERE id=$1 RETURNING *",
            [req.params.id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Todo not found" });
        }

        res.json({ success: true, message: "Todo deleted", data: null });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to delete todo" });
    }
});
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
