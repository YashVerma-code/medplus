import { Schema, model, models } from 'mongoose'
import User from './user.model'

const doctorSchema = new Schema({
  user:{
    type: Schema.Types.ObjectId,
    ref: User,
    required: true,
  },
  specializations: {
    type: [String],
  },
  experience: {
    type: Number,
    required: true,
  },
  education: {
    type: [String],
  },
  languages:{
    type:[String],
    required: true,
  },
  qualifications:{
    type:[String],
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
  },
  availability: [
    {
      day: {
        type: String,
        required: true,
      },
      slots: [
        {
          start: {
            type: String,
            required: true,
          },
          end: {
            type: String,
            required: true,
          },
          status: {
            type: String,
            enum: ["available", "booked", "unavailable"],
            required: true,
          }
        },
      ]
    }
  ],
  bookedSlots: [
    {
      date: String,
      start: String,
      end: String,
      day: String,
      status: String,
    },
  ],
  phone: {
    type: String,
    required: true,
  },
  professionalDetails:{
    licenseNumber: {
      type: String,
      required: true,
    },
    professionalOrganizations: {
      type: [String],
    },
    publications:{
      type: [String],
    },
    awards: {
      type: [String],
    },
  } 
});

export default models?.Doctor || model('Doctor', doctorSchema);