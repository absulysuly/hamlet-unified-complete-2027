const User = require('../models/User');
const Post = require('../models/Post');
const Story = require('../models/Story');

exports.getCandidates = async (req, res) => {
  try {
    const { page = 1, limit = 20, governorate, district } = req.query;
    const skip = (page - 1) * limit;

    const filter = { role: 'candidate' };

    if (governorate) filter['location.governorate'] = governorate;
    if (district) filter['location.district'] = district;

    const candidates = await User.find(filter)
      .select('name email profileImage location bio socialMedia')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10));

    const total = await User.countDocuments(filter);

    res.json({
      success: true,
      data: {
        candidates,
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
      message: 'Error fetching candidates',
      error: error.message
    });
  }
};

exports.getCandidate = async (req, res) => {
  try {
    const candidate = await User.findOne({
      _id: req.params.id,
      role: 'candidate'
    }).select('-password -email');

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: 'Candidate not found'
      });
    }

    const recentPosts = await Post.find({ authorId: req.params.id })
      .populate('authorId', 'name profileImage')
      .sort({ createdAt: -1 })
      .limit(10);

    const activeStories = await Story.find({
      candidateId: req.params.id,
      expiresAt: { $gt: new Date() }
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        candidate,
        recentPosts,
        activeStories
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching candidate',
      error: error.message
    });
  }
};

exports.searchCandidates = async (req, res) => {
  try {
    const { q, page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const searchFilter = {
      role: 'candidate',
      $or: [
        { 'name.ar': { $regex: q, $options: 'i' } },
        { 'name.en': { $regex: q, $options: 'i' } },
        { 'name.ku': { $regex: q, $options: 'i' } },
        { bio: { $regex: q, $options: 'i' } }
      ]
    };

    const candidates = await User.find(searchFilter)
      .select('name profileImage location bio')
      .skip(skip)
      .limit(parseInt(limit, 10));

    const total = await User.countDocuments(searchFilter);

    res.json({
      success: true,
      data: {
        candidates,
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
      message: 'Error searching candidates',
      error: error.message
    });
  }
};

exports.getCandidateStats = async (req, res) => {
  try {
    const candidateId = req.params.id;

    const [postCount, storyCount, likesAggregation] = await Promise.all([
      Post.countDocuments({ authorId: candidateId }),
      Story.countDocuments({ candidateId, expiresAt: { $gt: new Date() } }),
      Post.aggregate([
        { $match: { authorId: new User({ _id: candidateId })._id } },
        { $project: { likesCount: { $size: '$likes' } } },
        { $group: { _id: null, totalLikes: { $sum: '$likesCount' } } }
      ])
    ]);

    const totalLikes = likesAggregation[0]?.totalLikes || 0;

    res.json({
      success: true,
      data: {
        posts: postCount,
        activeStories: storyCount,
        totalLikes
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching candidate stats',
      error: error.message
    });
  }
};
