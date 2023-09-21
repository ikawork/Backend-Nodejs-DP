const PassengerModel = require('../models/passenger');
const ApiResponse = require('../utils/ApiResponse');

module.exports = {

    getAllPassengers: async(req,res)=>{
        try {
            const passengers = await PassengerModel.find({});
            ApiResponse.success(res,passengers);
        } catch (error) {
            ApiResponse.failure(res,error,'error_on_getAllPassengers');
        }
    },

    getPassenger: async(req,res)=>{
        try {
            const passenger = await PassengerModel.findById(req.params.id);
            ApiResponse.success(res,passenger);
        } catch (error) {
            ApiResponse.failure(res,error,'error_on_getPassenger');
        }
    },

    addPassenger: async (req,res) => {
        try {
            const body = req.body;
            const requiredFields = ['firstName','lastName','passengerId'];
        for (const field of requiredFields) {
            if (!body[field]) {
              return ApiResponse.failure(res, {}, `${field} is missing`, 400);
            }
          }
          const result = await new PassengerModel(body).save();
          ApiResponse.success(res,result); 
        } catch (error) {
            ApiResponse.failure(res,error,'error_on_addPassenger');
        }
    },
    updatePassenger: async (req,res) => {
        try {
            const rec = await PassengerModel.findByIdAndUpdate(
                {_id: req.params.id},
                {$set:req.body},
                {new:true}
            );
            if(!rec){
                return ApiResponse.failure(res,{},'record_not_found',404);
            }
            ApiResponse.success(res,rec);
        } catch (error) {
            ApiResponse.failure(res,error,'error_on_updatePassenger');
        }
    },
    search: async(req,res) => {
        try {
            const query = req.query;
            let skip = 0;
            let limit = 10;
            if(query.skip){
                skip = +query.skip;
            }
            if(query.limit){
                limit = +query.limit;
            }
            const queryForSearch = {};
            if(req.query.searchText){
                queryForSearch.$or = [{
                    firstName: new RegExp(`.*${req.query.searchText}.*`, "i")
                  }, {
                    lastName: new RegExp(`.*${req.query.searchText}.*`, "i")
                  }, {
                    passengerId: new RegExp(`.*${req.query.searchText}.*`, "i")
                  }]
            }
            const result = await PassengerModel.find(queryForSearch)
            .sort({createdAt:1})
            .skip(skip)
            .limit(limit)
            .lean();
            ApiResponse.success(res,result);
        } catch (error) {
            ApiResponse.failure(res,error,'error_on_search');
        }
    }




};