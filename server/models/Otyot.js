import mongoose from "mongoose"
const { Schema, model } = mongoose;

const OtyotSchema = new Schema({
    ot: String,
    count: Number,
    status: Boolean,
});

const Otyot = model('Otyot', OtyotSchema);

export default Otyot;