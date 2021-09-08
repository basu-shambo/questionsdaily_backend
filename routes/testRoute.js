import express from 'express';
import { getTest,evaluate } from '../controllers/testController.js';
import authVerification from '../middleware/authVerification.js';

const testRouter = express.Router();

testRouter.get('/',authVerification,getTest);
testRouter.post('/submit',evaluate);

export default testRouter;