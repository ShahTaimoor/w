const express = require('express')
const User = require('../models/User')
const Admin = require('../models/Admin')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')


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

        user = new User({ name, email, password: hashedPassword })

        await user.save()


        res.status(201).json({
            success: true,
            message: 'User created successfully'
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


        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '40h' })
        return res.status(200).json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            token
        })
    } catch (error) {
        console.log(error);
        res.status(500).send('Server error in login')
    }
})


// @route GET /api/users/admin
// @desc GET logged-in users profile (Projected Route)
// @access Private 

router.post('/admin-signup', async (req, res) => {
    const { username, password, role } = req.body

    try {
        // Registration logic
        let user = await Admin.findOne({ username })
        if (user) {
            return res.status(400).json({ message: 'user alredy exist' })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        user = new Admin({ username, password: hashedPassword , role: 'admin' })

        await user.save()


        res.status(201).json({
            success: true,
            message: 'Admin User created successfully'
        })



    } catch (error) {
        console.log(error);
        res.status(500).send('Server error register')


    }
})


router.post('/admin-login', async (req, res) => {
    const { username, password } = req.body

    try {

        let admin = await Admin.findOne({ username })

        if (!admin) return res.status(400).json({ message: 'Invalid Credintials in login' })

        const comparePassword = await bcrypt.compare(password, admin.password)
        if (!comparePassword) {
            return res.status(400).json({ message: 'Invalid Credintials is match' })
        }


        const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: '40h' })
        return res.status(200).json({
            user: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role
            },
            token
        })
    } catch (error) {
        console.log(error);
        res.status(500).send('Server error in login')
    }
})


module.exports = router