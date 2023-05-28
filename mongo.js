const mongoose = require("mongoose");
const mongoPath = "mongodb+srv://ansh:0093@cosmic.9awu9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

module.exports = async () => {
    await mongoose.connect(mongoPath, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    return mongoose;
};
