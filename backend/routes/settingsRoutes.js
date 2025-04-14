const express = require('express');
const bcrypt = require('bcrypt');
const { protect } = require("../middleware/authMiddleware");
const Admin = require("../models/Admin");
const { ROLES } = require("../utils/constant");

const router = express.Router();

// Change Username Route
router.put('/change-username', protect, async (req, res) => {
    if (req.role !== ROLES.admin) {
        return res.status(401).json({ message: 'Access Denied' });
    }

    try {
        const { previousUsername, newUsername } = req.body;

        if (!newUsername) {
            return res.status(400).json({ success: false, message: 'New username is required' });
        }

        const user = await Admin.findOneAndUpdate(
            { username: previousUsername },
            { username: newUsername },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ success: false, message: 'Username does not exist' });
        }

        return res.status(200).json({
            success: true,
            message: `Username updated successfully`,
            user: {
                username: user.username,
                role: user.role
            }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Change Password Route
router.put('/change-password', protect, async (req, res) => {
    if (req.role !== ROLES.admin) {
        return res.status(401).json({ message: 'Access Denied' });
    }

    try {
        const { username, previousPassword, newPassword } = req.body;

        if (!previousPassword || !newPassword) {
            return res.status(400).json({ success: false, message: 'Previous and new password are required' });
        }

        const user = await Admin.findOne({ username });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(previousPassword, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({
                success: false,
                message: 'Previous password is incorrect'
            });
        }

        const securePassword = await bcrypt.hash(newPassword, 10);
        user.password = securePassword;
        await user.save();

        return res.status(200).json({
            success: true,
            message: 'Password changed successfully',
            user: {
                username: user.username,
                role: user.role
            }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;
