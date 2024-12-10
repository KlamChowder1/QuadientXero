const express = require('express');
const router = express.Router();
const xeroController = require('../controllers/xeroController');

router.get('/connect', xeroController.connectXero);

router.get('/callback', xeroController.handleCallback);

router.get('/vendors', xeroController.getVendors);

router.get('/accounts', xeroController.getAccounts);

module.exports = router;
