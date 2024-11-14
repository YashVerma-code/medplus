import { Schema, model, models } from 'mongoose'

const doctorSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  specialty: {
    type: String,
    required: true,
  },
  experience: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
  },
  availability: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    default: '/placeholder.svg?height=400&width=400',
  },
  phone: {
    type: String,
    required: true,
  },
  about: {
    type: String,
  },
  education: [
    {
      type: String,
    },
  ],
  specializations: [
    {
      type: String,
    },
  ],
});

export default models?.Doctor || model('Doctor', doctorSchema);
