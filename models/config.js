function mongo_init() {
    const mongoose = require('mongoose')

    mongoose.connect(`${process.env.MONGO_DB_DEV}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    })

    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function () {
        console.log('db connected!');
    });
}

module.exports = mongo_init