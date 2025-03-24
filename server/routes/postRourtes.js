const express = require('express');
const { requireSingIn } = require('../controllers/userController');
const { createPostController, updatePostController, getAllPostsController } = require('../controllers/postController');

//router object
const router = express.Router();

//create post 
router.post('/create-post', requireSingIn, createPostController);
//get all posts
router.get('/get-all-posts', getAllPostsController);
//update post 
router.post('/update-post', requireSingIn, updatePostController);


//export 
module.exports = router;