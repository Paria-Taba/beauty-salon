import mongoose, { Schema, Document, Model } from "mongoose"


export interface IAdmin extends Document {
  email: string
  password: string
  createdAt: Date
  updatedAt: Date
}


export interface IAdminModel extends Model<IAdmin> {}


const adminSchema = new Schema<IAdmin>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
)

export const Admin: IAdminModel =
  mongoose.model<IAdmin, IAdminModel>("Admin", adminSchema)