import mongoose from 'mongoose';

const testSchema = new mongoose.Schema({
    user:{
        type:mongoose.ObjectId,
        required:true
    },
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
    date:{
        type:Date,
        default:Date.now()
    }

})

export default mongoose.model("test",testSchema,"tests")