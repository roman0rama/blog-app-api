import {validationResult} from "express-validator";
import bcrypt from "bcrypt";
import UserModel from "../models/User.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    try {
        const password = req.body.password;
        //salt is a crypt algorithm
        const salt = await bcrypt.genSalt(10);
        //crypt password
        const hash = await bcrypt.hash(password, salt);

        //make an user data for saving in DB
        const doc = new UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            userAvatar: req.body.userAvatar,
            passwordHash: hash
        });

        //saving data
        const user = await doc.save();

        const token = jwt.sign({
            _id: user._id
        }, 'secret123', {
            expiresIn: '30d'
        });

        const { passwordHash, ...userData } = user._doc;

        res.json({
            ...userData,
            token
        });
    } catch (err) {
        res.status(500).json({
            message: "Не удалось отправить запрос на регистрацию",
            error: err
        });
        console.log(err)
    }
}

export const getPerson = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId)

        if(!user) {
            return res.status(404).json({
                message: 'Пользователь не найден'
            })
        }

        const { passwordHash, ...userData } = user._doc;

        res.json({
            ...userData
        });
    } catch (err) {
        res.status(500).json({
            message: "Нет доступа"
        });
    }
}

export const login = async(req, res) => {
    try {
        //Ищем в базе данных пользователя по введённому email
        const user = await UserModel.findOne({ email: req.body.email });

        //Если пользователь не найден, возвращаем ошибку
        if(!user) {
            return res.status(404).json({
                message: 'Пользователь не найден.'
            });
        }

        //проверяем совпадение закодированных паролей
        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

        //если пароль неверный, возвращаем ошибку (не описывая суть проблемы для безопасности)
        if(!isValidPass) {
            return res.status(400).json({
                message: 'Неверный логин или пароль.'
            });
        }

        //формируем токен из _id по ключу secret123, действующий 30 дней
        const token = jwt.sign({
            _id: user._id
        }, 'secret123', {
            expiresIn: '30d'
        });

        //отделяем закодированный пароль от остальной информации о пользователе
        const { passwordHash, ...userData } = user._doc;

        //возвращаем информацию о пользователе и сгенерированный токен
        res.json({
            ...userData,
            token
        });
    } catch (err) {
        res.status(500).json({
            message: "Не удалось авторизоваться",
            error: err
        });
        console.log(err)
    }
}