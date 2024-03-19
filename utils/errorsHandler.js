import {validationResult} from "express-validator";

export default (req, res, next) => {
    const errors = validationResult(req);
    //if validation is not successfully, return incorrect request (400) with all errors in array with comments from validation
    if(!errors.isEmpty()) {
        return res.status(400).json(errors.array());
    }

    next()
}