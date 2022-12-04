// @packages
const express = require("express");
const app = express();

// database
const { MongoClient, ObjectId } = require("mongodb");

// port
const port = process.env.PORT || 5000;

// middlewares
const cors = require("cors");
require("dotenv").config();
app.use(express.json({ limit: "50mb" }));
app.use(cors());

// Mongodb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.a7zq8.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri);

async function run() {
  try {
    // Use connect method to connect to the server
    await client.connect();

    // database name to select
    const database = client.db("shoppers_tale");

    // name of collections
    const paymentMethodsCl = database.collection("payment_methods");
    const indiaMarketCl = database.collection("india-sites");
    const chinaMarketCl = database.collection("china-sites");
    const ukMarketCl = database.collection("uk-sites");
    const usersCl = database.collection("users");

    // operations

    // @users

    // create
    app.post("/users", async (req, res) => {
      let data = req.body;
      // inser extra field
      data.img = "";
      data.phone = "";
      data.password = "";

      const result = await usersCl.insertOne(data);
      res.json(result);
    });
    // update
    app.patch("/users", async (req, res) => {
      const data = req.body;
      const email  = data.email;
      console.log(email)


      const filter = { email: email };
            const options = { upsert: false };

      const updateDoc = {
        $set: {
          img: data.img,
          displayName: data.displayName,
          phone: data.phone
      },
      };

      const result = await usersCl.updateOne(filter,updateDoc,options);

      res.json(result);
    });
    // get info
    app.get('/users/:email', async (req,res)=> {
      const {email} = req?.params;

      const cursor = usersCl.findOne({email: email});
      const data = await cursor;
      res.json(data)
    })

    // @payment methods
    app.get("/payment-methods", async (req, res) => {
      const cursor = paymentMethodsCl.find({});
      const data = await cursor.toArray();
      res.json(data);
    });

    app.post("/payment-methods", async (req, res) => {
      let data = req.body;

      const result = await paymentMethodsCl.insertOne(data);
      res.json(result);
    });

    app.delete("/payment-methods", async (req, res) => {
      const { id } = req.body;

      const query = { _id: ObjectId(id) };
      const result = await paymentMethodsCl.deleteOne(query);

      res.json(result);
    });

    // @ MARKETPLACE
    // india
    app.get("/market/india", async (req, res) => {
      const cursor = indiaMarketCl.find({});
      const data = await cursor.toArray();
      res.json(data);
    });
    app.delete("/market/india", async (req, res) => {
      const { id } = req.body;

      const query = { _id: ObjectId(id) };
      const result = await indiaMarketCl.deleteOne(query);

      res.json(result);
    });

    // china
    app.get("/market/china", async (req, res) => {
      const cursor = chinaMarketCl.find({});
      const data = await cursor.toArray();
      res.json(data);
    });
    app.delete("/market/china", async (req, res) => {
      const { id } = req.body;

      const query = { _id: ObjectId(id) };
      const result = await chinaMarketCl.deleteOne(query);

      res.json(result);
    });

    // UK
    app.get("/market/uk", async (req, res) => {
      const cursor = ukMarketCl.find({});
      const data = await cursor.toArray();
      res.json(data);
    });
    app.delete("/market/uk", async (req, res) => {
      const { id } = req.body;

      const query = { _id: ObjectId(id) };
      const result = await ukMarketCl.deleteOne(query);

      res.json(result);
    });

    // add new site
    app.post("/add-new-site", async (req, res) => {
      const data = req?.body;
      const country = data?.country;

      if (country === "india") {
        const result = await indiaMarketCl.insertOne(data);
        res.json(result);
        return;
      }
      if (country === "china") {
        const result = await chinaMarketCl.insertOne(data);
        res.json(result);
        return;
      }
      if (country === "uk") {
        const result = await ukMarketCl.insertOne(data);
        res.json(result);
        return;
      }

      res.json({});
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// default listen
app.get("/", (req, res) => {
  res.send("Shoppers Tale App");
});

app.listen(port, () => {
  console.log(`Shoppers Tale app listening on port ${port}`);
});
