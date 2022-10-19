const mongoose = require("mongoose")

const dburl = process.env.DBLINK

mongoose.connect(dburl, {
    autoIndex: true,
    useNewUrlParser: true,
});




