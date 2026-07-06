const mongoose = require("mongoose");


const connnectDatabase = () => {
mongoose.connect(process.env.DB_URI).then((connect)=>{
    console.log(`Database Connected Successfully with port ${connect.connection.host}`);
    
})
}


module.exports = connnectDatabase;