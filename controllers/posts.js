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
    console.log(post);

    const newPost = new PostMessage({...post, createdAt: new Date().toISOString()});
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

// delete a post
export const deletePost = async (req, res) => {
    const { id } = req.params;

    // check if _id exists
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ message: "Post not found" });

    try {
        await PostMessage.findByIdAndDelete(id);
        res.status(200).json({ message: "Post deleted" });
    } catch (error) {
        res.status(400).json({ message: error.message})
    }
}

// like a post
export const likePost = async (req, res) => {
    const { id } = req.params;
    // check if user is not authenticated
    if(!req.decoded.uid) return res.status(401).json({ message: "Unauthenticated user!" });

    // check if _id exists
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ message: "Post not found" });

    try {
        const post = await PostMessage.findById(id);
        // control if post is already liked
        const index = post.likes.findIndex((uid) => uid === req.decoded.uid);
        if (index === -1) {
            post.likes.push(req.decoded.uid);
        } else {
            post.likes= post.likes.filter((uid) => uid !== req.decoded.uid);
        }

        const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true });
        res.status(201).json(updatedPost);
    } catch (error) {
        res.json({ message: error.message})
    }
}

// unlike a post