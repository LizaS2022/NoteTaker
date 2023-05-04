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
        }
    })
})

app.get("/api/notes/:note_ID", (req, res) => {
    
    const note_ID = req.params.note_ID;
    



})

app.delete("/api/notes/:note_ID", (req, res)=> {

});



// POST /api/notes should receive a new note to save on the request body, add it to the db.json file, and then return the new note to the client. You'll need to find a way to give each note a unique id when it's saved (look into npm packages that could do this for you).





app.listen(3002, () => console.log('Server on port 3002'));