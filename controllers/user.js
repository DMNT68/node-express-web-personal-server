const bcrypt = require('bcryptjs');
const jwt = require('../services/jwt');
const User = require('../models/user');

function signUp(req, res) {
	const user = new User();
	const { name, lastname, email, password, repeatPassword } = req.body;

	user.name = name;
	user.lastname = lastname;
	user.email = email.toLowerCase();
	user.role = 'admin';
	user.active = false;

	if (!password || !repeatPassword) {
		res.status(404).send({ message: 'Las constraseñas son obligatorias.' });
	} else {
		if (password !== repeatPassword) {
			res.status(404).send({ message: 'Las contraseñas no coinciden.' });
		} else {
			bcrypt.hash(password, 10, (err, hash) => {
				if (err) {
					res.status(500).send({
						message: 'Error al encriptar la constraseña.'
					});
					console.log(err);
				} else {
					user.password = hash;
					user.save((err, userStored) => {
						if (err) {
							res.status(500).send({ message: 'El usuario ya existe.' });
						} else {
							if (!userStored) {
								res.status(404).send({
									message: 'Error al crear el usuario.'
								});
							} else {
								res.status(200).send({ user: userStored });
							}
						}
					});
				}
			});
		}
	}
}

function signIn(req, res) {
	const params = req.body;
	const email = params.email.toLowerCase();
	const password = params.password;

	User.findOne({ email }, (err, userStored) => {
		if (err) {
			res.status(500).send({ message: 'Error del servidor.' });
		} else {
			if (!userStored) {
				res.status(400).send({ message: 'Usuario no encontrado.' });
			} else {
				if (!bcrypt.compareSync(password, userStored.password)) {
					res.status(400).send({ message: 'Credenciales incorrectas' });
				} else {
					if (!userStored.active) {
						res.status(200).send({
							code: 200,
							message: 'El usuario no esta activado'
						});
					} else {
						res.status(200).send({
							accessToken: jwt.createAccessToken(userStored),
							refreshToken: jwt.createRefreshToken(userStored)
						});
					}
				}
			}
		}
	});
}

module.exports = { signUp, signIn };
