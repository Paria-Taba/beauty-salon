import mongoose, {
  Schema,
  Document,
  Model
} from "mongoose"


export interface IMessage extends Document {
  email: string
  text: string
  reply: string
  answered: boolean
  createdAt: Date
  updatedAt: Date
}

export interface IMessageModel extends Model<IMessage> {}

const messageSchema = new Schema<IMessage>(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
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

export const Message: IMessageModel =
  mongoose.model<IMessage, IMessageModel>(
    "Message",
    messageSchema,
    "messages"
  )