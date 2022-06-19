const express = require("express"); //importing express
const fetchuser = require("../middleware/fetchuser"); //importing fetchuser
const { body, validationResult } = require("express-validator");

const router = express.Router(); //creating router for express
const Note = require("../models/Notes");

//Route 1 : Get all the notes using: GET - /api/notes/fetchallnotes
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  //making req and res calls for the routes
  const notes = await Note.find({ user: req.user.id });
  res.json(notes); //send json as response of notes array
});

//Route 2 : Get all the notes using: GET - /api/notes/addnote . login required
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  //making req and res calls for the routes
  const notes = await Note.find({ user: req.user.id });
  res.json(notes); //send json as response of notes array
});
module.exports = router; //exporting router
