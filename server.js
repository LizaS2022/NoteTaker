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
    res.json('Information posted!');
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


app.delete("/api/notes/:note_ID", (req, res)=> {
   
    const noteId = req.params.note_ID;

    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.log(err);
        }
        else {
            const notes = JSON.parse(data);
            const deleteNote = notes.filter((note) => note.note_ID !== noteId);
            fs.writeFile('./db/db.json', JSON.stringify(deleteNote), (err, data) => {
               if (err) {
                console.log(err);
               }
               else {
                res.json(deleteNote);
                console.log("a note was deleted");
                
               }
            });
        }
    })
});

app.listen(3006, () => console.log('Server on port 3006'));