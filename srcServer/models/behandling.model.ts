import mongoose from "mongoose"


const subServiceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  }
})


const behandlingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      required: true
    },
    services: [subServiceSchema]
  },
  { timestamps: true }
)


export const Behandling = mongoose.model(
  "Behandling",
  behandlingSchema,
  "behandlingar"
)
