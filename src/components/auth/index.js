const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const User = require('../../schemas/user');

const saltRounds = 10;
router.post('/signup', (req, res) => {
	const { Name, Password, Email, PhoneNo, Profession } = req.body;

	bcrypt.hash(Password, saltRounds).then(function (hash) {
		// console.log(hash);
		const data = new User({
			Name,
			Password: hash,
			Email,
			PhoneNo,
			Profession,
		});
		data.save()
			.then((result) => {
				res.status(200).json({
					status: true,
					message: 'Successfully added user',
					data: result,
				});
			})
			.catch((err) => {
				if (err.code == 11000) {
					res.status(409).json({
						status: false,
						message: 'Email already taken',
					});
				} else {
					res.status(500).json({
						status: false,
						message: err,
					});
				}
			});
	});
});

router.post('/signIn', (req, res) => {
	const { Email, Password } = req.body;

	User.findOne({ Email })
		.then((result) => {
			if (!_.isEmpty(result)) {
				const { _id, Name, Email, PhoneNo, Profession } = result;
				bcrypt
					.compare(Password, result.Password)
					.then((match) => {
						if (match) {
							const token = jwt.sign(
								{ userId: result._id },
								process.env.SECRET,
							);
							res.status(200).json({
								status: true,
								message: 'Successfully logged in',
								data: {
									token,
									_id,
									Name,
									Email,
									PhoneNo,
									Profession,
								},
							});
						} else {
							res.status(401).json({
								status: false,
								message: 'Invalid Name or Password',
							});
						}
					})
					.catch((err) => {
						console.log(err);
						res.status(500).json({
							status: false,
							message: 'Something went wrong',
						});
					});
			} else {
				res.status(204).json({
					status: false,
					message: 'No such user',
				});
			}
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({
				status: false,
				message: 'Something went wrong',
			});
		});
});

module.exports = router;
