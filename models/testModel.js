import mongoose from 'mongoose';

const testSchema = new mongoose.Schema({
    numberOfQuestions:{
        type:Number,
        default:10,
        required:true
    },
    questionIds:{
        type:[mongoose.ObjectId],
        required:true
    },
    correctAnswers:{
        type:[Number],
        required:true
    },
    selectedAnswers:{
        type:[Number],
        required:true
    },
    correct:{
        type:Number,
        required:true
    },
    wrong:{
        type:Number,
        required:true
    },
    unanswered:{
        type:Number,
        required:true
    },

})

export default mongoose.model("test",testSchema,"tests")