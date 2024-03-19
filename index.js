import express from 'express'
import mongoose from 'mongoose'; //mongoose is a lib for work with mongo DB
import multer from 'multer' //multer is a lib for sending files to server
import { registerValidation, loginValidation, postCreateValidation } from './validations.js'
import { UserController, PostController } from './controllers/general.js'
import { checkAuth, errorsHandler } from "./utils/general.js";

import cors from 'cors'

//connect to DB
const url = 'mongodb+srv://romanzabolotskij:59zy92G6OXLMcnff@blogdb.iafsc3y.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(url)
    .then(() => console.log('connection to DB successfully'))
    .catch((err) => console.log('DB error', err));

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads')
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname)
    },
})

const upload = multer({storage}) //lib for uploading static files on server

const app = express(); //create empty express-app
app.use(express.json()); //connect json to express
app.use('/uploads', express.static('uploads')) //get req to take a static file
app.use(cors()) //allow to request from any domain to localhost
app.get('/', (req, res) => {
    res.json({
        msg: "hello"
    });
})

app.post('/auth/login', loginValidation, errorsHandler, UserController.login)
//after getting a request to auth/register we are checking fields in our validator and then perform request
app.post('/auth/register', registerValidation, errorsHandler, UserController.register)
//С помощью CheckAuth проверяем выполнять ли нам запрос. Запрос выполняется в случае прохождения проверки валидности токена.
app.get('/auth/person', checkAuth, UserController.getPerson)

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    try{
        res.json({
            url: `/uploads/${req.file.originalname}`
        })
    } catch (err) {
        res.json({
            msg: 'Ошибка',
            err: err
        })
    }
})

app.get('/tags', PostController.getLastTags)
app.get('/posts', PostController.getAll)
app.get('/posts/tags', PostController.getLastTags)
app.get('/posts/:id', PostController.getOne)
app.post('/posts', checkAuth, postCreateValidation, errorsHandler, PostController.create)
app.delete('/posts/:id', checkAuth, PostController.remove)
app.patch('/posts/:id', checkAuth, postCreateValidation, errorsHandler, PostController.update)

//start server on port 4444
app.listen(4444, (err) => {
    if(err) {
        console.log(err);
    }
    console.log("Status: 200. Server started");
});

