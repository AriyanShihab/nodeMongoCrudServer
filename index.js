const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const { ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
//
//

const uri =
  "mongodb+srv://ariyanNodeMongoCrud:2yHUdO2aPVYNaFYh@cluster0.f57powx.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const contactCollection = client
      .db("contactList")
      .collection("conatctList");

    app.get("/contacts", async (req, res) => {
      const coursor = contactCollection.find({});
      const contact = await coursor.toArray();
      res.send(contact);
    });

    app.get("/contacts/:id", async (req, res) => {
      const id = req.params.id;
      const quary = { _id: ObjectId(id) };
      const result = await contactCollection.findOne(quary);
      res.send(result);
    });

    app.post("/contacts", async (req, res) => {
      const conatct = req.body;
      const result = await contactCollection.insertOne(conatct);
      res.send(result);
    });
    app.put("/update/:contact", async (req, res) => {
      const id = req.params.contact;
      const updatedContact = req.body;
      const { name, number } = updatedContact;
      const options = { upsert: true };

      const updateDoc = {
        $set: {
          name: name,
          number: number,
        },
      };

      const filter = { _id: ObjectId(id) };

      const result = await contactCollection.updateOne(
        filter,
        updateDoc,
        options
      );

      res.send(result);
    });

    app.delete("/contacts/:id", async (req, res) => {
      const exactContactID = req.params.id;
      const quary = { _id: ObjectId(exactContactID) };
      const result = await contactCollection.deleteOne(quary);
      res.send(result);
    });
  } finally {
  }
}

run().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("hello from node server");
});

app.listen(port, () => {
  console.log(`server is running on ${port}`);
});
