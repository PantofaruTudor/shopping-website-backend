const connectDB = require('../db/connect_database');
const mongoose = require('mongoose');

const { User } = require('../models/schema')(connectDB(process.env.MONGO_URI_USER));
const { Product } = require('../models/schema')(connectDB(process.env.MONGO_URI));


//DOAR PENTRU A TESTA CATEVA ROUTES=================================================

// const addToWishlist = async (req, res) => {
//     try {
//         console.log('=== ADD TO WISHLIST REQUEST ===');
//         console.log('Request body:', req.body);
//         console.log('User:', req.user);
        
//         const productId = req.body.productID;
//         const userId = req.user.userId; 
        
//         if (!productId) {
//             console.log('ERROR: Product ID is missing');
//             return res.status(400).json({ message: 'Product ID is required' });
//         }
        
//         console.log('Product ID received:', productId);
        
//         if (!mongoose.Types.ObjectId.isValid(productId)) {
//             console.log('ERROR: Invalid product ID format');
//             return res.status(400).json({ message: 'Invalid product ID format' });
//         }
        
//         const user = await User.findById(userId);
        
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }
        

//         if (user.wishlist.some(id => id.toString() === productId)) {
//             console.log('ERROR: Product already in wishlist');
//             return res.status(400).json({ message: 'Product already in wishlist' });
//         }
        

//         console.log('Checking if product exists in database...');
//         const productExists = await Product.findById(productId);
//         if (!productExists) {
//             console.log('ERROR: Product not found in database');
//             return res.status(404).json({ message: 'Product not found' });
//         }
        
//         console.log('Product found:', productExists.name);
        
//         user.wishlist.push(productId);
//         await user.save();
        
//         console.log('SUCCESS: Product added to wishlist');
//         console.log('Updated wishlist:', user.wishlist);
        
//         res.status(200).json({ 
//             message: 'Added to wishlist', 
//             wishlist: user.wishlist 
//         });
//     } catch (error) {
//         console.error('CATCH ERROR adding to wishlist:', error.message);
//         console.error('Full error:', error);
//         res.status(500).json({ error: error.message });
//     }
// };


// const removeFromWishlist = async (req, res) => {
//     console.log('=== REMOVE FROM WISHLIST REQUEST ===');
//     console.log('Request params:', req.params);
    
//     try {
//         const { productId } = req.params;
//         const userId = req.user.userId;
        
//         console.log('Extracted productId:', productId);
        
//         const user = await User.findById(userId);
//         console.log('User found:', user ? user.email : 'NOT FOUND');
        
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }
        
//         user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
//         await user.save();
//         console.log('SUCCESS: Product removed from wishlist');
        
//         res.status(200).json({ 
//             message: 'Removed from wishlist', 
//             wishlist: user.wishlist 
//         });
//     } catch (error) {
//         console.error('CATCH ERROR removing from wishlist:', error.message);
//         console.error('Full error:', error);
//         res.status(500).json({ error: error.message });
//     }
// };

// Get user's wishlist with full product details
const getWishlist = async (req, res) => {
    try {
        const requestTime = new Date().toISOString();
        console.log('=== GET WISHLIST REQUEST ===', requestTime);
        
        const userId = req.user.userId; 
        const user = await User.findById(userId);
        console.log('User found in database:', user ? user.email : 'NOT FOUND');
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        console.log('Number of items in wishlist:', user.wishlist.length);
        
        const products = await Product.find({
            _id: { $in: user.wishlist }
        });
        
        // console.log('Products found:', products.length);
        // console.log('Products:', products);
        
        // Find which product IDs don't exist anymore
        const existingProductIds = products.map(p => p._id.toString());
        const validWishlistIds = user.wishlist.filter(id => 
            existingProductIds.includes(id.toString())
        );
        
        // If there were invalid IDs, clean up the wishlist
        if (validWishlistIds.length !== user.wishlist.length) {
            console.log('Cleaning up invalid product IDs from wishlist');
            user.wishlist = validWishlistIds;
            await user.save();
        }
        
        res.status(200).json({ 
            wishlist: products 
        });

    } catch (error) {
        console.error('Error getting wishlist:', error.message);
        console.error('Full error:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {  getWishlist };
