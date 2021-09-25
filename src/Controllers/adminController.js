const Admin = require('../Models/adminModel');
const bcrypt = require("bcryptjs");


exports.admin_create = function(req, res) {
    // ------------------ Validate Request ----------------- //
    if (!req.body.name || !req.body.email || !req.body.password || !req.body.username) {
        return res.status(400).send({
            success: false,
            message: "Porfavor rellene todos los campos solicitados"
        });
    }


    // Create a user
    let admin = new Admin(
        ({ name, username, email, password } = req.body)
    );

    // ------------- save admin in the database -----------
    admin
        .save()
        .then(data => {
            res.send({
                success: true,
                message: "Su registro se ha guardado exitosamente",
                data: data
            });
        })
        .catch(err => {
            res.status(500).send({
                success: false,
                message: err.message || "Ocurrio un error al crear el registro",
            });
            console.log(err);
        })
}

// ------------- retrieve and return all admins ------------------
exports.all_admin = (req, res) => {
    Admin.find()
        .then(data => {
            var message = "";
            if (data === undefined || data.length == 0) message = "Personas no encontradas!";
            else message = "Publico recibido";
            res.send({
                success: true,
                message: message,
                data: data
            });
        })
        .catch(err => {
            res.status(500).send({
                success: false,
                message: err.message || "Ocurrio un error al traer los registros"
            });

        });
};

// --------- find a admin by id -------------
exports.admin_details = (req, res) => {
    Admin.findById(req.params.id)
        .then(data => {
            if (!data) {
                return res.status(404).send({
                    success: false,
                    message: "Persona no encontrada con el id" + req.params.id
                });
            }
            res.send({
                success: true,
                message: "Persona encontrada",
                data: data
            });
        })
        .catch(err => {
            if (err.kind === "ObjectId") {
                return res.status(404).send({
                    success: false,
                    message: "Persona no encontrada con el id " + req.params.id
                });
            }
            return res.status(500).send({
                success: false,
                message: "Error al traer la persona con el id " + req.params.id
            });
        });
};

// --------- Find admin and update ----------
exports.admin_update = async(req, res) => {
    const { name, email, password, sede } = req.body;
    // console.log(name, price);
    // validate request
    if (!name) {
        return res.status(400).send({
            success: false,
            message: "Por favor ingrese el nombre del usuario para editar"
        });
    }

    //......Get the hashed password.......
    const hsdpassword = await bcrypt.hash(password, 12);


    Admin.findOneAndUpdate({ name }, {
            $set: { name: name, password: hsdpassword }
        }, { new: true })
        .then(data => {
            if (!data) {
                return res.status(400).send({
                    success: false,
                    message: "Usuario no encontrado con el nombre " + req.body.name
                });
            }
            res.send({
                success: true,
                message: "¡Usuario actualizado exitosamente!"
            });
        })
        .catch(err => {
            if (err.kind === "ObjectId") {
                return res.status(404).send({
                    success: false,
                    message: "Usuario no encontrada con el nombre " + req.body.name
                });
            }

            return res.status(500).send({
                success: false,
                message: "Error actualizando la usuario con el nombre " + req.body.name
            });
        });
}

// delete a admin with the specified id.
exports.admin_delete = (req, res) => {
    const { name } = req.body
    Admin.findOneAndDelete({ name })
        .then(data => {
            if (!data) {
                return res.status(404).send({
                    success: false,
                    message: "Persona no encontrada con el nombre " + name
                });
            }
            res.send({
                success: true,
                message: "Persona eliminada exitosamente"
            });
        })
        .catch(err => {
            if (err.kind === "ObjectId" || err.name === "NotFound") {
                return res.status(404).send({
                    success: false,
                    message: "Persona no encontrada con el nombre " + name
                });
            }
            return res.status(500).send({
                success: false,
                message: "No se puede eliminar el usuario con el nombre " + name
            });
        });
};