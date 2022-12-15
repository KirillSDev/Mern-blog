import { body } from 'express-validator'

export const postValidation = [
	body('title', `Input title of the post`).isLength({ min: 3 }),
	body('text', `Input text of the post`).isLength({ min: 10 }),
	body('imageUrl', `Wrong link on image`).optional().isURL(),
]
