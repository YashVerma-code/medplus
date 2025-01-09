
import mongoose from 'mongoose'
import { Schema, model, models } from 'mongoose'

const bedSchema = new Schema({
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      auto: true
    },
    bedId: {
      type: String,
      required: true,
      unique: true
    },
    occupied: {
      type: Boolean,
      required: true
    },
    bedType: {
      type: String,
      required: true,
      enum: ['ICU', 'GENERAL WARD', 'PRIVATE WARD', 'ISOLATION ROOM']
    }
  });


export default models?.Beds || model('Beds', bedSchema);
