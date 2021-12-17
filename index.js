require('dotenv').config();
const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 5000;

const app = express();
app.use(cors()); //middleware
app.use(express.json());

const uri = `mongodb+srv://${process.env.REACT_APP_USERNAME}:${process.env.REACT_APP_PASSWORD}@cluster0.ce7h0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("nsu-haatbazar");
        const outletsCollection = database.collection("outlets");

        //Get Api for Outlets
        app.get('/outlets', async (req, res) => {
            const cursor = outletsCollection.find({});
            const outlets = await cursor.toArray();
            res.send(outlets);
        })

        //Single Get Api for Outlets
        app.get('/profile/:outletKey', async (req, res) => {
            const outletKey = req.params.outletKey;
            const query = { _id: ObjectId(outletKey) };
            const outlet = await outletsCollection.findOne(query);
            res.send(outlet);
        })

        //Update Api for views
        app.put('/view/:viewId', async(req, res) => {
            const viewId = req.params.viewId;
            const query = { _id: ObjectId(viewId) };
            
            const updatedOProject = req.body;
            let viewsCount = updatedOProject.views;
            let newViews = viewsCount+1;

            const updateDoc = {
                $set: {
                  views: newViews
                },
            };
            const result = await outletsCollection.updateOne(query, updateDoc);

            res.json(result);
        })

        //Update Api for orders
        app.put('/reaction/:reactId', async(req, res) => {
            const reactId = req.params.reactId;
            const query = { _id: ObjectId(reactId) };

            const updatedProject = req.body;
            let reactCount = updatedProject.react;
            let newReacts = reactCount+1;

            const updateDoc = {
                $set: {
                  react: newReacts
                },
            };
            const result = await outletsCollection.updateOne(query, updateDoc);

            res.json(result);
        })

    } finally {
    //   await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Server is loading!');
})

app.listen(port, () => console.log('Server is loading at port@5000'));