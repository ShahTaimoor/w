const express = require('express')

const Order = require('../models/Order')

const { protect } = require('../middleware/authMiddleware')
const { ROLES } = require('../utils/constant')
const User = require('../models/User')
const Product = require('../models/Product')

const router = express.Router()

// @route POST /api/orders
// @desc Place a new order (COD)
// @access Private

router.post('/order', protect, async (req, res) => {
  try {
      const { products, address, amount } = req.body;

      if (!products || products.length === 0) {
          return res.status(400).json({ success: false, message: 'No products provided' });
      }

      // Step 1: Check stock and reduce it
      for (const item of products) {
          const product = await Product.findById(item.id);

          if (!product) {
              return res.status(404).json({ success: false, message: `Product not found: ${item.id}` });
          }

          if (product.stock < item.quantity) {
              return res.status(400).json({ success: false, message: `Not enough stock for product: ${product.name}` });
          }

          product.stock -= item.quantity; // Decrease the stock
          await product.save();
      }

      // Step 2: Save the order after stock is updated
      const newOrder = new Order({
          products,
          userId: req.id,
          address,
          amount,
          paymentMethod: 'COD',
          status: 'Pending'
      });

      const savedOrder = await newOrder.save();

      return res.status(201).json({ success: true, data: savedOrder });
  } catch (error) {
      console.error('COD Order Error:', error);  // This will log the error
      return res.status(500).json({ success: false, message: 'Server Error' });
  }
});


// @route GET /api/orders/my-orders
// @desc Get logged-in users orders
// @access Private

router.get('/get-orders-by-user-id', protect, async (req, res) => {

    const userId = req.id

    try {
        const orders = await Order.find({ userId }).populate({
            path: 'products.id',
            select: "name price category images"
        })

        if (!orders) {
            return res.status(404).json({ success: false, message: 'Order Not Found' })
        }

        return res.status(201).json({ sucess: true, data: orders })


    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' })
    }
})


// @route GET /api/orders/:id
// @desc Get order details by ID
//  @access Private

router.get('/get-all-orders', protect, async (req, res) => {
    if (req.role !== ROLES.admin) {
        return res.status(401).json({ success: false, message: 'Access Denied' });
    }

    const { page = 1, limit = 10 } = req.query;

    try {
        const orders = await Order.find()
            .populate({
                path: 'products.id',
                select: 'name price category images',
            })
            .populate({
                path: 'userId',
                select: 'name email',
            })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        if (!orders.length) {
            return res.status(404).json({ success: false, message: 'Orders not found' });
        }

        const count = await Order.countDocuments();

        return res.status(200).json({
            success: true,
            data: orders,
            totalPages: Math.ceil(count / limit),
            currentPage: Number(page),
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

router.get('/get-metrics', protect, async (req, res) => {
    if (req.role !== ROLES.admin) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to access this route",
      });
    }
  
    const { startDate, endDate } = req.query;
  
    try {
      const start = new Date(startDate || new Date().setMonth(new Date().getMonth() - 1));
      const end = new Date(endDate || new Date());
  
      // Calculate total sales
      const ordersInRange = await Order.find({
        createdAt: { $gte: start, $lte: end },
      });
  
      const totalSales = ordersInRange.reduce((acc, order) => acc + Number(order.amount), 0); // Ensure amount is a number
  
      // Calculate this month's orders
      const thisMonthOrders = ordersInRange;
  
      // Get the last month
      const lastMonth = new Date(new Date().setMonth(new Date().getMonth() - 1));
  
      // Calculate last month's orders
      const lastMonthOrders = await Order.find({
        createdAt: { $gte: lastMonth, $lte: start },
      });
  
      // Calculate total amount of this month's orders
      const totalThisMonth = thisMonthOrders.reduce((acc, order) => acc + Number(order.amount), 0);
  
      // Calculate total amount of last month's orders
      const totalLastMonth = lastMonthOrders.reduce((acc, order) => acc + Number(order.amount), 0);
  
      // Calculate growth
      const salesGrowth = totalLastMonth
        ? ((totalThisMonth - totalLastMonth) / totalLastMonth) * 100
        : 0;
  
      // Calculate users
      const thisMonthUsers = await User.find({
        createdAt: { $gte: start, $lte: end },
      });
  
      const lastMonthUsers = await User.find({
        createdAt: { $gte: lastMonth, $lte: start },
      });
  
      const usersGrowth = lastMonthUsers.length
        ? ((thisMonthUsers.length - lastMonthUsers.length) / lastMonthUsers.length) * 100
        : 0;
  
      // Calculate users purchased last hour
      const lastHour = new Date(new Date().setHours(new Date().getHours() - 1));
  
      const lastHourOrders = await Order.find({
        createdAt: { $gte: lastHour, $lte: new Date() },
      });
  
      const previousDayOrders = await Order.find({
        createdAt: {
          $gte: new Date(new Date().setDate(new Date().getDate() - 1)),
        },
      });
  
      const lastHourGrowth = previousDayOrders.length
        ? (lastHourOrders.length / previousDayOrders.length) * 100
        : 0;
  
      // Recent sales
      const recentOrders = await Order.find()
        .populate({
          path: "userId",
          select: "name email",
        })
        .select("amount")
        .sort({ createdAt: -1 })
        .limit(9);
  
      // products delivered in last 6 months with their category and count according to month
      const sixMonthsAgo = new Date(new Date().setMonth(new Date().getMonth() - 6));
  
      const sixMonthsOrders = await Order.find({
        createdAt: { $gte: sixMonthsAgo },
      }).populate({
        path: "products.id",
        select: "category",
      });
  
      // get them month wise for eg ; {jan : {keyboard : 1, mouse :1, headset 2}}
      const monthWise = sixMonthsOrders.reduce((acc, order) => {
        const month = new Date(order.createdAt).toLocaleString("default", {
          month: "short",
        });
  
        order.products.forEach((product) => {
          if (!acc[month]) {
            acc[month] = {};
          }
  
          if (!acc[month][product.id.category]) {
            acc[month][product.id.category] = 1;
          } else {
            acc[month][product.id.category]++;
          }
        });
  
        return acc;
      }, {});
  
      return res.status(200).json({
        success: true,
        data: {
          totalSales: {
            count: totalSales.toFixed(2), // Formatting to 2 decimal places
            growth: salesGrowth.toFixed(2), // Formatting to 2 decimal places
          },
          users: {
            count: thisMonthUsers.length,
            growth: usersGrowth.toFixed(2), // Formatting to 2 decimal places
          },
          sales: {
            count: totalThisMonth.toFixed(2), // Formatting to 2 decimal places
            growth: salesGrowth.toFixed(2), // Formatting to 2 decimal places
          },
          activeNow: {
            count: lastHourOrders.length,
            growth: lastHourGrowth.toFixed(2), // Formatting to 2 decimal places
          },
          recentSales: {
            count: totalThisMonth.toFixed(2),
            users: recentOrders,
          },
          sixMonthsBarChartData: monthWise,
        },
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });
  








module.exports = router