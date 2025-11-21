const express = require('express');
const router = express.Router();
const { requestPoint } = require('../controllers/auth_controller');
const { 
    addToWishlist, 
    removeFromWishlist, 
    getWishlist 
} = require('../controllers/wishlist_controller');

// All routes require authentication (requestPoint middleware)
router.post('/add', requestPoint, addToWishlist);
router.delete('/remove/:productId', requestPoint, removeFromWishlist);
router.get('/', requestPoint, getWishlist);

module.exports = router;
