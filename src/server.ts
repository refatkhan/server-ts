import { Message } from './../node_modules/esbuild/lib/main.d';
import express, { Request, Response } from 'express';
const app = express()
const port = 5000;
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.send('Hello next level guys!')
})

app.post('/', (req: Request, res: Response) => {
    console.log(req.body);
    res.status(201).json({
        success: true,
        message: " Sucess",
    })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
