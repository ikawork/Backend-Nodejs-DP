var express = require('express');
var router = express.Router();

var DriverService  = require ('../services/DriverService');
var ApiSecurity = require('../middlewares/apiSecurity');

router.get('/all',ApiSecurity.requireLogin,DriverService.getAllDrivers);
router.get('/:id',DriverService.getDriver);
router.get('/search',DriverService.search);
router.post('/',ApiSecurity.requirePermits('driver.add'), DriverService.addDriver);
router.put('/:id',ApiSecurity.requirePermits('driver.update','driver.add'),DriverService.updateDriver);

module.exports = router;
