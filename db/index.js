const express = require('express');
const multer = require('multer');
const mysql = require('mysql2');
const fs = require('fs');
const cors = require('cors');

const app = express();
const upload = multer({ dest: 'uploads/' });
app.use(cors());

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Jacob17_jacob',
    database: 'photo',
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL');
});

// Endpoint for uploading image
app.post('/upload', upload.single('photo'), (req, res) => {
    const filename = req.file.originalname;
    const filePath = req.file.path;
    const imageData = fs.readFileSync(filePath); // Read the image as binary data

    const query = 'INSERT INTO Photos (filename, image_data) VALUES (?, ?)';
    db.query(query, [filename, imageData], (err, result) => {
        if (err) throw err;
        res.send('Image uploaded and saved to database');
    });
});

app.get('/images', (req, res) => {
    const query = 'SELECT * FROM Photos';

    db.query(query, (err, results) => {
        if (err) {
            res.status(500).send('Error retrieving images from database');
        } else if (results.length === 0) {
            res.status(404).send('No images found');
        } else {
            // Ensure images are sent as base64-encoded data
            const base64Results = results.map(result => ({
                ...result,
                image_data: Buffer.from(result.image_data).toString('base64')
            }));
            console.log(base64Results)
            res.json(base64Results);
        }
    });
});





app.listen(3000, () => {
    console.log('Server running on port 3000');
});