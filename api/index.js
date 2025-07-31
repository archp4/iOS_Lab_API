const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

let items = [];

app.get("/items", (req, res) => {
  res.json(items);
});

app.post("/items", (req, res) => {
  const { title, imageURL } = req.body;

  if (!title || !imageURL) {
    return res
      .status(400)
      .json({ error: "Missing 'title' or 'imageURL' in request body" });
  }

  const item = {
    id: Date.now(),
    title,
    imageURL,
  };

  items.push(item);
  res.status(201).json(item);
});

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Items API!" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Express app listening on port ${PORT}`);
});
