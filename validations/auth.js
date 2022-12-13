import { body } from 'express-validator'

export const registerValidation = [
	body('email', 'Wrong format email').isEmail(),
	body('password', 'Password must be more that 5 symbols').isLength({ min: 6 }),
	body('fullName', 'FullName must be more that 5 symbols').isLength({ min: 6 }),
	body('avatarUrl', 'Wrong url').optional().isURL(),
]
