const DriverModel = require('../models/driver');
const ApiResponse = require('../utils/ApiResponse');

module.exports = {

    getAllDrivers: async(req,res)=>{
        try {
            const drivers = await DriverModel.find({});
            ApiResponse.success(res,drivers);
        } catch (error) {
            ApiResponse.failure(res,error,'error_on_getAllDrivers');
        }
    },

    getDriver: async(req,res)=>{
        try {
            const driver = await DriverModel.findById(req.params.id);
            ApiResponse.success(res,driver);
        } catch (error) {
            ApiResponse.failure(res,error,'error_on_getDriver');
        }
    },

    addDriver: async (req,res) => {
        try {
            const body = req.body;
            const requiredFields = ['firstName','lastName','driverId','car'];
        for (const field of requiredFields) {
            if (!body[field]) {
              return ApiResponse.failure(res, {}, `${field} is missing`, 400);
            }
          }
          const result = await new DriverModel(body).save();
          ApiResponse.success(res,result); 
        } catch (error) {
            ApiResponse.failure(res,error,'error_on_addDriver');
        }
    },
    updateDriver: async (req,res) => {
        try {
            const rec = await DriverModel.findByIdAndUpdate(
                {_id: req.params.id},
                {$set:req.body},
                {new:true}
            );
            if(!rec){
                return ApiResponse.failure(res,{},'record_not_found',404);
            }
            ApiResponse.success(res,rec);
        } catch (error) {
            ApiResponse.failure(res,error,'error_on_updateDriver');
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
                    driverId: new RegExp(`.*${req.query.searchText}.*`, "i")
                  }]
            }
            const result = await DriverModel.find(queryForSearch)
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