const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

// Initialize the Express app
const app = express();
const port = 5000;

// Enable CORS for React frontend
app.use(cors());

// Middleware to parse JSON body
app.use(express.json());

// Create MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'cms_data',  
});

// Fetch events from the database
app.get('/events', (req, res) => {
  connection.query('SELECT * FROM events', (err, results) => {
    if (err) {
      console.error('Error fetching events:', err);
      return res.status(500).json({ message: 'Could not load events' });
    }
    res.json({ data: results });
  });
});

// Add a new event
app.post('/events', (req, res) => {
  const { title, date, description } = req.body;
  if (!title || !date) {
    return res.status(400).json({ message: 'Title and date are required' });
  }

  const query = 'INSERT INTO events (title, date, description) VALUES (?, ?, ?)';
  connection.query(query, [title, date, description], (err, results) => {
    if (err) {
      console.error('Error adding event:', err);
      return res.status(500).json({ message: 'Failed to add event' });
    }
    const newEvent = {
      id: results.insertId, // ID of the newly inserted event
      title,
      date,
      description,
    };
    res.json({ data: newEvent });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
