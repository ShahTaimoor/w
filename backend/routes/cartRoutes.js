const express = require('express')
const Cart = require('../models/Cart')
const Product = require('../models/Product')


const router = express.Router()

<<<<<<< HEAD
// Helper function to get a cart by user Id or guest Id
=======
// Helper function to get a cart by user Id or guest 
>>>>>>> fb2e911b0f8a9fc050f3f6a9b045faf3b37004e0

const getCart = async (userId, guestId) => {
    if (userId) {
        return await Cart.findOne({ user: userId })
    } else if (guestId) {
        return await Cart.findOne({ guestId })
    }
    return null
}



router.post('/', async (req, res) => {
    const { productId, quantity, size, color, guestId, userId } = req.body
    try {
        const product = await Product.findById(productId)
        if (!product) return res.status(404).json({ message: 'Product not found' })

        // determine if the user is logged in or guest

        let cart = await (getCart(userId, guestId))

        // if the cart exists

        if (cart) {
            const productIndex = cart.products.findIndex(
                (p) =>
                    p.productId.toString() === productId && p.size === size && p.color === color
            )

            if (productIndex > -1) {
                // if the product already exists update the quantity
                cart.products[productIndex].quantity += quantity
            } else {
                // add new product
                cart.products.push({
                    productId,
                    name: product.name,
                    image: product.images[0].url,
                    price: product.price,
                    size,
                    color,
                    quantity,
                })
            }

            //  Recalculate the total price
            cart.totalPrice = cart.products.reduce((acc, item) => acc + item.price * item.quantity, 0)
            await cart.save()
            return res.status(200).json(cart)
        } else {
            // Create a new cart for the guest and user
            const newCart = await Cart.create({
                user: userId ? userId : undefined,
                guestId: guestId ? guestId : 'guest_' + new Date().getTime(),
                products: [
                    {
                        productId,
                        name: product.name,
                        image: product.images[0].url,
                        price: product.price,
                        size,
                        color,
                        quantity,
                    },
                ],
                totalPrice: product.price * quantity
            });
            return res.status(201).json(newCart)
        }


    } catch (error) {
        console.error(error)
        res.status(500).send('Server error in add to cart Product')
    }

})


// @route PUT /api/cart
// @desc update a product to the cart for a guest or logged in user
// @access Public

router.put('/', async (req, res) => {
    const { productId, quantity, size, color, guestId, userId } = req.body

    try {
        let cart = await getCart(userId, guestId)
        if (!cart) return res.status(404).json({ message: 'Cart not found' })

        const productIndex = cart.products.findIndex((p) => p.productId.toString() === productId && p.size === size && p.color === color)

        if (productIndex > -1) {
            // update quantity
            if (quantity > 0) {
                cart.products[productIndex].quantity = quantity

            } else {
                cart.products.splice(productIndex, 1) // Remove the product
            }

            cart.totalPrice = cart.products.reduce((acc, item) => acc + item.price * item.quantity, 0)

            await cart.save()
            return res.status(200).json(cart)

        } else {
            return res.status(404).json({ message: 'Product not found in cart' })
        }


    } catch (error) {
        console.error(error)
        res.status(500).send('Server error in update cart Product')
    }


})


// @route DELETE /api/cart
// @desc delete a product to the cart for a guest or logged in user
// @access Public

router.delete('/', async (req, res) => {
    const { productId, size, color, guestId, userId } = req.body
    try {
        let cart = await getCart(userId, guestId)
        if (!cart) return res.status(404).json({ message: 'Cart not found' })

        const productIndex = cart.products.findIndex((p) => p.productId.toString() === productId && p.size === size && p.color === color)

        if (productIndex > -1) {
            cart.products.splice(productIndex, 1)
            cart.totalPrice = cart.products.reduce((acc, item) => acc + item.price * item.quantity, 0)
            await cart.save()
            return res.status(200).json(cart)

        } else {
            return res.status(404).json({ message: 'Product not found' })
        }
    } catch (error) {
        console.error(error)
        res.status(500).send('Server error in delete cart Product')
    }

})


// @route GET /api/cart
// @desc GET all product to the cart for a guest or logged in user
// @access Public

router.get('/', async (req, res) => {
    const { userId, guestId } = req.query

    try {
        const cart = await getCart(userId, guestId)

        if (cart) {
            res.json(cart)
        } else {
            res.status(404).json({ message: 'Cart not found' }) // Correct 404 condition
        }
    } catch (error) {
        console.error(error)
        res.status(500).send('Server error in fetching cart products')
    }
})

// @route POST /api/cart
// @desc MERGE guest cart for a guest or logged in user
// @access Public

router.post('/merge', async (req, res) => {
    const { guestId } = req.body
    try {
        // Find the guest cart and user cart
        const guestCart = await Cart.findOne({ guestId })
        const userCart = await Cart.findOne({ user: req.user._id })

        if (guestCart) {
            if (guestCart.products.length === 0) {
                return res.status(400).json({ message: ' guest cart is empty ' })
            }

            if (userCart) {
                // mergfe guest cart into user cart
                guestCart.products.forEach((guestItem) => {
                    const productIndex = userCart.products.findIndex((item) => item.productId.toString() === guestItem.productId.toString() && item.size === guestItem.size && item.color === guestItem.color)

                    if (productIndex > -1) {
                        // if items exist in the user cart , update quantity
                        userCart.products[productIndex].quantity += guestItem.quantity
                    } else {
                        // Otherwise add the guest item to the cart
                        userCart.products.push(guestItem)
                    }
                });
                userCart.totalPrice = userCart.products.reduce((acc, item) => acc + item.price * item.quantity, 0)
                await userCart.save()

                // Remove the guest cart after merging
                try {
                    await Cart.findOneAndDelete({ guestId })
                } catch (error) {
                    console.error('Deleting guest cart', error)
                }
                res.status(200).json(userCart)
            } else {
                guestCart.user = req.user._id
                guestCart.guestId = undefined
                await guestCart.save()

                res.status(200).json(guestCart)
            }
        } else {
            if (userCart) {
                return res.status(200).json(userCart)
            }
            res.status(404).json({ message: 'guest cart not found' })
        }

    } catch (error) {
        console.error(error)
        res.status(500).send('Server error in merge cart products')
    }
})

module.exports = router