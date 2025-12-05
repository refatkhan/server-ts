import { pool } from "../../config/db"
import bcrypt from 'bcryptjs';
const logIn = async (email: string, password: string) => {
    const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
    if (result.rows.length === 0) {
        return "user not found"
    }
    const user = result.rows[0];
    const matchedPass = await bcrypt.compare(password, user.password);
    if(!matchedPass){
        return null;
    }
    const token = jwt
}
export const authServices = {
    logIn,
}