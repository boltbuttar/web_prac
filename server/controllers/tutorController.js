const mongoose = require('mongoose');
const User = require('../models/User');
const Tutor = require('../models/Tutor');
const Session = require('../models/Session');
const { calculateEarnings } = require('../utils/earnings');

// Get tutor profile
exports.getTutorProfile = async (req, res) => {
  try {
    let tutor = await Tutor.findOne({ user: req.user._id })
      .select('-password')
      .populate('user', 'firstName lastName email phone city');

    if (!tutor) {
      // Create tutor profile if it doesn't exist
      tutor = new Tutor({
        user: req.user._id,
        subjects: req.user.subjects,
        hourlyRate: req.user.hourlyRate,
        education: req.user.education,
        experience: req.user.experience,
        bio: req.user.bio,
        availability: req.user.availability,
        teachingPreferences: req.user.teachingPreferences
      });
      await tutor.save();
      tutor = await Tutor.findById(tutor._id)
        .select('-password')
        .populate('user', 'firstName lastName email phone city');
    }

    res.json({
      success: true,
      data: tutor
    });
  } catch (error) {
    console.error('Error fetching tutor profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching tutor profile'
    });
  }
};

// Update tutor profile
exports.updateTutorProfile = async (req, res) => {
  try {
    const {
      education,
      experience,
      bio,
      subjects,
      hourlyRate,
      availability,
      teachingPreferences
    } = req.body;

    // Find tutor by user ID
    const tutor = await Tutor.findOne({ user: req.user._id });
    if (!tutor) {
      return res.status(404).json({
        success: false,
        message: 'Tutor not found'
      });
    }

    // Update profile fields
    tutor.education = education;
    tutor.experience = experience;
    tutor.bio = bio;
    tutor.subjects = subjects;
    tutor.hourlyRate = hourlyRate;
    tutor.availability = availability;
    tutor.teachingPreferences = teachingPreferences;

    // Save the updated tutor profile
    await tutor.save();

    // Update user's hourly rate
    await User.findByIdAndUpdate(req.user._id, { hourlyRate });

    // Fetch the updated tutor profile with populated user data
    const updatedTutor = await Tutor.findById(tutor._id)
      .populate('user', 'firstName lastName email phone city');

    res.json({
      success: true,
      data: updatedTutor
    });
  } catch (error) {
    console.error('Error updating tutor profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating tutor profile',
      error: error.message
    });
  }
};

// Update profile picture
exports.updateProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const tutor = await Tutor.findById(req.user._id);
    if (!tutor) {
      return res.status(404).json({
        success: false,
        message: 'Tutor not found'
      });
    }

    // Update profile picture path
    tutor.profilePicture = `/uploads/profiles/${req.file.filename}`;
    await tutor.save();

    res.json({
      success: true,
      data: {
        profilePicture: tutor.profilePicture
      }
    });
  } catch (error) {
    console.error('Error updating profile picture:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile picture'
    });
  }
};

// Get tutor sessions
exports.getTutorSessions = async (req, res) => {
  try {
    const sessions = await Session.find({ tutor: req.user._id })
      .populate('student', 'firstName lastName email')
      .sort({ date: 1 });

    res.json({
      success: true,
      data: sessions
    });
  } catch (error) {
    console.error('Error fetching tutor sessions:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching tutor sessions'
    });
  }
};

// Update session status
exports.updateSessionStatus = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { status } = req.body;

    const session = await Session.findOne({
      _id: sessionId,
      tutor: req.user._id
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    session.status = status;
    await session.save();

    res.json({
      success: true,
      data: session
    });
  } catch (error) {
    console.error('Error updating session status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating session status'
    });
  }
};

// Get tutor earnings
exports.getTutorEarnings = async (req, res) => {
  try {
    const sessions = await Session.find({
      tutor: req.user._id,
      status: 'completed'
    });

    const earnings = calculateEarnings(sessions);

    res.json({
      success: true,
      data: earnings
    });
  } catch (error) {
    console.error('Error fetching tutor earnings:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching tutor earnings'
    });
  }
};

