const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
});

const itemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  imageURL: { type: String, required: true },
});
const Item = mongoose.model("Item", itemSchema);

app.get("/items", async (req, res) => {
  try {
    const items = await Item.find();
    console.log("Fetched items:", items);
    return res.json(items);
  } catch (err) {
    console.error("Error fetching items:", err);
    res.status(500).json({ error: "Database query failed" });
  }
});

app.post("/items", async (req, res) => {
  if (!req.body) {
    return res.status(400).json({ error: "Missing request body" });
  } else if (!req.body.title || !req.body.imageURL) {
    return res
      .status(400)
      .json({ error: "Missing 'title' or/and 'imageURL' in request body" });
  }

  const { title, imageURL } = req.body;
  if (!title || !imageURL) {
    return res
      .status(400)
      .json({ error: "Missing 'title' or 'imageURL' in request body" });
  }
  const item = new Item({ title, imageURL });
  await item.save();
  res.status(201).json(item);
});

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Items API!" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Express app listening on port ${PORT}`);
});
