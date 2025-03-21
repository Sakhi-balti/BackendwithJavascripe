const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((error) =>
      next(error)
    );
  };
};

export { asyncHandler };
// const asyncHandler =(func)=>async()=>{
//     try {
//         await func(req,res,next);
//     } catch (error) {
//         res.satatus(error.code || 500).send(error.message);
//     }
// }
