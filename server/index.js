import express from "express";
import mongoose from "mongoose";
import Psukim from "./models/Passuks.js";
import Otyot from "./models/Otyot.js";
import cors from "cors";
import https from "https";
import fs from "fs";

// Create the server
const app = express();
app.use(cors());
app.use(express.json());

// Connect to the database
mongoose.connect("mongodb://database:27017/Otyot");

app.get("/api/getPsukim", async (req, res) => {
  try {
    const psukim = await Psukim.find({}).populate("otyot");

    if (psukim) {
      res.json({ psukim });
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred while fetching the Passuk." });
  }
});

app.get("/api/searchOtyot", async (req, res) => {
  try {
    let otyot = [];
    const { input } = req.query;

    //checks if it is a word or a letter
    const mila = input.split("");

    if (mila.length > 1) {
      for (const ot of mila) {
        const results = await Otyot.findOne({ ot }).populate("passuk");
          otyot.push(results);
      }
    } else {
      otyot = await Otyot.find({ ot: input }).populate("passuk");
    }
      if (otyot.length > 0) {
        // Sort the Otyot by their passuk index
        otyot.sort((a, b) => a.passuk.index - b.passuk.index);

      // Check if the indices of the Otyot are in order of the user's input
      let isInOrder = true;
      for (let i = 0; i < mila.length - 1; i++) {
        if (otyot[i].ot !== mila[i]) {
          isInOrder = false;
          break;
        }
      }
      console.log(isInOrder)
      if (isInOrder) {
        // If the Otyot are in order, store the group
        let orderedMila = otyot;
        console.log(orderedMila.length)
        return res.json(orderedMila);
    } else {
    return res.json([]);

    }
    } else {
      return res.json([]);
    }
} catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "An error occurred while fetching the Otyot." });
  }
});




// Route for the generation of the database
app.post("/api/database", async (req, res) => {
  try {
    const passukim = req.body.passukim; // Assuming 'passukim' is an array of objects

    if (!Array.isArray(passukim)) {
      return res
        .status(400)
        .json({ error: "Invalid input. Please provide an array of passukim." });
    }

    for ( let i = 0; i < passukim.length; i++) {
      if (typeof passukim[i].passuk !== "string") {
        return res
          .status(400)
          .json({ error: "Invalid passuk. All passukim must be strings." });
      }

      // Create a new Psukim object
      const newPassuk = new Psukim({ passuk: passukim[i].passuk,index: i, otyot: [] });
      const passukId = newPassuk._id;

      const otyot = passukim[i].passuk.split("");
      for ( let i = 0; i < otyot.length; i++) {
        const ot = otyot[i];
        const newOtyot = new Otyot({ ot, status: true,  index: i ,passuk: passukId });
        await newOtyot.save();
        newPassuk.otyot.push(newOtyot._id);
      }
      await newPassuk.save();
    }
    res.status(200).json({ message: "All passukim and their otyot stored successfully." });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ error: "An error occurred while storing the passukim and their otyot." });
  }
});



// HTTPS server options
const httpsOptions = {
  key: fs.readFileSync("/etc/letsencrypt/live/ytzba.com/privkey.pem"),
  cert: fs.readFileSync("/etc/letsencrypt/live/ytzba.com/fullchain.pem"),
};

// Create HTTPS server
https.createServer(httpsOptions, app).listen(3001, () => {
  console.log("Server running on https://localhost:3001");
}).on("error", console.error);