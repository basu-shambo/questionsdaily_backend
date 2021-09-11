
import questionModel from '../models/questionModel.js'
import testModel from '../models/testModel.js';
export const getTest = async(req,res)=>{
    if(!req._id) return res.json({message:"user not authenticated"});
    try{
        const response = await questionModel.aggregate([{$sample:{size:10}}]);
        const test = response.map((q)=>{
            const {answer,...question}=q
            return question
        })
        res.status(200).json(test)
    }catch(err){
        console.log(error)
        res.status(404).json({error,message:"Cannot get test"});
    }
}

export const evaluate = async(req,res)=>{
    //getting the formdata
    const {numberOfQuestions,questionIds,answers,unanswered,user}= req.body;
    const correctAnswers = Array(numberOfQuestions).fill(10);
    const selectedAnswers = answers;
    let correct = 0;
    //getting the correct answers for the questions as ID and then getting the number of correct answers
    await Promise.all(questionIds.map(async (questionId,index)=>{
        const {options,answer} = await questionModel.findById(questionId)
        const cor = options.findIndex(e=>e===answer)+1;
        correctAnswers[index]=cor
        if(selectedAnswers[index]){
            if(selectedAnswers[index]===cor){
                correct+=1;
            }
        }
    }))
    //calculating the number of 
    const wrong = numberOfQuestions-unanswered- correct;
    //send to the database - testSchema
    const test = new testModel({numberOfQuestions,questionIds,correctAnswers,selectedAnswers,correct,wrong,unanswered,user});
    try{
        const saveResponse = await test.save();
        //send to database - correct answers,correct,wrong,unanswered
        res.status(200).json({correctAnswers,correct,wrong,unanswered})
    }catch(error){
        console.log(error)
        res.status(400).json({error,message:"Cannot evaluate the test"});
    }

}

