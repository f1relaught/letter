import mongoose from "mongoose";
import Otyot from "./Otyot.js"
const { Schema, model } = mongoose;

const PsukimSchema = new Schema({
    passuk: String,
    otyot: [Otyot.schema],
});

const Psukim = model('Psukim', PsukimSchema);

export default Psukim;