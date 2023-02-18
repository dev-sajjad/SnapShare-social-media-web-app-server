import mongoose from "mongoose";
import PostMessage from "../models/postMessage.js";

// get all posts
export const getPosts = async (req, res) => {
    const { page} = req.query;

    try {
        const LIMIT = 12;
        const startIndex = (Number(page) - 1) * LIMIT; // get the starting index of every post
        const total = await PostMessage.countDocuments({}); // get the total number of posts
        
        const posts = await PostMessage.find().sort({ _id: -1 }).skip(startIndex).limit(LIMIT); // get the posts
        
       res.status(200).json({data: posts, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT)});

   } catch (error) {
        res.status(404).json({ message: error.message})
   }
}

export const getPost = async (req, res) => {
    const { id } = req.params;
    try {
        const post = await PostMessage.findById(id);
        res.status(200).json(post);
    } catch (error) {
        res.status(404).json({ message: error.message})
    }
}

export const getPostsBySearch = async (req, res) => {
    const { searchQuery, tags } = req.query;
   
    try {
        const title = new RegExp(searchQuery, "i");
        const posts = await PostMessage.find({
            $or: [
                { title: title },
                { tags: { $in: tags.split(',') } },
            ]
        });

        res.status(200).json( posts)
    } catch (error) {
        res.status(404).json({ message: error.message})
    }
}

// create a post
export const createPost = async(req, res) => {
    const post = req.body;

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

// comment on a post
export const commentPost = async (req, res) => {
    const { id } = req.params;
    const { value } = req.body;
    try {
        const post = await PostMessage.findById(id);
        post.comments.push(value);
        const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true });

        res.status(201).json(updatedPost);

    } catch (error) {
        res.status(404).json({ message: error.message})        
    }
}
