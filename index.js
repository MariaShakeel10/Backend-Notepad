import express from 'express'
import path from 'path';
import * as fs from 'node:fs';;
// path to the public folder
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express()
const port = process.env.PORT || 3000

// parsing the request body for form data
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// setting public folder as static folder for static file paths
app.use(express.static(path.join(__dirname, 'public')))
// ejs
app.set('view engine', 'ejs')



app.get('/', (req, res) => {
  fs.readdir(`./files`, (err, files) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error reading files");
    }
    res.render('index', { files: files });
  });
});

// create file

app.post('/create', (req, res) => {
  const filename = req.body.title.split(' ').join('') + '.txt';
  fs.writeFile(`./files/${filename}`, req.body.details, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error saving the file");
    }
    res.redirect('/');
  });
});

// read file

app.get('/files/:filename', (req, res) => {
  fs.readFile(`./files/${req.params.filename}`,"utf8", (err, filedata) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error reading files");
    }
    res.render('show', { filename: req.params.filename, filedata: filedata });
  });
});

// edit filename

app.get('/edit/:filename', (req, res) => {
 
    res.render('edit', { filename: req.params.filename});

});

app.post('/edit', (req, res) => {

  const newFilename = req.body.new.split(' ').join('') + '.txt';

  fs.rename(`./files/${req.body.previous}`, `./files/${newFilename}`, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error renaming the file");
    }
    res.redirect('/');
  });
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})