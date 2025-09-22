import { model, models, Schema } from "mongoose";

const AddressSchema = new Schema(
  {
    email: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    addressLine1: { type: String, required: true },
    addressLine2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    country: { type: String, required: true },
    contactNumber: { type: String, required: true },
    saveAs: { type: String }, // e.g. Home, Work
    isSelectedAddress: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Prevent model overwrite in dev/hot-reload
const Address = models.Address || model("Address", AddressSchema);

export default Address;
