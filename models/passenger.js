const mongoose = require('mongoose');

const passengerSchema = mongoose.Schema(
    {
        firstName:{ type: String, required: true },
        lastName:{ type: String, required : true },
        dob: { type: Date},
        passengerId:{ type: Number, required: true, unique: true},
    },{

        collection: 'passengers',
        timestamps: true,
        writeConcern: {
            w:'majority',
            j:true,
            wtimeout:30000
        },
        read:'nearest'

});

const Model = mongoose.model('passenger',passengerSchema);
module.exports = Model;