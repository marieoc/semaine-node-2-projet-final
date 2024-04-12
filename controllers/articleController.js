import fs from "fs";
import { pool } from "../database/db_connection.js";


export const homepage = async (req, res) => {
    try {
        const [articles] = await pool.query('SELECT articles.*, categories.name AS category_name FROM articles JOIN categories ON articles.category_id = categories.id ORDER BY articles.id DESC LIMIT 3;');

        res.render('index', { articles });
    }

    catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server error'})
    }
};

export const showCreateArticle = async (req, res) => {
    try {
        const article = null;

        const [categories] = await pool.query('SELECT * FROM `categories`;');

        res.render('article/add', { article, categories });
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ error: 'Internal Server error'})
    }
}

export const createArticle = async (req, res) => {
    let { title, content, alt, category } = req.body;
    const { image } = req.files;

    title = title.replace(/[\\$'"]/g, "\\$&");
    content = content.replace(/[\\$'"]/g, "\\$&");
    alt = alt.replace(/[\\$'"]/g, "\\$&");
    console.log(title, content, alt)

    try {
        let dir = `./public/uploads`;
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        } else {
        console.log("directory already exists");
        }

        let imageFilePath = `${dir}/${image.name}`;
        
        if (!fs.existsSync(imageFilePath)) {
            // move image to 'public' folder
            image.mv(imageFilePath, (err) => {
                if (err) {
                console.log(err);
                }
            });
        }

        await pool.execute(`INSERT INTO articles (title, content, image, alt, category_id) VALUES ('${title}', '${content}', '${image.name}', '${alt}', '${category}');`);
        res.status(201).redirect('back');
        // res.json({title, content, alt, category});
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ error: 'Internal Server error'})
    }
}


export const showEditArticle = async (req, res) => {
    const { id } = req.params;

    try {
        const article = await pool.query(`SELECT * FROM articles WHERE id = ${id};`);
        const [categories] = await pool.query('SELECT * FROM `categories`;');

        res.render('article/edit', { article: article[0][0], categories });
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ error: 'Internal Server error'})
    }
}

export const modifyArticle = async (req, res) => {
    const { id } = req.params;
    let { title, content, alt, category } = req.body;
    const image = req.files?.image;

    title = title.replace(/[\\$'"]/g, "\\$&");
    content = content.replace(/[\\$'"]/g, "\\$&");
    alt = alt.replace(/[\\$'"]/g, "\\$&");
    console.log(title, content, alt)

    try {
        let dir = `./public/uploads`;
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        } else {
        console.log("directory already exists");
        }

        
        const article = await pool.query(`SELECT * FROM articles WHERE id = ${id};`);
        let imageName = article[0][0].image;

        if (image) {
            imageName = image.name;

            let imageFilePath = `${dir}/${image.name}`;
            let oldImageFilePath = `${dir}/${article[0][0].image}`;
            if (!fs.existsSync(imageFilePath)) {
                // move image to 'public' folder
                image.mv(imageFilePath, (err) => {
                    if (err) {
                    console.log(err);
                    }
                });

                // Remove old picture
                fs.unlink(oldImageFilePath, () => {
                    console.log(`${oldImageFilePath} was deleted`);
                })
            } else {
                console.log('image already exists');
            }
        }

        await pool.execute(`UPDATE articles SET title = '${title}', content = '${content}', image = '${imageName}', alt = '${alt}', category_id = '${category}' WHERE id = ${id};`);
        res.status(201).redirect('/');
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server error'})
    }
}

export const deleteArticle = async (req, res) => {
    const { id } = req.params;

    try {
        // Delete image of article
        let [image] = await pool.query(`SELECT image FROM articles WHERE id = ${id}`)

        let imageArticlePath = `./public/uploads/${image[0].image}`;
        fs.unlink(imageArticlePath, (err) => {
            console.log('image deleted')
        })

        // deleting article
        await pool.execute(`DELETE FROM articles WHERE id = ${id}`);
        res.redirect('back');
    }
    catch (err) {
        console.log(err);
    }
}


export const showArticle = async (req, res) => {
    const { id } = req.params;

    try {
        const [article] = await pool.query(`SELECT * FROM articles WHERE id = '${id}'`);
        const articleCategory = article[0].category_id;

        const [relatedArticles] = await pool.query(`SELECT articles.*, categories.name AS category_name FROM articles  JOIN categories ON articles.category_id = categories.id WHERE category_id = ${articleCategory} AND articles.id != ${id}`);

        res.status(201).render('article/view', { article: article[0], relatedArticles });
    }
    catch (err) {
        console.log(err)
    }
}