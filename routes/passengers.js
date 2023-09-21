var express = require ('express');
var router = express.Router();

var PassengerService = require('../services/PassengerService');
var ApiSecurity = require('../middlewares/apiSecurity');

router.get('/all',ApiSecurity.requireLogin,PassengerService.getAllPassengers);
router.get('/:id',PassengerService.getPassenger);
router.get('/search',PassengerService.search);
router.post('/',ApiSecurity.requirePermits('passenger.add'),PassengerService.addPassenger);
router.put('/:id',ApiSecurity.requirePermits('passenger.update','passenger.add'),PassengerService.updatePassenger);

module.exports = router;