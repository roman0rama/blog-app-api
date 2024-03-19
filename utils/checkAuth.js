import jwt from 'jsonwebtoken'

export default (req, res, next) => {
    //с помощью регулярного выражения убираем слово Bearer из присланного токена
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
    console.log(token)
    if (token) {
        try {
            const decodedToken = jwt.verify(token, 'secret123')

            req.userId = decodedToken._id
            next();
        } catch (err) {
            return res.status(403).json({
                message: 'Нет доступа'
            });
        }
    } else {
        //если токен не передается, то возвращает сообщение об ошибке
        return res.status(403).json({
            message: 'Нет доступа'
        });
    }
}