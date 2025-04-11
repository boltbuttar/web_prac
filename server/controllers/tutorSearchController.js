const TutorSearch = require('../models/TutorSearch');
const Tutor = require('../models/Tutor');

// Save search results
exports.saveSearchResults = async (req, res) => {
  try {
    const { searchFilters, results } = req.body;
    const studentId = req.user._id;

    const tutorSearch = new TutorSearch({
      student: studentId,
      searchFilters,
      results: results.map(tutorId => ({ tutor: tutorId }))
    });

    await tutorSearch.save();

    res.json({
      success: true,
      message: 'Search results saved successfully',
      data: tutorSearch
    });
  } catch (error) {
    console.error('Error saving search results:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving search results',
      error: error.message
    });
  }
};

// Get student's search history
exports.getSearchHistory = async (req, res) => {
  try {
    const studentId = req.user._id;
    const searchHistory = await TutorSearch.find({ student: studentId })
      .sort({ createdAt: -1 })
      .populate('results.tutor', 'user subjects hourlyRate rating availability')
      .populate('results.tutor.user', 'firstName lastName city');

    res.json({
      success: true,
      data: searchHistory
    });
  } catch (error) {
    console.error('Error fetching search history:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching search history',
      error: error.message
    });
  }
};

// Get search results by ID
exports.getSearchResults = async (req, res) => {
  try {
    const searchId = req.params.id;
    const searchResults = await TutorSearch.findById(searchId)
      .populate('results.tutor', 'user subjects hourlyRate rating availability')
      .populate('results.tutor.user', 'firstName lastName city');

    if (!searchResults) {
      return res.status(404).json({
        success: false,
        message: 'Search results not found'
      });
    }

    res.json({
      success: true,
      data: searchResults
    });
  } catch (error) {
    console.error('Error fetching search results:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching search results',
      error: error.message
    });
  }
}; 