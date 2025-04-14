const express = require('express')

const Checkout = require('../models/Checkout')
const Cart = require('../models/Cart')
const Product = require('../models/Product')
const Order = require('../models/Order')

const { protect } = require('../middleware/authMiddleware')
const router = express.Router()

// @route POST /api/checkout
// @desc Create a new checkout
// @access Private

router.post('/', protect, async (req, res) => {
    const { checkoutItems, shippingAddress, paymentMethod, totalPrice } = req.body

    if (!checkoutItems || checkoutItems.length === 0) {
        return res.status(400).json({ message: 'no items in checkout' })
    }

    try {
        // create a new checkout
        const newCheckout = await Checkout.create({
            user: req.user._id,
            checkoutItems: checkoutItems,
            shippingAddress,
            paymentMethod,
            totalPrice,
            paymentStatus: 'Pending',
            isPaid: false
        });
        console.log(`checkout created for user:${req.user._id}`);
        res.status(201).json(newCheckout)


    } catch (error) {
        console.error('Error creating checkout session', error);
        res.status(500).json({ message: 'Server Error' })
    }
})



// @route PUT /api/checkout/:id/pay
// @desc update a  checkout
// @access Private

router.put('/:id/pay', protect, async (req, res) => {
    const { paymentStatus, paymentDetails } = req.body;

    try {
        const checkout = await Checkout.findById(req.params.id);

        if (!checkout) {
            return res.status(404).json({ message: 'Checkout not found' });
        }

        if (paymentStatus === 'paid') {
            checkout.isPaid = true;  // Changed from false to true
            checkout.paymentStatus = paymentStatus;
            checkout.paymentDetails = paymentDetails;
            checkout.paidAt = Date.now();
            await checkout.save();

            res.status(200).json(checkout);
        } else {
            res.status(400).json({ message: 'Invalid Payment error' });
        }
    } catch (error) {
        console.error('Error updating checkout session:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});



// @route POST /api/checkout/:id/finalized
// @desc finalize a  checkout
// @access Private


router.post('/:id/finalize', protect, async (req, res) => {
    try {
        const checkout = await Checkout.findById(req.params.id)

        if (!checkout) {
            return res.status(404).json({ message: 'Checkout not found' })
        }

        // Allow finalization if paid OR if payment method is COD
        if ((checkout.isPaid || checkout.paymentMethod === 'COD') && !checkout.isFinalized) {
            const finalOrder = await Order.create({
                user: checkout.user,
                orderItems: checkout.checkoutItems,
                shippingAddress: checkout.shippingAddress,
                paymentMethod: checkout.paymentMethod,
                totalPrice: checkout.totalPrice,
                isPaid: checkout.paymentMethod === 'COD' ? false : checkout.isPaid,
                paidAt: checkout.paymentMethod === 'COD' ? null : checkout.paidAt,
                isDelivered: false,
                paymentStatus: checkout.paymentMethod === 'COD' ? 'Pending' : checkout.paymentStatus,
                paymentDetails: checkout.paymentDetails
            })

            checkout.isFinalized = true
            checkout.finalizedAt = Date.now()
            await checkout.save()
            await Cart.findOneAndDelete({ user: checkout.user })
            res.status(201).json(finalOrder)
        } else if (checkout.isFinalized) {
            res.status(400).json({ message: 'Checkout already finalized' })
        } else {
            res.status(400).json({ message: 'Checkout cannot be finalized' })
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' })
    }
})


module.exports = router