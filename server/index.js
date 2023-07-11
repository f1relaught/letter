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

// Route for the passuk's search
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

app.get("/api/getOtyot", async (req, res) => {
  try {
    const otyot = await Otyot.find({ ot: ot });
    console.log(ot)
    res.json({ otyot });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred while fetching the Otyot." });
  }
});

app.get("/api/searchOtyot", async (req, res) => {
  try {
    const { ot } = req.query;
    const otyot = await Otyot.find({ ot: ot });

    if (otyot.length > 0) {
      console.log(otyot.ot);
      res.json(otyot);
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred while fetching the Otyot." });
  }
});


// Route for the generation of the database
app.post("/api/database", async (req, res) => {
  try {
    const passuk = req.body.passuk;

    if (typeof passuk !== "string") {
      return res
        .status(400)
        .json({ error: "Invalid sentence. Please provide a string." });
    }

    // Store the sentence in the passuks collection
    const newPassuk = new Psukim({ passuk, otyot: [] });
    const passukId = newPassuk._id;

    // Store the otyot in the otyot collection
    const otyot = passuk.split("");

    for (const ot of otyot) {
      const newOtyot = new Otyot({
        ot,
        status: true,
        passuk: passukId,
      });
      await newOtyot.save();
      newPassuk.otyot.push(newOtyot._id);
    }
    await newPassuk.save();
    res.status(200).json({ message: "Passuk and otyot stored successfully." });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ error: "An error occurred while storing the passuk and otyot." });
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