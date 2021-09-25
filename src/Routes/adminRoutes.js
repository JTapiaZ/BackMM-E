const express = require('express');
const router = express.Router();

// --------- Import the controllers ----------
const admin_controller = require('../Controllers/adminController');
const { adminLogin, adminRegister } = require('../Utils/adminUtils');


router.route("/list").get(admin_controller.all_admin);

router.route("/details/:id").get(admin_controller.admin_details);

router.route("/update").post(admin_controller.admin_update);

router.route("/delete").post(admin_controller.admin_delete);

router.post("/register", async(req, res) => {
    await adminRegister(req.body, res);
});

router.post("/login", async(req, res) => {
    await adminLogin(req.body, res);
});


module.exports = router;