// Get earnings summary
exports.getEarningsSummary = async (req, res) => {
  try {
    const sessions = await Session.find({
      tutor: req.user._id,
      status: 'completed'
    });

    const summary = {
      total: 0,
      weekly: 0,
      monthly: 0,
      bySubject: {}
    };

    const now = new Date();
    const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    sessions.forEach(session => {
      const amount = session.duration * session.hourlyRate;
      summary.total += amount;

      if (session.date >= weekStart) {
        summary.weekly += amount;
      }

      if (session.date >= monthStart) {
        summary.monthly += amount;
      }

      // Group by subject
      if (!summary.bySubject[session.subject]) {
        summary.bySubject[session.subject] = 0;
      }
      summary.bySubject[session.subject] += amount;
    });

    res.json({
      success: true,
      data: summary
    });
  } catch (error) {
    console.error('Error fetching earnings summary:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching earnings summary'
    });
  }
};

// Get tutor dashboard data
exports.getDashboardData = async (req, res) => {
  try {
    // Get or create tutor profile
    let tutorProfile = await Tutor.findOne({ user: req.user._id })
      .populate('user', 'firstName lastName email phone city');

    if (!tutorProfile) {
      // Create tutor profile if it doesn't exist
      tutorProfile = new Tutor({
        user: req.user._id,
        subjects: req.user.subjects,
        hourlyRate: req.user.hourlyRate,
        education: req.user.education,
        experience: req.user.experience,
        bio: req.user.bio,
        availability: req.user.availability,
        teachingPreferences: req.user.teachingPreferences
      });
      await tutorProfile.save();
      tutorProfile = await Tutor.findById(tutorProfile._id)
        .populate('user', 'firstName lastName email phone city');
    }

    // Get upcoming sessions
    const upcomingSessions = await Session.find({
      tutor: req.user._id,
      status: { $in: ['pending', 'confirmed'] },
      date: { $gte: new Date() }
    })
    .sort({ date: 1 })
    .limit(5);

    // Get recent completed sessions
    const completedSessions = await Session.find({
      tutor: req.user._id,
      status: 'completed'
    })
    .sort({ date: -1 })
    .limit(5);

    // Calculate earnings statistics
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    const monthlyEarnings = await Session.aggregate([
      {
        $match: {
          tutor: req.user._id,
          status: 'completed',
          $expr: {
            $and: [
              { $eq: [{ $month: '$date' }, currentMonth] },
              { $eq: [{ $year: '$date' }, currentYear] }
            ]
          }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: { $multiply: ['$price', '$duration'] } }
        }
      }
    ]);

    // Get session statistics
    const sessionStats = {
      pending: await Session.countDocuments({ tutor: req.user._id, status: 'pending' }),
      confirmed: await Session.countDocuments({ tutor: req.user._id, status: 'confirmed' }),
      completed: await Session.countDocuments({ tutor: req.user._id, status: 'completed' })
    };

    res.json({
      success: true,
      data: {
        profile: tutorProfile,
        upcomingSessions,
        completedSessions,
        monthlyEarnings: monthlyEarnings[0]?.total || 0,
        totalEarnings: tutorProfile.totalEarnings,
        sessionStats,
        rating: tutorProfile.rating,
        totalReviews: tutorProfile.totalReviews
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard data',
      error: error.message
    });
  }
};

