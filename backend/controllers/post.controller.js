const dotenv = require('dotenv');
const Post = require('../models').Post;
const User = require('../models').User;
const Like = require('../models').Like;
const fs = require('fs');

dotenv.config();

// Display all post
exports.getAllPosts = (req, res) => {
    console.log('oui');
    Post.findAll({
            order: [
                [ 'updatedAt', 'DESC']
            ],
            include: [{
                model: User
            }, {
                model: Like
            }]
        })
        .then(posts => res.status(200).json(posts))
        .catch(error => res.status(400).json({ message: 'Sorry,Can not display the post', error }));
}

// Afficher un post
exports.getOnePost = (req, res) => {
    const id = req.params.id;

    Post.findOne({
            where: {
                id: id
            },
            include: {
                model: User
            }
        })
        .then(post => res.status(200).json(post))
        .catch(error => res.status(400).json({ message: 'Sorry,Can not display the post', error }));
};

// Ajouter un nouveau post
exports.createPost = (req, res) => {
    console.log(req.file.filename, 'req.file');
    const post = {
        title: req.body.title,
        content: req.body.content,
        imageUrl: req.file ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}` : null,
        userId: req.body.userId
    };

    Post.create(post)
        .then(() => res.status(201).json({
            message: 'Post créé avec succès'}))
        .catch(error => res.status(400).json({ message: 'Sorry,Can not display the post', error }));
};

// Modifier un post
exports.modifyPost = (req, res) => {
    const id = req.params.id;
    const userId = req.body.userId

    let updatedPost = {
        title: req.body.title,
        content: req.body.content
    }

    if (req.file) {
        updatedPost["imageUrl"] = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    }

    Post.update(updatedPost, {
            where: {
                id: id,
                userId: userId
            }
        })
        .then(() => res.status(200).json({ message: 'Success upgrading the post' }))
        .catch(error => res.status(400).json({ message: 'Sorry, Can not display the post', error }));
}

// Supprimer un post par l'utilisateur
exports.deletePost = (req, res) => {
    const id = req.params.id;
    const userId = req.body.userId;

    Post.findOne({
            where: {
                id: id
            }
        })
        .then(post => {
            // Si le post a une image, supprimer l'image du dossier '/images' et supprimer le post
            // Sinon supprimer le post directement
            if (post.imageUrl) {
                const filename = post.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Post.destroy({
                            where: {
                                id: id,
                                userId: userId
                            }
                        })
                        .then(() => res.status(200).json({ message: 'Post deleted with success' }))
                        .catch(error => res.status(400).json({ message: 'Post deleted by mistakes', error }));
                })
            } else {
                Post.destroy({
                        where: {
                            id: id,
                            userId: userId
                        }
                    })
                    .then(() => res.status(200).json({
                        message: 'Post deleted with success'
                    }))
                    .catch(error => res.status(400).json({ message: 'Can not deleted the post', error }));
            }
        })
        .catch(error => res.status(500).json({
            error
        }))
}

// Delete a post
exports.deletePostByAdmin = (req, res) => {
    const id = req.params.id;

    Post.findOne({
            where: {
                id: id
            }
        })
        .then(post => {
            if (post.imageUrl) {
                const filename = post.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Post.destroy({
                            where: {
                                id: id
                            }
                        })
                        .then(() => res.status(200).json({ message: 'Post Deleted' }))
                        .catch(error => res.status(400).json({ message: 'Can not deleted the post', error }));
                })
            } else {
                Post.destroy({
                        where: {
                            id: id
                        }
                    })
                    .then(() => res.status(200).json({ message: 'Post Deleted with sucess' }))
                    .catch(error => res.status(400).json({ message: 'Can not delete the post', error }));
            }
        })
        .catch(error => res.status(500).json({ error }));
}
