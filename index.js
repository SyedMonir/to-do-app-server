const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const port = process.env.PORT || 5000;

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zpztt.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    console.log('Mongodb Connected');
    const todoCollection = client.db('to-do').collection('tasks');

    app.get('/todo', async (req, res) => {
      const todo = await todoCollection.find().toArray();
      res.send(todo);
    });

    app.post('/todo', async (req, res) => {
      const todo = req.body;
      const result = await todoCollection.insertOne(todo);
      res.send(result);
    });

    app.put('/todo/:id', async (req, res) => {
      const id = req.params.id;
      //   console.log(id);
      const isComplete = req.body;
      //   console.log(isComplete);
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: { completed: isComplete.completed },
      };
      const result = await todoCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    });

    app.delete('/todo/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await todoCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
  }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('To-Do Server Running..');
});

app.listen(port, () => {
  console.log('To-Do Server Running..');
});
