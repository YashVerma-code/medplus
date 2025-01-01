import { Schema, model, models } from 'mongoose';

const resourceSchema = new Schema(
  {
    itemName: {
      type: String,
      required: true,
      trim: true, // Trims whitespace
    },
    quantity: {
      type: Number,
      required: true,
      min: 0, // Prevents negative quantities
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt fields
);

export default models?.Resource || model('Resource', resourceSchema);
