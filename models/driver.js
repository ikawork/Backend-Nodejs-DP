const mongoose = require('mongoose');

const driverSchema = mongoose.Schema(
    {
        firstName:{ type: String, required: true },
        lastName:{ type: String, required : true },
        dob: { type: Date},
        driverId:{ type: Number, required: true, unique: true},
        car: {type: String, required: true}
    },{

        collection: 'drivers',
        timestamps: true,
        writeConcern: {
            w:'majority',
            j:true,
            wtimeout:30000
        },
        read:'nearest'

});

const Model = mongoose.model('driver',driverSchema);
module.exports = Model;