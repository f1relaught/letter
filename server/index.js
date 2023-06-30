import express from "express";
import mongoose from "mongoose";
import Psukim from "./models/Passuks.js"
import Otyot from "./models/Otyot.js"
import cors from "cors";


const app = express()
app.use(cors())
app.use(express.json())


mongoose.connect('mongodb://database:27017/Otyot')

app.get("/getPsukim", async (req, res) => {
    const passuk = await Psukim.find({})
    if (passuk === null) {
        res.json(err)
    } else {
        res.json(passuk)
    }
});

app.get("/getOtyot", async (req, res) => {
	try {
	  const { ot } = req.query;
	  console.log(ot)
	  const otyot = await Otyot.findOne({ ot: ot });
		
	  if (otyot) {
		res.json({ ot: otyot.ot, count: otyot.count, status: otyot.status });
	  } else {
		res.json({ exists: false });
	  }
	} catch (error) {
	  console.error('Error:', error);
	  res.status(500).json({ error: 'An error occurred while fetching the Otyot.' });
	}
  });

app.post("/passuk", async (req, res) => {
    try {
		
		const passuk = req.body.passuk

		if (typeof passuk !== 'string') {
			return res.status(400).json({ error: 'Invalid sentence. Please provide a string.' });
		  }

		// Store the sentence in the passuks collection
		const newPassuk = new Psukim({ passuk });
		await newPassuk.save();
		  
		// Map the letters and store them in the letter collection
		for (const ot of passuk) {
			if (ot) {
			  const otyot = await Otyot.findOne({ ot });
			  if (!otyot) {
				const newOtyot = new Otyot({
				  ot,
				  count: 1,
				  status: true
				});
				await newOtyot.save();
				console.log("This letter does not exist yet!");
			  } else {
				await Otyot.updateOne(
				  { _id: otyot._id },
				  { $inc: { count: 1 } }
				);
				console.log("This letter is already in the database!");
			  }
			}
		  }
	
		res.status(200).json({ message: 'Passuk and otyot stored successfully.' });
	  } catch (error) {
		console.error('Error:', error);
		res.status(500).json({ error: 'An error occurred while storing the passuk and otyot.' });
	  }
	});


app.listen('3001', () => {
    console.log("Server running 3001")
})
