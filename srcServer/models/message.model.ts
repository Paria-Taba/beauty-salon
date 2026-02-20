import mongoose from "mongoose"

const messageSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
)

export const Message = mongoose.model(
  "Message",
  messageSchema,
  "messages"
)