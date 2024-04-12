import express from 'express';
import expressEjsLayouts from 'express-ejs-layouts';
import router from './routes/blog.js';
import fileUpload from 'express-fileupload';

const PORT = 3000;
const app = express();

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());

app.use(expressEjsLayouts);
app.set('layout', './layouts/main.ejs');
app.set('view engine', 'ejs');


app.use('/', router);

app.get('*', (req, res) => {
    res.status(404).render('404');
})

app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`)
})
