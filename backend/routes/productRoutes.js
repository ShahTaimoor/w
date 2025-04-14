const express = require('express')
const Product = require('../models/Product')
const { protect } = require('../middleware/authMiddleware')
const { ROLES } = require('../utils/constant')
const router = express.Router()
const cloudinary = require('../utils/cloudinary')
const upload = require('../middleware/multer')

// @route POST /api/products
// @desc Create a new Product
// @access Private/Admin

router.post('/create-product', protect, upload.array('images', 4), async (req, res) => {
    if (req.role !== ROLES.admin) {
        return res.status(401).json({ success: false, message: 'Access Denaid' })
    }
    try {
        const { name, description, price, category, stock } = req.body

        const uploadImages = []

        for (const file in req.files) {
            const result = await cloudinary.uploader.upload(req.files[file].path, { folder: 'products' })

            uploadImages.push({
                url: result.secure_url,
                id: result.public_id
            })
        }

        const randomSku = `SKU-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const product = new Product({
            name, description, price, category, stock, images: uploadImages, sku: randomSku,
        })
        await product.save()
        return res.status(201).json({
            success: true,
            messaeg: 'Product Added Successfully',
            data: product
        })
    } catch (error) {
        console.error(error)
        res.status(500).send('Server error in create Product')
    }
})



// @route PUT /api/producs/:id
// @desc Update an existing product ID
// @access Private/Admin

router.put('/update-product/:id', protect, async (req, res) => {
    if (req.role !== ROLES.admin) {
        return res.status(401).json({ success: false, message: 'Access Denaid' })
    }

    try {
        const { ...data } = req.body
        const { id } = req.params

        const product = await Product.findByIdAndUpdate(id, data, { new: true })

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product Not Found' })
        }

        return res.status(201).json({ sucess: true, message: 'Product Updated Successfully', date: product })


    } catch (error) {
        console.error(error)
        res.status(500).send('Server error in update Product')
    }
})

// @route DELETE /api/producs/:id
// @desc Delete a prdocut by ID
// @access Private/Admin

router.delete('/delete-product/:id', protect, async (req, res) => {
    if (req.role !== ROLES.admin) {
        return res.status(401).json({ success: false, message: 'Access Denaid' })
    }
    try {

        // Find the product ID
        const { id } = req.params
        const product = await Product.findByIdAndDelete(id)

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product Not Found' })
        }

        return res.status(201).json({ sucess: true, message: 'Product Updated Successfully', date: product })


    } catch (error) {
        console.error(error)
        res.status(500).send('Server error in delete Product')
    }
})


// @route GET /api/products
// @desc Get all products with optional query filters
// @access Public

router.get('/get-products', async (req, res) => {
    try {
        let { page, limit, category, search } = req.query;
        let query = {};

        page = parseInt(page) || 1;
        limit = parseInt(limit) || 9;

        if (category && category !== 'all') {
            query.category = category.charAt(0).toUpperCase() + category.slice(1);
        }

        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        const totalProducts = await Product.countDocuments(query);
        const totalPages = Math.ceil(totalProducts / limit);

        const products = await Product.find(query)
            .select('name images price description stock' )
            .skip((page - 1) * limit)
            .limit(limit);

        const newProductArray = products.map((product) => {
            const productObj = product.toObject();
            productObj.image = productObj.images[0]; // Use .images to return all if needed
            delete productObj.images;
            return productObj;
        });

        if (!products.length) {
            return res.status(404).json({ success: false, message: 'No products found' });
        }

        return res.status(200).json({
            success: true,
            message: 'Products fetched successfully',
            data: newProductArray,
            pagination: {
                totalPages,
                totalProducts,
                currentPage: page,
                pageSize: limit,
            },
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error while fetching products' });
    }
});




router.get('/get-product-by-name/:name', async (req, res) => {
    try {
        const { name } = req.params;

        // Look for the product by name in the database
        const product = await Product.findOne({ name });

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product Not Found' });
        }

        // Return the product data in the response with a 200 OK status code
        return res.status(200).json({ success: true, message: 'Product Retrieved Successfully', data: product });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error in retrieving product' });
    }
});











module.exports = router