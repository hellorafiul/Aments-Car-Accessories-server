const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const { MongoClient } = require('mongodb');

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.komfq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
  try {
    await client.connect();
    const database = client.db('amentsCarShop');
    const orderCollection = database.collection('orders');
    const reviewCollection = database.collection('reviews');
    const productCollection = database.collection('products');

    // Post reviews/Testimonial
    app.post('/reviews', async (req, res) => {
      const reviews = req.body;
      const result = await reviewCollection.insertOne(reviews);
      res.json(result)
    });
    // get All reviews/Testimonial
    app.get('/reviews', async (req, res) => {
      const result = await reviewCollection.find({}).toArray();
      res.json(result)
    });

    // Post/Add Product
    app.post('/addProduct', async (req, res) => {
      const reviews = req.body;
      const result = await productCollection.insertOne(reviews);
      res.json(result)
    });

    // get All Product
    app.get('/products', async (req, res) => {
      const { limit } = req.query

      if (limit > 0) {
        const result = await productCollection.find({}).limit(parseInt(limit)).toArray();
        res.json(result)
      } else {
        const result = await productCollection.find({}).toArray();
        res.json(result)
      }
    });


    // Order Now
    app.post("/orders", async (req, res) => {
      console.log(req.body)
      const result = await orderCollection.insertOne(req.body);
      res.send(result)
    })

    // Load my Order 
    app.get('/orders/:email', async (req, res) => {
      const result = await orderCollection.find({ email: req.params.email }).toArray()
      res.send(result)
    })

    // Load All Orders 
    app.get('/orders', async (req, res) => {
      const result = await orderCollection.find({}).toArray()
      res.send(result)
    })

  } finally {

    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Welcome to Aments Car parts shop!!!')
})

app.listen(port, () => {
  console.log(`Listing at ${port}`)
})