const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000

app.use(cors({
    origin: ['http://localhost:5174', 'http://localhost:5173',],
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}))

app.use(express.json())
require('dotenv').config()




const uri = "mongodb+srv://bongoKidsServer:ei45.bongokids@bongokidsserver.3cp0kbv.mongodb.net/?retryWrites=true&w=majority&appName=BongoKidsServer";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();
        // Send a ping to confirm a successful connection
        const productCollection = client.db('bongoKids').collection('products')

        // all get operations

        app.get('/all/products', async(req, res)=>{
            const result = await productCollection.find().toArray()
            res.send(result)
        })

        app.get('/single/product/:id', async(req, res)=>{
            const id = req.params.id
            const filter = {_id : new ObjectId(id)}
            const result = await productCollection.findOne(filter)
            res.send(result)
        })

        app.get('/get/product/:gender', async(req, res)=>{
            const gender = req.params.gender
            const filter = {gender : gender}
            const result = await productCollection.find(filter).toArray()
            res.send(result)
        })

        // all post operations

        app.post('/add/new/product', async(req, res)=>{
            const productData = req.body
            const result = await productCollection.insertOne(productData)
            res.send(result)
        })

        // all put operations
        app.put('/update/product/:id', async(req, res)=>{

        })


        // all delete operations
        app.delete('/delete/product/:id', async(req, res)=>{
            const id = req.params.id
            const filter = {_id :new ObjectId(id)}
            const result = productCollection.deleteOne(filter)
            res.send(result)
        })

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('server is running')
})

app.listen(port, () => {
    console.log(`server is running ${port}`);
})