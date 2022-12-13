import express from 'express'
import mongoose from 'mongoose'

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

app.post('/auth/register', (req, res) => {}) // req -> запрос res -> ответ

app.listen(port, (err) => {
	if (err) return console.log(`Error server ${err}`)
	console.log('The server was successfully started')
})
