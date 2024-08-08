const express = require('express')
const router = express.Router()
const appController = require('../controller/appController')
const inAppcontrol = require('../controller/inAppcontrol')
const {validateToken, ifAuthenticated} = require('./jwt')



// ###########################   Authentication routes   ##################################

router.get('/login',ifAuthenticated, appController.login)
router.post('/login', appController.logined)

router.get('/register',ifAuthenticated,appController.register)
router.post('/register',appController.registered)

router.get('/',validateToken,appController.home)

// #########################################################################################3

// find   ######################
// router.post('/chats',appController.find)
 
router.post('/',validateToken,inAppcontrol.todo)
router.get('/tododel/:id',inAppcontrol.tododel)

router.get('/profile',validateToken,inAppcontrol.profile)
router.post('/profile',validateToken,inAppcontrol.profile_pic)

router.get('/chats',validateToken,inAppcontrol.chats)
router.post('/chats',inAppcontrol.chated)

router.get('/dairy',validateToken,inAppcontrol.dairy)
router.post('/dairy',validateToken,inAppcontrol.dairyjotted)
router.get('/createjotter',validateToken,inAppcontrol.createjotter)


router.get('/logout',validateToken,appController.logout)




module.exports = router;