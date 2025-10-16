const Story = require('../models/Story');

exports.createStory = async (req, res) => {
  try {
    const { mediaUrl, type, duration } = req.body;

    if (req.user.role !== 'candidate') {
      return res.status(403).json({
        success: false,
        message: 'Only candidates can create stories'
      });
    }

    const effectiveDuration = duration || 24 * 60 * 60 * 1000;

    const story = new Story({
      candidateId: req.user._id,
      mediaUrl,
      type: type || 'image',
      duration: effectiveDuration,
      expiresAt: new Date(Date.now() + effectiveDuration)
    });

    await story.save();
    await story.populate('candidateId', 'name profileImage');

    res.status(201).json({
      success: true,
      message: 'Story created successfully',
      data: { story }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating story',
      error: error.message
    });
  }
};

exports.getActiveStories = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const skip = (page - 1) * limit;

    const stories = await Story.find({
      expiresAt: { $gt: new Date() }
    })
      .populate('candidateId', 'name profileImage role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10));

    const storiesWithViewStatus = stories.map((story) => ({
      ...story.toObject(),
      viewed: story.views.some((viewId) => viewId.equals(req.user._id))
    }));

    res.json({
      success: true,
      data: { stories: storiesWithViewStatus }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching stories',
      error: error.message
    });
  }
};

exports.getCandidateStories = async (req, res) => {
  try {
    const stories = await Story.find({
      candidateId: req.params.candidateId,
      expiresAt: { $gt: new Date() }
    })
      .populate('candidateId', 'name profileImage role')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { stories }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching candidate stories',
      error: error.message
    });
  }
};

exports.viewStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);

    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found'
      });
    }

    if (story.expiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Story has expired'
      });
    }

    if (!story.views.some((viewId) => viewId.equals(req.user._id))) {
      story.views.push(req.user._id);
      await story.save();
    }

    res.json({
      success: true,
      message: 'Story viewed',
      data: { views: story.views.length }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error viewing story',
      error: error.message
    });
  }
};

exports.deleteStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);

    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found'
      });
    }

    if (!story.candidateId.equals(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this story'
      });
    }

    await story.deleteOne();

    res.json({
      success: true,
      message: 'Story deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting story',
      error: error.message
    });
  }
};
