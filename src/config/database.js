const mongoose = require('mongoose');

//mongodb+srv://lavneshy_db_user:GbPyabBLrbRumFPn@cluster0.idhjhol.mongodb.net/
const connectDB = async () => {
    await mongoose.connect(
        'mongodb+srv://lavneshy_db_user:GbPyabBLrbRumFPn@cluster0.idhjhol.mongodb.net/'
    );
};

module.exports = connectDB;