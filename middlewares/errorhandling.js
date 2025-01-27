


const notFound=(req,res,next)=>{
    const error=new Error(`NOT Found : ${req.originalurl}`);
    res.status(404);
    next(error);
}

const errorHandler=(err,req,res,next)=>{
    console.log(err);
 
    res.json({
        message:err?.message,
        stack:err?.stack
    
        
    })
}

module.exports={notFound,errorHandler};