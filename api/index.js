const http = require("http");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define Schema and Model for donations data
const donationSchema = new mongoose.Schema({
  name: String,
  presentation: String,
  form: String,
  laboratory: String,
  scannedLot: String,
  scannedExp: String,
  scannedGtin: String,
  scannedSerial: String,
});

const Donation = mongoose.model("Donation", donationSchema);

// Middleware to log incoming requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error caught in error handling middleware:", err);
  res.status(500).json({ error: "Internal server error" });
});

// API Endpoint to handle data submission
app.post("/api/donations", async (req, res, next) => {
  try {
    const {
      name,
      presentation,
      form,
      laboratory,
      scannedLot,
      scannedExp,
      scannedGtin,
      scannedSerial,
    } = req.body;

    if (!scannedGtin || !scannedLot) {
      return res
        .status(400)
        .json({ error: "Barcode data are required" });
    }

    const newDonation = new Donation({
      name,
      presentation,
      form,
      laboratory,
      scannedLot,
      scannedExp,
      scannedGtin,
      scannedSerial,
    });

    await newDonation.save();

    console.log("Donation saved successfully:", newDonation);
    res.status(201).json({ message: "Donation saved successfully" });
  } catch (error) {
    console.error("Error caught in API endpoint:", error);
    next(error);
  }
});

// API Endpoint to fetch all donations
app.get("/api/donations", async (req, res, next) => {
  try {
    const donations = await Donation.find();
    console.log("Donations fetched successfully:", donations);
    res.json(donations);
  } catch (error) {
    console.error("Error caught in API endpoint:", error);
    next(error);
  }
});

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
