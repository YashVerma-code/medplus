
import mongoose from 'mongoose'
import { Schema, model, models } from 'mongoose'

// Define the schema for Cardtype
const cardSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  tag: {
    type: String,
    required: true
  },  content: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  img: {
    type: String,
    required: true
  },
  desc: {
    type: String,
    required: true
  }
});

export default models?.Card || model('Card', cardSchema);
