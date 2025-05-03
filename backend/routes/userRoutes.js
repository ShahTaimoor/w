const express = require('express')
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { isAuthorized, isAdmin } = require('../middleware/authMiddleware')


const router = express.Router()


// @route POST /api/users/register
// @desc Register a new user
// @access Public

router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body

    try {
        // Registration logic
        let user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({ message: 'user alredy exist' })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        user = User.create({ name, email, password: hashedPassword })


        res.status(201).json({
            success: true,
            message: 'User created successfully',
            user
        })



    } catch (error) {
        console.log(error);
        res.status(500).send('Server error register')


    }
})

// @route POST /api/users/login
// @desc Authenticate user
//  @access Public
router.post('/login', async (req, res) => {
    const { email, password } = req.body

    try {

        let user = await User.findOne({ email })

        if (!user) return res.status(400).json({ message: 'Invalid Credintials in login' })

        const comparePassword = await bcrypt.compare(password, user.password)
        if (!comparePassword) {
            return res.status(400).json({ message: 'email and password is incorrect' })
        }
        user.password = undefined

        // generating token 
        const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXP })

        return res.cookie('token', token, { httpOnly: true, secure: true })
            .status(200).json({
                success: true, user, token
            })
    } catch (error) {
        console.log(error);
        res.status(500).send('Server error in login')
    }
})

router.get('/logout', async (req, res) => {

    return res.cookie('token', "", { httpOnly: true, secure: true, expires: new Date(0) })
        .status(200).json({
            success: true,
        })
})

// @route GET /api/users/admin
// @desc GET logged-in users profile (Projected Route)
// @access Private 


router.get('/all-users', isAuthorized, isAdmin, async (req, res) => {

    try {

        let user = await User.find({}).select('-password')

        if (!user) return res.status(400).json({ message: 'Invalid Credintials in login' })


        return res
            .status(200).json({
                success: true, user, total: user.length
            })
    } catch (error) {
        console.log(error);
        res.status(500).send('Server error in login')
    }
})


module.exports = router