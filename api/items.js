const fs = require("fs");
const path = require("path");

const DATA_FILE = path.join(__dirname, "items.json");

function loadItems() {
  if (!fs.existsSync(DATA_FILE)) return [];
  return JSON.parse(fs.readFileSync(DATA_FILE));
}
function saveItems(items) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(items, null, 2));
}

module.exports = async (req, res) => {
  if (req.method === "GET") {
    res.status(200).json(loadItems());
  } else if (req.method === "POST") {
    const body = await new Promise((resolve) => {
      let str = "";
      req.on("data", (chunk) => (str += chunk));
      req.on("end", () => resolve(JSON.parse(str || "{}")));
    });
    const items = loadItems();
    const item = {
      id: Date.now(),
      title: body.title,
      imageURL: body.imageURL,
    };
    items.push(item);
    saveItems(items);
    res.status(201).json(item);
  } else {
    res.status(405).send("Method Not Allowed");
  }
};
