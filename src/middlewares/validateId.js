import mongoose from "mongoose";


const validateId = (req, res, next) => {
    const id = req.params.id;
    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            status: 400,
            message: "Invalid Id"
        })
    }
    next();
}

export { validateId };