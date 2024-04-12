import { pool } from "../database/db_connection.js";

export const showCreateCategory = async (req, res) => {
    try {
        const [categories] = await pool.query('SELECT * FROM `categories`');
        res.render('categories/view', { categories });
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ error: 'Internal Server error'})
    }
}

export const createCategory = async (req, res) => {
    const { name } = req.body;
    try {
        await pool.execute(`INSERT INTO categories (name) VALUES ('${name}')`);
        res.status(201).redirect('back');
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ error: 'Internal Server error'})
    }
}

export const deleteCategory = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.execute(`DELETE FROM categories WHERE id = ${id}`);
        res.status(201).redirect('back');
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server error'})
    }
}