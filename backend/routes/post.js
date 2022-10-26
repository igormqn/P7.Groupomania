const express = require('express');
const router = express.Router();

const postController = require('../controllers/post.controller');
const commentController = require('../controllers/comment.controller');

const likeController = require('../controllers/like.controller');

const auth = require('../middlewares/auth.middleware');
const multer = require('../middlewares/multer-config');

// Routes for post
router.post('/', auth, multer, postController.createPost);
router.get('/', auth, postController.getAllPosts);
router.get('/:id', auth, postController.getOnePost);
router.put('/:id', auth, multer, postController.modifyPost);
router.delete('/:id', auth, postController.deletePost);
router.delete('/admin/:id', auth, postController.deletePostByAdmin);

// Routes for comment
router.post('/:postId/comments', auth, commentController.createComment);
router.get('/:postId/comments', auth, commentController.getAllComments);
router.get('/:postId/comments/:id', auth, commentController.getOneComment);
router.put('/:postId/comments/:id', auth, commentController.modifyComment);
router.delete('/:postId/comments/:id', auth, commentController.deleteComment);
router.delete('/admin/:postId/comments/:id', auth, commentController.deleteCommentByAdmin);

// Routes for like
router.post('/:postId/like', auth, likeController.likePost);
router.get('/:postId/likes', auth, likeController.getAllLikesPost);
router.post('/:postId/unlike', auth, likeController.unlikePost);
module.exports = router;
