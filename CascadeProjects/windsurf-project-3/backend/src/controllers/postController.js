const Post = require('../models/Post');

exports.createPost = async (req, res) => {
  try {
    const {
      content,
      media,
      type,
      language,
      isPublic
    } = req.body;

    const post = new Post({
      authorId: req.user._id,
      content,
      media: media || [],
      type: type || 'text',
      language: language || req.user.language,
      isPublic: isPublic !== undefined ? isPublic : true
    });

    await post.save();
    await post.populate('authorId', 'name profileImage');

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: { post }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating post',
      error: error.message
    });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const { page = 1, limit = 20, language, authorId } = req.query;
    const skip = (page - 1) * limit;

    const filter = { isPublic: true };
    if (language) filter.language = language;
    if (authorId) filter.authorId = authorId;

    const posts = await Post.find(filter)
      .populate('authorId', 'name profileImage role')
      .populate('comments.userId', 'name profileImage')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10));

    const total = await Post.countDocuments(filter);

    res.json({
      success: true,
      data: {
        posts,
        pagination: {
          current: parseInt(page, 10),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching posts',
      error: error.message
    });
  }
};

exports.getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('authorId', 'name profileImage role')
      .populate('comments.userId', 'name profileImage');

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    res.json({
      success: true,
      data: { post }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching post',
      error: error.message
    });
  }
};

exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    const likeIndex = post.likes.findIndex((like) => like.equals(req.user._id));
    if (likeIndex > -1) {
      post.likes.splice(likeIndex, 1);
    } else {
      post.likes.push(req.user._id);
    }

    await post.save();

    res.json({
      success: true,
      message: likeIndex > -1 ? 'Post unliked' : 'Post liked',
      data: { likes: post.likes.length }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating like',
      error: error.message
    });
  }
};

exports.commentOnPost = async (req, res) => {
  try {
    const { text } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    post.comments.push({
      userId: req.user._id,
      text
    });

    await post.save();
    await post.populate('comments.userId', 'name profileImage');

    const newComment = post.comments[post.comments.length - 1];

    res.json({
      success: true,
      message: 'Comment added successfully',
      data: { comment: newComment }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding comment',
      error: error.message
    });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    if (!post.authorId.equals(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this post'
      });
    }

    await post.deleteOne();

    res.json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting post',
      error: error.message
    });
  }
};
