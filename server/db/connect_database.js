const mongoose = require('mongoose')

const connectDB = (url) =>{
    try {
        const connection = mongoose.createConnection(url);
        connection.on('error', (err) => console.error('MongoDB connection error:', err.message));
        return connection;
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        throw error;
    }
}

module.exports = connectDB