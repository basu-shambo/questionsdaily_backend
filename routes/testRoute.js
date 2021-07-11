import express from 'express'
import { getTest,evaluate } from '../controllers/testController.js';


const testRouter = express.Router()

testRouter.get('/',getTest)
testRouter.post('/submit',evaluate)
export default testRouter;