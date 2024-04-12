import express from "express";
import { createArticle, deleteArticle, homepage, modifyArticle, showArticle, showCreateArticle, showEditArticle } from "../controllers/articleController.js";
import { createCategory, deleteCategory, showCreateCategory } from "../controllers/categoryController.js";

const router = express.Router();

router.get('/', homepage);
router.get('/add-article', showCreateArticle);
router.post('/add-article', createArticle);

router.get('/article/:id', showArticle);

router.get('/edit-article/:id', showEditArticle);
router.post('/edit-article/:id', modifyArticle);
router.post('/delete/article/:id', deleteArticle);

router.get('/categories', showCreateCategory);
router.post('/add-category', createCategory);
router.post('/delete-category/:id', deleteCategory);

export default router;