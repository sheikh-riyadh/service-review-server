const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000
require('dotenv').config()

/* Middleware */
app.use(cors())
app.use(express.json())

/* Connect with mongodb */
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.wjboujk.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



const run = async () => {
    try {
        const serviceCollection = client.db('photographyReview').collection('services')
        const reviewCollection = client.db('photographyReview').collection('reviews')
        const blogCollection = client.db('photographyReview').collection('blogs')

        /* Get data from mongodb */
        app.get('/limit-services', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query)
            const limitServices = await cursor.limit(3).toArray()
            res.send(limitServices)

        })
        app.get('/services', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query)
            const allServices = await cursor.toArray()
            res.send(allServices)
        })
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const service = await serviceCollection.findOne(query)
            res.send(service)
        })
        app.get('/reviews', async (req, res) => {
            let query = {}
            if (req.query.email) {
                query = {
                    reviewerEmail: req.query.email
                }
                const cursor = reviewCollection.find(query)
                const reviews = await cursor.toArray()
                res.send(reviews)
            }
        })
        app.get('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { reviewId: id }
            const cursor = reviewCollection.find(query)
            const reviews = await cursor.toArray()
            res.send(reviews)
        })

        app.post('/reviews', async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review)
            res.send(result)
        })

        app.post('/add-service', async (req, res) => {
            const service = req.body;
            const result = await serviceCollection.insertOne(service);
            res.send(result)
        })

        app.delete('/delete/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await reviewCollection.deleteOne(query)
            res.send(result)
        })
        app.get('/blogs', async (req, res) => {
            const query = {}
            const cursor = blogCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })
        app.get('/blogs/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await blogCollection.findOne(query)
            res.send(result)
        })
    }
    finally {

    }
}


run().catch(error => console.error(error))


app.get('/', (req, res) => {
    res.send('Hey developer i am calling from review server (: ')
})

app.listen(port, () => {
    console.log('Server running on this port', port)
})