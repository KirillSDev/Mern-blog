import UserModel from '../models/UserModel.js'
import bcrypt from 'bcrypt'
import { validationResult } from 'express-validator'
import jwt from 'jsonwebtoken'

//^ validationResult - check data which post user
//register
export const register = async (req, res) => {
	try {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).json(errors.array())
		} //-->(1) check undefined or not undefined
		const password = req.body.password
		const salt = await bcrypt.genSalt(10) //length password generate symbols
		const hash = await bcrypt.hash(password, salt) // // await - is show (2) crypt password

		const doc = new UserModel({
			email: req.body.email,
			passwordHash: hash,
			fullName: req.body.fullName,
			avatarUrl: req.body.avatarUrl,
		}) //(3) create model for data in mongodb

		const user = await doc.save() //(4) add in mongodb

		const token = jwt.sign(
			{
				_id: user._id, // Which user put out
			},
			'secret123',
			{
				expiresIn: '30d',
			}
		) // (5) This token is needed to identify the user
		const { passwordHash, ...UserData } = user._doc
		res.json({
			...UserData,
			token,
		})
	} catch (err) {
		console.log(`Error - ${err}`)
		res.status(500).json({
			message: 'Failed to register an account',
		})
	}
}

//login

export const login = async (req, res) => {
	try {
		const user = await UserModel.findOne({
			email: req.body.email,
		}) // Search in DB (filter)
		if (!user) {
			res.status(404).json({
				message: 'User not found',
			})
		}
		const isValidPass = await bcrypt.compare(
			req.body.password,
			user._doc.passwordHash
		) //match bode.password with passwordHash
		if (!isValidPass) {
			res.status(404).json({
				message: 'Wrong login or password',
			})
		}
		const token = jwt.sign(
			{
				_id: user._id, // Which user put out
			},
			'secret123',
			{
				expiresIn: '30d',
			}
		) // (5) This token is needed to identify the user
		const { passwordHash, ...UserData } = user._doc // userdata destructurization Its create new object without passwordhash
		res.json({
			...UserData,
			token,
		})
	} catch (err) {
		console.log(`Error - ${err}`)
		res.status(500).json({
			message: 'You have wrong email or password',
		})
	}
}
// get my profile
export const getMe = async (req, res) => {
	try {
		const user = await UserModel.findById(req.userId) // search
		if (!user) {
			res.status(404).json({
				message: 'User not found',
			})
		}
		const { passwordHash, ...UserData } = user._doc // userdata destructurization Its create new object without passwordhash
		res.json({
			...UserData,
		})
	} catch (err) {
		console.log(`Error - ${err}`)
		res.status(500).json({
			message: 'You have wrong email or password',
		})
	}
}
