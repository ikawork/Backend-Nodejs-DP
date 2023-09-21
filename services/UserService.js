const UserModel = require('../models/user');
const ApiResponse = require('../utils/ApiResponse');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const fs = require('fs');
const dotenv = require('dotenv');
const configData = fs.readFileSync('.env');
const buf = Buffer.from(configData);
const config = dotenv.parse(buf);

function generateToken(data) {
  return jwt.sign(data, config.SECRET_KEY);
}


module.exports = {

  registerUser: async (req, res) => {
    try {
      if (!req.body.userName || !req.body.password) {
        return ApiResponse.failure(res, {}, 'userName or password is missing', 400);
      }
      const alreadyRegisteredCnt = await UserModel.countDocuments({ userName: req.body.userName });
      if (alreadyRegisteredCnt) {
        return ApiResponse.failure(res, {}, 'userName already exists', 409);
      }
      const salt = bcrypt.genSaltSync(10);
      const password = bcrypt.hashSync(req.body.password, salt);

      await new UserModel({
        userName: req.body.userName,
        password
      }).save();

      const sessionToken = generateToken({
        userName: req.body.userName,
        permits: req.body.permits
      });

      ApiResponse.success(res, { sessionToken });

    } catch (error) {
      ApiResponse.failure(res, error, 'error_on_registerUser');
    }
  },

  login: async (req, res) => {
    try {
      const user = await UserModel.findOne({ userName: req.body.userName });
      if (!user) {
        return ApiResponse.failure(res, {}, 'user_not_found', 404);
      }
      if (bcrypt.compareSync(req.body.password, user.password)) {
        const sessionToken = generateToken({
          userName: user.userName,
          permits: user.permits
        });

        ApiResponse.success(res, { sessionToken });
      } else {
        return ApiResponse.failure(res, {}, 'user_not_found', 404);
      }
    } catch (error) {
      ApiResponse.failure(res, error, 'error_on_login');
    }
  }

}