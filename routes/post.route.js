const { Router } = require("express");
const { PostModel } = require("../models/post.model");
const postRouter = Router();


postRouter.get("/", async (req, res) => {
  try {
    const { pageNo, limit, minComments, maxComments, device1, device2 } = req.query;
    const skip = (pageNo - 1) * limit;
    const { userID } = req.body;
    const query = {};

    if (userID) {
      query.userID = userID;
    }
    if (minComments && maxComments) {
      query.no_of_comments = { $gt: minComments, $lt: maxComments };
    }
    if (device1 && device2) {
      query.device = { $in: [device1, device2] };
    } else if (device1) {
      query.device = device1;
    } else if (device2) {
      query.device = device2;
    }


    const posts = await PostModel.find(query)
      .sort({ no_of_comments: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({ msg: "User Posts", posts });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

postRouter.get("/top", async (req, res) => {
  try {
    const { pageNo } = req.query;
    const limit = 3;
    const skip = (pageNo - 1) * limit;

    const topPosts = await PostModel.find()
      .sort({ no_of_comments: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({ msg: "Top Posts", topPosts });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

postRouter.post("/add", async (req, res) => {
  try {
    const { userID } = req.body;
    const post = new PostModel({ ...req.body, userID });
    await post.save();
    res.status(200).json({ msg: "Post was added" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

postRouter.patch("/update/:postID", async (req, res) => {
  try {
    const { postID } = req.params;
    const { userID } = req.body;

    const post = await PostModel.findOneAndUpdate(
      { _id: postID, userID },
      req.body,
      { new: true }
    );

    if (!post) {
      res.status(400).json({ msg: "Post not found" });
    } else {
      res.status(200).json({ msg: "Post updated" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

postRouter.delete("/delete/:postID", async (req, res) => {
  try {
    const { postID } = req.params;
    const { userID } = req.body;

    const post = await PostModel.findOneAndDelete({ _id: postID, userID });

    if (!post) {
      res.status(400).json({ msg: "Post not found" });
    } else {
      res.status(200).json({ msg: "Post deleted" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = { postRouter };
