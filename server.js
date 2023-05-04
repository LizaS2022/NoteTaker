const express = require('express');
const fs = require('fs');
const uuid = require('./helpers/uuid');
const util = require('util');
const path = require('path');
const { Console } = require('console');


const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
    console.log(`${req.method} is initiated`);
})

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
    console.log(`${req.method} is initiated`);
    
})

// GET /api/notes should read the db.json file and return all saved notes as JSON.

app.post('/api/notes', (req, res) => {

    const {title, text} = req.body;

    if (title && text) {
        const newNote = {
            title,
            text,
            note_ID: uuid(),
        }

    fs.readFile('./db/db.json', (err, data) => {
        if (err) {
            console.log(err);
        }
        else{
            const readFromFile = JSON.parse(data);
            console.log(readFromFile);
            readFromFile.push(newNote);
            console.log(readFromFile);
            const stringifyReadfromFile = JSON.stringify(readFromFile);
            fs.writeFile('./db/db.json', stringifyReadfromFile, (err) => {
            if (err) {
                console.log(err);
            }
            else {
                console.log(`review ${newNote} has been written to JSON file`)
            }
            
        });
             
    }
    });
    
    }
   
});

app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.log(err);
        }
        else {
            res.json(JSON.parse(data));
            JSON.parse(data);
            
        }
    })
})


// DELETE/api/notes/:id should receive a query parameter containing the id of a note to delete
// in order to delete a note, you need to read all the notes from the db.json file, remove the note with the given id number, and rewrite the notes to the db.json file.


app.delete("/api/notes/:note_ID", (req, res)=> {
    const noteId = req.params.note_ID;
    console.log(noteId);
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.log(err);
        }
        else {
            const notes = JSON.parse(data);
            const deleteNote = notes.filter((note) => note.ID !== noteId);
            fs.writeFile('./db/db.json', json.stringify(deleteNote), (err, data) => {
               if (err) {
                console.log(err);
               }
               else {
                console.log("a note was deleted");
                res.sendFile('/api/notes/', json(deleteNote));
               }
            });
            

        }
    })
});









app.listen(3002, () => console.log('Server on port 3002'));