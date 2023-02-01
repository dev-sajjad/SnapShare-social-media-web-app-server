import mongoose from "mongoose";
import PostMessage from "../models/postMessage.js";

// get all posts
export const getPosts = async(req, res) => {
   try {
       const postMessages = await PostMessage.find();
       res.status(200).json(postMessages);
   } catch (error) {
        res.status(404).json({ message: error.message})
   }
}

// create a post
export const createPost = async(req, res) => {
    const post = req.body;
    const newPost = new PostMessage(post);
    try {
        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        res.status(409).json({ message: error.message})
    }

}

// update a post
export const updatePost = async (req, res) => {
    const { id: _id } = req.params;
    const post = req.body;

    if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).json({ message: "Post not found" });

    try {
        const updatedPost = await PostMessage.findByIdAndUpdate(_id, post, { new: true })
        res.status(200).json(updatedPost);
    } catch (error) {
        res.status(404).json({ message: error.message})
    }

}