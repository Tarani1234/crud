const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;
app.use(express.json());
const cors = require('cors');
app.use(cors());
// database store 
mongoose.connect("mongodb://localhost:27017")
.then(()=>{
    console.log('connected to mongodb');
})
.catch(err =>{
    console.log('error message');
    
})
//database schema
const bookSchema = new mongoose.Schema({
  title: String,
  author: String
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
app.get('/books', async (req, res) => {
  const books = await Book.find();
  res.send(books);
});

app.post('/books', async (req, res) => {
  try {
    let book = new Book({ title: req.body.title, author: req.body.author });
    book = await book.save();
    res.send(book);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.get('/books/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).send('Book not found');
    res.send(book);
  } catch (err) {
    res.status(500).send('Something went wrong');
  }
});
app.put('/books/:id', async (req, res) => {
   try{
    const book = await Book.findByIdAndUpdate(req.params.id, 
      { title: req.body.title,
         author: req.body.author 
        }, 
        { 
          new: true 
        });
    if (!book) return res.status(404).send('Book not found');
    res.send(book);
   }
   catch(err){
    res.status(500).send('Something went wrong');
   }
  });
  
  app.delete('/books/:id', async (req, res) => {
    try {
      const id = req.params.id;
      console.log(`Attempting to delete book with id: ${id}`);
  
      const book = await Book.findByIdAndDelete(id);
  
      if (!book) {
        return res.status(404).send('Book not found');
      }
  
      res.status(204).send();
    } catch (err) {
      console.error('Error occurred:', err);
      res.status(500).send('Something went wrong');
    }
  });
app.listen(port, ()=>{
    console.log(`server is running at http://localhost:${port}`);
})      

