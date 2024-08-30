import { useState, useEffect } from 'react';
import axios from 'axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import './App.css';
const App = () => {
  
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [editingId, setEditingId] = useState(null);

  // Fetch all books
  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await axios.get("http://localhost:3000/books");
      setBooks(res.data);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };
  

  // Create a book
  const createBook = async () => {
    try {
      const res = await axios.post('http://localhost:3000/books', { title, author });
      setBooks([...books, res.data]);
      setTitle('');
      setAuthor('');        
    } catch (err) {
      console.error(err);
    }
  };

  // Update a book
  const updateBook = async () => {
    try {
      const res = await axios.put(`http://localhost:3000/books/${editingId}`, { title, author });
      setBooks(books.map(book => (book._id === editingId ? res.data : book)));
      setTitle('');
      setAuthor('');
      setEditingId(null);
    } catch (err) {
      console.error(err);
    }
  };

  // Delete a book
  const deleteBook = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/books/${id}`);
      setBooks(books.filter(book => book._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    editingId ? updateBook() : createBook();
  };

  const handleEdit = (book) => {
    setTitle(book.title);
    setAuthor(book.author);
    setEditingId(book._id);
  };

  return (
    <div className="App">
      <h1 className='book-list'>Book List</h1>
      <form onSubmit={handleSubmit} className='form-elements'>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
         
        />
        <input
          type="text"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
        />
        <button type="submit" className='btn'>{editingId ? 'Update' : 'Add'} Book</button>
      </form>
      <TableContainer component={Paper} className='table'>
      <Table sx={{ minWidth: 650 }} aria-label="simple table" >
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell align="center"><h1>Title</h1></TableCell>
            <TableCell align="center"><h1>Author</h1></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {books.map((book) => (
            <TableRow
              key={book._id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {book.name}
              </TableCell>
              <TableCell align="center" className='row-element'>{book.title}</TableCell>
              <TableCell align="center" className='row-element'>{book.author}</TableCell>
              <TableCell align="center"> <button onClick={() => handleEdit(book)} className='btn-editing'>Edit</button></TableCell>
              <TableCell align="center"><button onClick={() => deleteBook(book._id)} className='btn-editing'>Delete</button></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </div>
  );
};

export default App;
