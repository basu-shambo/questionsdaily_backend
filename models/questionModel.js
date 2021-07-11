import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
    question : {
        type:String,
        required: true
    },
    options : {
        type:[String],
        required:true
    },
    answer : {
        type:String,
        required:true
    },
    topic : {
        type:String,
    },
    category: {
        type:String
    }
});

export default mongoose.model("question",questionSchema,"questions")