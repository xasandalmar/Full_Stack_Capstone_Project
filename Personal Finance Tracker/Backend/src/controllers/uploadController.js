import User from '../models/User.js';
import { uploadToCloudinary } from '../config/cloudinary.js';

export const uploadProfilePicture = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an image file to upload',
      });
    }

    // Upload memory buffer to Cloudinary
    const imageUrl = await uploadToCloudinary(req.file.buffer, 'finance_tracker_profiles');

    // Update user profile picture in database
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { profilePicture: imageUrl },
      { new: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      message: 'Profile picture updated successfully',
      profilePicture: imageUrl,
      user,
    });
  } catch (error) {
    next(error);
  }
};
