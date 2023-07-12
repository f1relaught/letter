import mongoose from "mongoose"
const { Schema, model } = mongoose;

const OtyotSchema = new Schema({
    ot: String,
    count: Number,
    status: Boolean,
    passuk: [{ type: Schema.Types.ObjectId, ref: "Psukim" }],
});

const Otyot = model('Otyot', OtyotSchema);

export default Otyot;