import jwt from 'jsonwebtoken';

const verify = async(req,res,next)=>{
    try {
        const token = req.headers.authorisation;
        let decodedData;
        if(token){
            decodedData = jwt.verify(token,process.env.TOKEN_SECRET);
            req._id = decodedData?._id;
        }
        next();
    } catch (error) {
        res.status(500).json({message:error});
    }
}

export default verify;