import PostModel from '../models/Post.js'

export const getAll = async (req, res) => {
    try {
        const posts = await PostModel.find().populate('author').exec()
        res.json(posts)
    } catch (err) {
        res.status(500).json({
            message: "Не удалось получить список статей",
            error: err
        });
        console.log(err)
    }
}

export const getLastTags = async (req, res) => {
    try {
        const posts = await PostModel.find().limit(5).exec()
        const tags = posts
            .map((obj) => obj.tags)
            .flat()
            .slice(0, 5)
        res.json(tags)
    } catch (err) {
        res.status(500).json({
            message: "Не удалось получить список статей",
            error: err
        });
        console.log(err)
    }
}

export const getOne = async (req, res) => {
    try {
        const postId = req.params.id

        //Вытаскиваем статью по id, инкрементируем просмотры, возвращаем обновленный документ
        const post = await PostModel.findOneAndUpdate(
            {
                _id: postId
            }, {
                $inc: { viewCount: 1 }
            }, {
                returnDocument: 'after'
            }
        )
        res.json(post)
    } catch (err) {
        res.status(500).json({
            message: "Не удалось получить список статей",
            error: err
        });
        console.log(err)
    }
}

export const remove = async (req, res) => {
    try {
        const postId = req.params.id

        PostModel.findByIdAndRemove(
            {
                _id: postId
            }
        )
        res.json({
            success: true
        })
    } catch (err) {
        res.status(500).json({
            message: "Не удалось удалить статью",
            error: err
        });
        console.log(err)
    }
}

export const update = async (req, res) => {
    try {
        const postId = req.params.id

        PostModel.updateOne(
            {
                _id: postId
            }, {
                title: req.body.title,
                text: req.body.text,
                tags: req.body.tags,
                author: req.userId,
                imageURL: req.body.imageURL
            }
        )
        res.json({
            success: true
        })
    } catch (err) {
        res.status(500).json({
            message: "Не удалось обновить статью",
            error: err
        });
        console.log(err)
    }
}

export const create = async (req, res) => {
    try{
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            tags: req.body.tags,
            author: req.userId,
            imageURL: req.body.imageURL
        })

        const post = await doc.save()

        res.json(post)
    } catch (err) {
        res.status(500).json({
            message: "Не удалось создать статью",
            error: err
        });
        console.log(err)
    }
}