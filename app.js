const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const port = 5000;


const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', 
    password: '', 
    database: 'kelas4' 
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to database: ' + err.stack);
        return;
    }
    console.log('Connected to database as id ' + db.threadId);
});

app.use(cors());
app.use(bodyParser.json());

// Endpoint untuk menambah lagu
app.post('/songs', (req, res) => {
    const { artist, title, is_favorite, genre } = req.body;
    const query = `INSERT INTO songs (artist, title, is_favorite, genre) VALUES (?, ?, ?, ?)`;

    db.query(query, [artist, title, is_favorite, genre], (err, result) => {
        if (err) {
            console.error('Error adding song: ' + err.stack);
            return res.status(500).json({ error: 'Internal server error' });
        }
        return res.status(201).json({ message: 'Song added successfully!' });
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Endpoint untuk menampilkan lagu berdasarkan genre
app.get('/songs/genre/:genre', (req, res) => {
    const { genre } = req.params;
    const query = `SELECT * FROM songs WHERE genre=?`;

    db.query(query, [genre], (err, results) => {
        if (err) {
            console.error('Error fetching songs by genre: ' + err.stack);
            return res.status(500).json({ error: 'Internal server error' });
        }
        return res.status(200).json(results);
    });
});

// Endpoint untuk menampilkan lagu berdasarkan status favorite
app.get('/songs/favorite/:is_favorite', (req, res) => {
    const { is_favorite } = req.params;
    const query = `SELECT * FROM songs WHERE is_favorite=?`;

    db.query(query, [is_favorite], (err, results) => {
        if (err) {
            console.error('Error fetching songs by favorite status: ' + err.stack);
            return res.status(500).json({ error: 'Internal server error' });
        }
        return res.status(200).json(results);
    });
});