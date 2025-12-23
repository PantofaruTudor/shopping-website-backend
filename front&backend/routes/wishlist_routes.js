const express = require('express');
const router = express.Router();
const { requestPoint } = require('../controllers/auth_controller');
const { 
    getWishlist 
} = require('../controllers/wishlist_controller');


router.get('/', requestPoint, getWishlist);

module.exports = router;
