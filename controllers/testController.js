
import questionModel from '../models/questionModel.js'
import testModel from '../models/testModel.js';
export const getTest = async(req,res)=>{
    try{
        const response = await questionModel.aggregate([{$sample:{size:10}}]);
        const test = response.map((q)=>{
            const {answer,...question}=q
            // console.log(answer)
            return question
        })
        res.status(200).json(test)
    }catch(err){
        console.log(err)
        res.status(404).json({message:err})
    }
}

export const evaluate = async(req,res)=>{
    const {numberOfQuestions,questionIds,answers,unanswered}= req.body;
    const correctAnswers = Array(numberOfQuestions).fill(10);
    const selectedAnswers = answers;
    let correct = 0;
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
    const wrong = numberOfQuestions-unanswered- correct;
    //send to the database - testSchema
    const test = new testModel({numberOfQuestions,questionIds,correctAnswers,selectedAnswers,correct,wrong,unanswered});
    try{
        const saveResponse = await test.save();
        //send to database - correct answers,correct,wrong,unanswered
        res.status(200).json({correctAnswers,correct,wrong,unanswered})
    }catch(error){
        console.log(error)
        res.status(400).json({error})
    }

}

