const express = require('express');
const Category = require('../models/Category');
const slugify = require('slugify');
const { isAuthorized, isAdmin } = require('../middleware/authMiddleware');
<<<<<<< HEAD
const upload = require('../middleware/multer');
const { uploadImageOnCloudinary } = require('../utils/cloudinary');
=======
const { uploadImageOnCloudinary, deleteImageOnCloudinary } = require('../utils/cloudinary');
const upload = require('../middleware/multer');
>>>>>>> fb2e911b0f8a9fc050f3f6a9b045faf3b37004e0

const router = express.Router();

// Create category
<<<<<<< HEAD
router.post('/create-category',upload.single('picture'), isAuthorized, isAdmin, async (req, res) => {
=======
router.post('/create-category', upload.single('picture'), isAuthorized, isAdmin, async (req, res) => {
>>>>>>> fb2e911b0f8a9fc050f3f6a9b045faf3b37004e0

    try {
        const { name } = req.body;
        const picturePath = req.file?.path;
        // Check if category name is provided
        if (!name) {
            return res.status(400).json({ success: false, message: 'Category name is required' });
        }

<<<<<<< HEAD
=======

>>>>>>> fb2e911b0f8a9fc050f3f6a9b045faf3b37004e0
        // Check if category already exists
        const existingCategory = await Category.findOne({ name: { $regex: `^${name}$`, $options: 'i' } });
        if (existingCategory) {
            return res.status(400).json({ success: false, message: 'Category already exists' });
        }
<<<<<<< HEAD
        // Cloudinary image upload
        const { secure_url, public_id } = await uploadImageOnCloudinary(picturePath, "products");

=======

        // Cloudinary image upload
        const { secure_url, public_id } = await uploadImageOnCloudinary(picturePath, "products");
>>>>>>> fb2e911b0f8a9fc050f3f6a9b045faf3b37004e0
        // Check if the image upload was successful
        if (!secure_url || !public_id) {
            return res.status(500).json({
                success: false,
                message: 'Error while uploading image',
                error: 'Cloudinary upload failed'
            });
        }
<<<<<<< HEAD

        const newCategory = await Category.create({
            name,
            slug: slugify(name, { lower: true, strict: true }),
            picture: { secure_url, public_id }
=======
        const newCategory = await Category.create({
            name,
            picture: { secure_url, public_id },
            slug: slugify(name, { lower: true, strict: true })
>>>>>>> fb2e911b0f8a9fc050f3f6a9b045faf3b37004e0
        });

        return res.status(201).json({
            success: true,
            message: 'Category created successfully',
            data: newCategory,
        });

    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({ success: false, message: 'Server error while creating category' });
    }
});

// Update category
router.put('/update-category/:slug', isAuthorized, isAdmin, async (req, res) => {


    try {
        const { name } = req.body;
        const { slug } = req.params;

        if (!name) {
            return res.status(400).json({ success: false, message: 'Category name is required' });
        }

        const updatedCategory = await Category.findOneAndUpdate(
            { slug },
            {
                name,
                slug: slugify(name, { lower: true, strict: true })
            },
            { new: true }
        );

        if (!updatedCategory) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }

        return res.status(200).json({
            success: true,
            message: 'Category updated successfully',
            data: updatedCategory,
        });

    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({ success: false, message: 'Server error while updating category' });
    }
});


// Delete category
router.delete('/delete-category/:slug', isAuthorized, isAdmin, async (req, res) => {


    try {
        const { slug } = req.params;

        const deletedCategory = await Category.findOneAndDelete({ slug });

        if (!deletedCategory) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }
<<<<<<< HEAD

=======
        // delete cloudinary image 

        if (deletedCategory.picture && deletedCategory.picture.public_id) {
            await deleteImageOnCloudinary(deletedCategory.picture.public_id)
        }
>>>>>>> fb2e911b0f8a9fc050f3f6a9b045faf3b37004e0
        return res.status(200).json({
            success: true,
            message: 'Category deleted successfully',
            data: deletedCategory
        });

    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ success: false, message: 'Server error while deleting category' });
    }
});


// Get all categories
router.get('/all-category', async (req, res) => {
    try {
        const categories = await Category.find().sort({ createdAt: -1 });

        if (!categories.length) {
            return res.status(404).json({ success: false, message: 'No categories found' });
        }
<<<<<<< HEAD
        
   const newCategoryArray = categories.map((category) => {
            const categoryObj = category.toObject();
            categoryObj.image = categoryObj.picture?.secure_url || null; // ✅ Add image field
            delete categoryObj.picture; // Optional: remove original picture field if not needed
            return categoryObj;
        });
        return res.status(200).json({
            success: true,
            message: 'Categories fetched successfully',
            data: newCategoryArray
=======

        return res.status(200).json({
            success: true,
            message: 'Categories fetched successfully',
            data: categories
>>>>>>> fb2e911b0f8a9fc050f3f6a9b045faf3b37004e0
        });

    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ success: false, message: 'Server error while fetching categories' });
    }
});

// server/routes/categoryRoutes.js

router.get('/single-category/:slug', async (req, res) => {
    const { slug } = req.params;
    try {
        const category = await Category.findOne({ slug });

        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }

        return res.status(200).json({
            success: true,
            message: 'Single category fetched successfully',
            data: { category }
        });
    } catch (error) {
        console.error('Error fetching single category:', error);
        res.status(500).json({ success: false, message: 'Server error while fetching single category' });
    }
});


// Export the router
module.exports = router;
