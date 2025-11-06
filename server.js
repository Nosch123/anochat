const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));

const MSG_FILE = path.join(__dirname, 'messages.json');

// Nachricht senden
app.post('/send', (req, res) => {
    const { text, user } = req.body;
    if (!text || !user) return res.status(400).send('Fehlerhafte Nachricht');

    const message = { text, time: new Date().toLocaleTimeString(), user };

    fs.readFile(MSG_FILE, 'utf8', (err, data) => {
        if (err) return res.status(500).send('Fehler beim Lesen');
        const messages = JSON.parse(data);
        messages.push(message);
        fs.writeFile(MSG_FILE, JSON.stringify(messages, null, 2), (err) => {
            if (err) return res.status(500).send('Fehler beim Speichern');
            res.json(message);
        });
    });
});

// Chat-Verlauf laden
app.get('/history', (req, res) => {
    fs.readFile(MSG_FILE, 'utf8', (err, data) => {
        if (err) return res.status(500).send('Fehler beim Lesen');
        const messages = JSON.parse(data);
        res.json(messages);
    });
});

app.listen(PORT, () => {
    console.log(`Server läuft auf http://localhost:${PORT}`);
});
