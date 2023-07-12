import mongoose from "mongoose";
const { Schema, model } = mongoose;

const PsukimSchema = new Schema({
    passuk: String,
    index: Number,
    otyot: [{ type: Schema.Types.ObjectId, ref: "Otyot" }],
});

const Psukim = model('Psukim', PsukimSchema);

export default Psukim;