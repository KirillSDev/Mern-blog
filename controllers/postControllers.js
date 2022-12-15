import PostModel from '../models/PostModel.js'

//Created Post
export const createdNewPost = async (req, res) => {
	try {
		const doc = new PostModel({
			title: req.body.title,
			text: req.body.text,
			tags: req.body.tags,
			imageUrl: req.body.imageUrl,
			user: req.userId,
		})
		const post = await doc.save()
		res.json(post)
	} catch (err) {
		console.log(`Error - ${err}`)
		res.status(500).json({
			message: 'Error',
		})
	}
}
// Get All Posts
export const getAllPosts = async (req, res) => {
	try {
		const posts = await PostModel.find().populate('user').exec()
		console.log(posts)
		res.json({ posts })
	} catch (err) {
		console.log(`Error - ${err}`)
		res.status(500).json({
			message: 'Ops...',
		})
	}
}

// Get Single Post
export const getSinglePost = async (req, res) => {
	try {
		const postId = await req.params.id //get id post
		PostModel.findByIdAndUpdate(
			{
				_id: postId,
			},
			{
				$inc: { viewsCount: 1 },
			},
			{
				returnDocument: 'after',
			},
			(err, doc) => {
				if (err) {
					console.log(err)
					res.status(500).json({
						message: 'Ops...',
					})
				}

				if (!doc) {
					console.log(err)
					return res.status(404).json({
						message: 'Ops...',
					})
				}
				res.json(doc)
			}
		)
	} catch (err) {
		console.log(`Error - ${err}`)
		res.status(500).json({
			message: 'Ops...',
		})
	}
}
// Remove Post
export const deletePost = async (req, res) => {
	try {
		const postId = await req.params.id
		await PostModel.findByIdAndDelete(
			{
				_id: postId,
			},
			(err, doc) => {
				if (err) {
					console.log(err)
					res.status(500).json({
						message: 'Ops...',
					})
				}

				if (!doc) {
					console.log(err)
					return res.status(404).json({
						message: 'Ops...',
					})
				}
				res.json({ success: true })
			}
		)
	} catch (err) {
		console.log(`Error - ${err}`)
		res.status(500).json({
			message: 'Ops...',
		})
	}
}
//Update Post
export const updatePost = async (req, res) => {
	try {
		const postId = await req.params.id
		await PostModel.updateOne(
			{
				_id: postId,
			},
			{
				title: req.body.title,
				text: req.body.text,
				tags: req.body.tags,
				imageUrl: req.body.imageUrl,
				user: req.userId,
			}
		)
		res.json({
			success: true,
		})
		console.log(req)
	} catch (err) {
		console.log(`Error - ${err}`)
		res.status(500).json({
			message: 'Ops...',
		})
	}
}
