import { postControllers, userControllers } from './controllers/index.js'
// import {
// 	createdNewPost,
// 	deletePost,
// 	getAllPosts,
// 	getSinglePost,
// 	updatePost,
// } from './controllers/postController.js'
// import { getMe, login, register } from './controllers/userControllers.js'
import checkAuth from './utils/checkAuth.js'
import { registerValidation } from './validations/auth.js'
import { loginValidation } from './validations/loginValidation.js'
import { postValidation } from './validations/postValidation.js'
import express from 'express'
import mongoose from 'mongoose'
import multer from 'multer'

// {Connect DB}
mongoose
	.connect(
		'mongodb+srv://admin:12345@cluster0.zggy3mw.mongodb.net/?retryWrites=true&w=majority'
	)
	.then(() => {
		console.log('Server DB connect') // if successful - > write success
	})
	.catch((err) => {
		console.log(err, 'Server DB connect error') // if error -> write error
	})
const app = express() //return result function express
const port = 4000 // it is port
app.use(express.json())
app.use('/uploads', express.static('uploads'))

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'uploads') //file path
	},
	filename: (req, file, cb) => {
		cb(null, file.originalname) // file name
	},
})
const upload = multer({ storage })

// {User}
//(1) Created User
app.post('/auth/register', registerValidation, userControllers.register) // req -> запрос res -> ответ
//(2) Login User
app.post('/auth/login', loginValidation, userControllers.login) // --> login
//(3) Get Data Profile User
app.get('/auth/profile', checkAuth, userControllers.getMe)

//{UploadImg}
app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
	res.json({
		url: `/uploads/${req.file.originalname}`,
	})
})

// {Post}
//(1) Created Post
app.post('/post', checkAuth, postValidation, postControllers.createdNewPost)
//(2) Get All Posts
app.get('/post', postControllers.getAllPosts)
//(3) Remove Post
app.delete('/post/:id', checkAuth, postControllers.deletePost)
//(4) Update Post
app.patch('/post/:id', checkAuth, postValidation, postControllers.updatePost)
//(5) Get Single Post
app.get('/post/:id', postControllers.getSinglePost)

app.listen(port, (err) => {
	if (err) return console.log(`Error server ${err}`)
	console.log('The server was successfully started')
})
