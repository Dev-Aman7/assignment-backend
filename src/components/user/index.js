const router = require('express').Router();
const User = require('../../schemas/user');
const _ = require('lodash');
router.get('/all', (req, res) => {
	User.find()
		.select('-Password')
		.then((result) => {
			res.status(200).json({
				status: true,
				message: 'Successfully fetched all users',
				data: result,
			});
		})
		.catch((err) => {
			res.status(500).json({
				status: false,
				message: err,
			});
		});
});

router.patch('/update/:id', (req, res) => {
	const { Name, Email, PhoneNo, Profession } = req.body;
	const data = _.omitBy({ Name, Email, PhoneNo, Profession }, _.isNil);

	User.findByIdAndUpdate(req.params['id'], data, { new: true })
		.then((result) => {
			res.status(200).json({
				status: true,
				message: 'Successfully Updated users',
				data: result,
			});
		})
		.catch((err) => {
			res.status(500).json({
				status: false,
				message: err,
			});
		});
});

router.delete('/remove/:id', (req, res) => {
	User.findByIdAndDelete(req.params['id'])
		.then((result) => {
			res.status(200).json({
				status: true,
				message: 'Successfully Updated users',
			});
		})
		.catch((err) => {
			res.status(500).json({
				status: false,
				message: err,
			});
		});
});

module.exports = router;
