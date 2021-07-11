import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser  from 'body-parser';
import dotenv from 'dotenv';


import testRouter from './routes/testRoute.js'


const app = express();
dotenv.config()

app.use(bodyParser.json({limit:"30mb" ,extended: true}));
app.use(bodyParser.urlencoded({limit:"30mb" ,extended: true}));
app.use(cors()); 

app.use('/test',testRouter)

const PORT = process.env.PORT || 5000
const CONNECTION_URL = process.env.CONNECTION_URL

mongoose.connect(CONNECTION_URL,{useNewUrlParser: true,useUnifiedTopology:true})
.then(()=>{
    console.log(mongoose.connection.readyState===1?'connected to mongodb':'not connected to mongodb ');

    app.listen(PORT,()=>{
        console.log(`server running on ${PORT}`)
    })
}).catch((err)=>{
    console.log(error)
})

mongoose.set('useFindAndModify',false) 