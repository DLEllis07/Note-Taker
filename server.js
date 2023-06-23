const express = require('express');
const path = require('path');
const PORT = 3001;
const app = express();
const fs = require('fs');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'))
app.use('/api', noteRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join('./public/index.html'));
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.listen(PORT, () =>
  console.log(`Express server listening on port ${PORT}!`)
);

app.post("/api/notes", (req, res) => {
  const newNote = req.body;
  const notes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
  newNote.id = uuidv4();
  notes.push(newNote);
  fs.writeFileSync("./db/db.json", JSON.stringify(notes), (err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Error writing notes" });
    } else {
      res.json(newNote);
    }
  });
});

app.delete("/api/notes/:id", (req, res) => {
  const noteId = req.params.id;
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Error reading notes" });
    } else {
      const notes = JSON.parse(data);
      const updatedNotes = notes.filter((note) => note.id !== noteId);
      fs.writeFile("./db/db.json", JSON.stringify(updatedNotes), (err) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: "Error writing notes" });
        } else {
          res.json({ message: "Note deleted" });
        }
      });
    }
  });
});

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});