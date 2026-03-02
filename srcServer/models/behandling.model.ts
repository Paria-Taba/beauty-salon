import mongoose, {
  Schema,
  Document,
  Model,
  Types
} from "mongoose"


export interface ISubService extends Document {
  name: string
  price: string
  description: string
  createdAt: Date
  updatedAt: Date
}



export interface IBehandling extends Document {
  title: string
  description: string
  icon: string
  images: string[]
  services: Types.DocumentArray<ISubService>
  createdAt: Date
  updatedAt: Date
}

export interface IBehandlingModel extends Model<IBehandling> {}



const subServiceSchema = new Schema<ISubService>(
  {
    name: { type: String, required: true, trim: true },
    price: { type: String, required: true },
    description: { type: String, required: true }
  },
  { timestamps: true }
)



const behandlingSchema = new Schema<IBehandling>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    icon: { type: String, required: true },
    images: [{ type: String }],
    services: [subServiceSchema]
  },
  { timestamps: true }
)

export const Behandling: IBehandlingModel =
  mongoose.model<IBehandling, IBehandlingModel>(
    "Behandling",
    behandlingSchema,
    "behandlingar"
  )