// Update tutor profile
exports.updateProfile = async (req, res) => {
  try {
    const {
      subjects,
      hourlyRate,
      education,
      experience,
      bio,
      availability
    } = req.body;

    const tutorProfile = await Tutor.findOneAndUpdate(
      { user: req.user._id },
      {
        subjects,
        hourlyRate,
        education,
        experience,
        bio,
        availability
      },
      { new: true }
    ).populate('user', 'firstName lastName email phone city');

    if (!tutorProfile) {
      return res.status(404).json({
        success: false,
        message: 'Tutor profile not found'
      });
    }

    // Update user's hourly rate
    await User.findByIdAndUpdate(req.user._id, { hourlyRate });

    res.json({
      success: true,
      data: tutorProfile
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message
    });
  }
};

// Get tutor sessions
exports.getSessions = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const query = { tutor: req.user._id };
    if (status) {
      query.status = status;
    }

    const sessions = await Session.find(query)
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Session.countDocuments(query);

    res.json({
      success: true,
      data: {
        sessions,
        total,
        page: parseInt(page),
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching sessions',
      error: error.message
    });
  }
};

// Get all available tutors
exports.getAvailableTutors = async (req, res) => {
  try {
    console.log('Fetching all tutors...');
    
    // First, get all users with role 'tutor'
    const tutorUsers = await User.find({ role: 'tutor' });
    console.log(`Found ${tutorUsers.length} tutor users`);

    // Then find all active tutors
    const tutors = await Tutor.find({ isActive: true });
    console.log(`Found ${tutors.length} active tutors`);

    // Create a map of user IDs to user data for quick lookup
    const userMap = new Map(tutorUsers.map(user => [user._id.toString(), user]));
    
    // Transform the data to match the expected format
    const transformedTutors = tutors.map(tutor => {
      const user = userMap.get(tutor.user.toString());
      if (!user) {
        console.log(`Warning: No user found for tutor ${tutor._id}`);
        return null;
      }

      return {
        _id: tutor._id,
        user: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          city: user.city,
          profilePicture: user.profilePicture
        },
        subjects: tutor.subjects || user.subjects,
        hourlyRate: tutor.hourlyRate || user.hourlyRate,
        education: tutor.education || user.education,
        experience: tutor.experience || user.experience,
        bio: tutor.bio || user.bio,
        availability: tutor.availability || user.availability,
        teachingPreferences: tutor.teachingPreferences || user.teachingPreferences,
        rating: tutor.rating || 0,
        totalReviews: tutor.totalReviews || 0,
        totalSessions: tutor.totalSessions || 0,
        totalEarnings: tutor.totalEarnings || 0,
        profilePicture: tutor.profilePicture || user.profilePicture
      };
    }).filter(tutor => tutor !== null); // Remove any tutors with missing user data

    console.log(`Successfully transformed ${transformedTutors.length} tutors`);
    
    if (transformedTutors.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No active tutors found in the system'
      });
    }

    res.json({
      success: true,
      data: transformedTutors
    });
  } catch (error) {
    console.error('Error fetching tutors:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching tutors',
      error: error.message
    });
  }
};

// Get tutor by ID
exports.getTutorById = async (req, res) => {
  try {
    const tutor = await Tutor.findOne({ 
      _id: req.params.id,
      isActive: true
    }).populate('user', 'firstName lastName email phone city profilePicture');

    if (!tutor) {
      return res.status(404).json({
        success: false,
        message: 'Tutor not found'
      });
    }

    // Transform the data to match the expected format
    const transformedTutor = {
      _id: tutor._id,
      user: tutor.user,
      subjects: tutor.subjects,
      hourlyRate: tutor.hourlyRate,
      education: tutor.education,
      experience: tutor.experience,
      bio: tutor.bio,
      availability: tutor.availability,
      teachingPreferences: tutor.teachingPreferences,
      rating: tutor.rating,
      totalReviews: tutor.totalReviews,
      totalSessions: tutor.totalSessions,
      totalEarnings: tutor.totalEarnings,
      profilePicture: tutor.profilePicture
    };

    res.json({
      success: true,
      data: transformedTutor
    });
  } catch (error) {
    console.error('Error fetching tutor:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching tutor',
      error: error.message
    });
  }
}; 