import { body } from 'express-validator'

export const loginValidation = [
	body('email', 'Wrong format email').isEmail(),
	body('password', 'Password must be more that 5 symbols').isLength({ min: 6 }),
]
