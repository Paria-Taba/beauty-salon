import mongoose from "mongoose"


const subServiceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  tid: {
    type: String,
    required: true
  },
  price: {
    type: String,
    required: true
  },
   description: {
    type: String,
    required: true
  }
},
{ timestamps: true })


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
