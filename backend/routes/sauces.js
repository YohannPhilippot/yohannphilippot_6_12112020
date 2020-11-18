const express = require('express')
const router = express.Router()

const saucesCtrl = require('../controllers/sauces')

const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config')

router.get('/', auth, saucesCtrl.getAllSauces)
router.post('/', auth, multer, saucesCtrl.createSauce)
router.get('/:id', auth, saucesCtrl.getOneSauce)
router.delete('/:id', auth, saucesCtrl.deleteSauce)
router.put('/:id', auth, saucesCtrl.modifySauce)

module.exports = router