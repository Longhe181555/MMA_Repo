const postModel = require("../models/postModel");

//create post
const createPostController = async (req, res) => {
    try {
        const { title, description } = req.body;
        //validate
        if (!title || !description) {
            return res.status(400).send({
                success: false,
                message: "Title and description are required",
            });
        }
        // Check authentication
        if (!req.auth || !req.auth._id) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: User not logged in",
            });
        }
        const post = await postModel({
            title,
            description,
            postedBy: req.auth._id,
        }).save();
        res.status(201).send({
            success: true,
            message: "Post created successfully",
            post,
        });
        console.log(req.body);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Internal Server Error api",
            error,
        });
    }
};

//get all posts
const getAllPostsController = async (req, res) => {
    try {
        const posts = await postModel
            .find()
            .populate("postedBy", "_id name email")
            .sort({ createdAt: -1 });
        res.status(200).send({
            success: true,
            message: "Posts fetched successfully",
            posts,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Internal Server Error API",
            error,
        });
    }
};

const updatePostController = async (req, res) => {
    try {
        const { name, password, email } = req.body;
        //user find
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "User not found",
            });
        }
        //password validation
        if (password && password.length < 6) {
            return res.status(400).send({
                success: false,
                message: "Password should be 6 characters long",
            });
        }
        const hashedPassword = password
            ? await hashPassword(password)
            : undefined;
        //update user
        const updateUser = await userModel.findOneAndUpdate(
            { email },
            {
                name: name || user.name,
                password: hashedPassword || user.password,
            },
            { new: true }
        );
        updateUser.password = undefined;
        res.status(200).send({
            success: true,
            message: "Profile updated Please Login",
            updateUser,
        });
    } catch (error) {
        console.log("error: " + error);
        return res.status(500).send({
            success: false,
            message: "Internal Server Error Update",
            error,
        });
    }
};
module.exports = {
    createPostController,
    updatePostController,
    getAllPostsController,
};
