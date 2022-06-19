const express = require("express"); //importing express
const fetchuser = require("../middleware/fetchuser"); //importing fetchuser
const { body, validationResult } = require("express-validator");

const router = express.Router(); //creating router for express
const Notes = require("../models/Notes");
const { findById } = require("../models/Notes");

//Route 1 : Get all the notes using: GET - /api/notes/fetchallnotes
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    //making req and res calls for the routes
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes); //send json as response of notes array
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

//Route 2 : Get all the notes using: GET - /api/notes/addnote . login required
router.get(
  "/addnote",
  fetchuser,
  [
    //validating title and description
    body("Title", "Enter a valid title").isLength({ min: 1 }),
    body("Description", "Description must no be empty").isLength({ min: 1 }),
  ],
  async (req, res) => {
    try {
      //destructring to get title, description and tag from body
      const { title, description, tag } = req.body;
      //handling errors in validating
      const errors = validationResult(req);
      if (!errors.isEmpty) {
        return res.status(400).json({ error: errors.array() });
      }

      //creating new note
      const note = new Notes({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savedNote = await note.save();
      res.json(savedNote);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

//Route 3 : Update Note - PUT "/api/notes/updatenote". Login required
router.put("/updatenote/:id", fetchuser, async (req, res) => {
  const { title, description, tag } = req.body;
  try {
    //creating new objects
    const newNote = {};
    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tag) {
      newNote.tag = tag;
    }

    // Find note and update it
    let note = await Notes.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Not Found");
    }
    //validating notes for user
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not allowed");
    }
    //updating
    note = await Notes.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );
    res.json(note);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

//Route 4 : Deleting an existing note - Delete - api/notes/deletenote/:id. Login required
router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  try {
    //Find the note and delete it
    let note = await Notes.findById(req.params.id);
    if(!note){return res.status(404).send("Not Found")}

    //deletion is alllowed if user onws the notes
    if(note.user.toString() !== req.user.id){
      res.status(401).send("Not allowed");
    }

    note = await Notes.findByIdAndDelete(req.params.id);
    res.json({"Success" : "Deletion Successfull", note: 'note'})
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});
module.exports = router; //exporting router
