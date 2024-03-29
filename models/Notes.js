const mongoose = require("mongoose");
const { Schema } = mongoose;

const NotesSchema = new Schema({
  // linking user to their specific notes
  user: {
      type:mongoose.Schema.Types.ObjectId,
      ref:'user'
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  tag: {
    type: String,
    default:"General"
  },
  date: {
    type: String,
    default: Date.now,
  },
});

module.exports = mongoose.model("notes", NotesSchema);
