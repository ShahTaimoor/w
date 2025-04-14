const express = require('express')
const cors = require('cors')
const app = express()
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const userRoutes = require('./routes/userRoutes')
const productRoutes = require('./routes/productRoutes')
const cartRoutes = require('./routes/cartRoutes')
const checkoutRoutes = require('./routes/checkoutRoute')
const orderRoutes = require('./routes/orderRoutes')
const uploadRoutes = require('./routes/uploadRoutes')
const settingRoutes = require('./routes/settingsRoutes')




app.use(cors({
    origin: process.env.CLIENT_URL, 
    credentials: true
}));
app.use(express.json());

dotenv.config()

const PORT = process.env.PORT

// Connect Db

connectDB()



// API Routes
app.use('/api', userRoutes)
app.use('/api', productRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/checkout', checkoutRoutes)
app.use('/api', orderRoutes)
app.use('/api/upload', uploadRoutes)


// admin routes


app.use('/api', settingRoutes)



app.listen(process.env.PORT, () => {
    console.log('Server is running', process.env.PORT);

})