import mongoose from "mongoose"

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  ownerId: {
    type: String,
    required: true
  },
  solved: {
    type: Boolean,
    required: true,
    default: false
  },
});

export const TaskModel = mongoose.models.Task || mongoose.model("Task", taskSchema);
