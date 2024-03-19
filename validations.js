//Validation data of entered data

import { body } from 'express-validator'

export const registerValidation = [
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Длмна пароля не менее 8 символов').isLength({min: 8}),
    body('fullName', 'Длмна имени не менее 3 символов').isLength({min: 3}),
    body('avatar', 'Неверная ссылка на изображение').optional().isURL()
]

export const loginValidation = [
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Длмна пароля не менее 8 символов').isLength({min: 8}),
]

export const postCreateValidation = [
    body('title', 'Введите заголовок статьи (минимум 3 символа)').isLength({min: 3}).isString(),
    body('text', 'Введите текст статьи (минимум 20 символов)').isLength({min: 20}).isString(),
    body('tags', 'Введите набор тэгов (массивом)').optional().isString(),
    body('imageURL', 'Неверная ссылка на изображение').optional().isString()
]
