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
    },
    reply: {
      type: String,
      default: ""
    },
    answered: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
)

export const Message = mongoose.model(
  "Message",
  messageSchema,
  "messages"
)