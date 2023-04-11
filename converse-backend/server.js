import express from 'express';
import mongoose from 'mongoose';
import Messages from './dbMessages.js'; 
import Pusher from 'pusher'
import cors from 'cors'

mongoose.set('strictQuery', false);

const app =express();
const port = process.env.PORT || 9000



const pusher = new Pusher({
    appId: "1525903",
    key: "769d30b01386a6c96157",
    secret: "948e4afb33263adab13d",
    cluster: "ap2",
    useTLS: true
  });

app.use(express.json())
app.use(cors())


const connection_url = 'mongodb+srv://admin:krbMXVVFPFhMIWZB@cluster0.brjkyhd.mongodb.net/?retryWrites=true&w=majority'
mongoose.connect(connection_url);

const db = mongoose.connection;
db.once('open', ()=>{
    console.log('DB Connected')

    const msgCollection = db.collection("messagecontents")
    const changeStream = msgCollection.watch();

    changeStream.on('change',(change) => {
        console.log("A change occurred",change); 

        if(change.operationType === 'insert'){
            const messageDetails = change.fullDocument;
            pusher.trigger('messages','inserted',
            {
                name: messageDetails.name,
                message: messageDetails.message,
                timestamp: messageDetails.timestamp,
                received: messageDetails.received
            })
        }else{
            console.log('Error triggering Pusher')
        }
    })
})


app.get('/',(req,res)=>res.status(200).send('Hello world'));

app.get('/messages/sync', (req, res) => {
    Messages.find((err,data) => {
        if(err){
            res.status(500).send(err);
        }
        else{
            res.status(200).send(data)
        }
    });
     
  });


app.post('/messages/new', (req, res) => {
    const dbMessage = req.body;
    
    Messages.create(dbMessage, (err,data) => {
        if(err){
            res.status(500).send(err);
        }
        else{
            res.status(201).send(data)
        }
    });
     
  });
  


app.listen(port,()=>console.log('Listening on localhost:',{port}))  