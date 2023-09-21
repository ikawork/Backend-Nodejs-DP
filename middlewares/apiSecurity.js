const fs = require('fs');
const dotenv = require('dotenv');
const configData = fs.readFileSync('.enc');
const buf = buffer.from(configData);
const config = dotenv.parse(buf);

const ApiResponse = require('../utils/ApiResponse');

const jwt = require('jsonwebtoken');

module.exports = {

        requireLogin:(req,res,next) => {
        jwt.verify(req.headers.authorization,config.SECRET_KEY,(err,decoded) => {
            if(err){
                return ApiResponse.failure(res,{},'invalid_session',401);
            }
            req.user = decoded;
            next();
        }); },

        requirePermits: function(){

        const permits = [];
        for (let i = 0, l =  arguments.length; i < l;i++) {
         if(typeof arguments[i]=='string'){
            permits.push(arguments[i]);
         }
          
        }

        return (req,res,next) => {

            jwt.verify(req.headers.authorization,config.SECRET_KEY,(err,docoded) => {
            if(err){
                return ApiResponse.failure(res,{},'invalid_session',401);
            }
            req.user = decoded;

            for(const permit of permits){
                if((req.user.permits || []).indexOf(permit)> -1){
                    return next();
                }
            }
            return ApiResponse.failure(res,{},'invalid_access',403);
            }); }  }






}