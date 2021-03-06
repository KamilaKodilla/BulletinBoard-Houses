const express = require('express');
const router = express.Router();

const Post = require('../models/post.model');

function escape(html) {
  return html
    .replace(/&/g, "")
    .replace(/</g, "")
    .replace(/>/g, "")
    .replace(/"/g, "")
    .replace(/'/g, "");
}

router.get('/posts', async (req, res) => {
  try {
    const result = await Post
      .find({status: 'published'})
      .select('author created updated title photo')
      .sort({created: -1});
    if(!result) res.status(404).json({ post: 'Not found' });
    else res.json(result);
  }
  catch(err) {
    res.status(500).json(err);
  }
});

router.get('/posts/:id', async (req, res) => {
  try {
    const result = await Post
      .findById(req.params.id);
    if(!result) res.status(404).json({ post: 'Not found' });
    else res.json(result);
  }
  catch(err) {
    res.status(500).json(err);
  }
});

router.post('/posts/add', async (req, res) => {
  try {
    const {
      author,
      created,
      updated,
      status,
      title,
      text,
      photo,
      price,
      phone,
      location,
    } = req.body;
    const pattern = new RegExp(
      /(<\s*(strong|em)*>(([A-z]|\s)*)<\s*\/\s*(strong|em)>)|(([A-z]|\s|\.)*)/,
      "g"
    );
    const titleMatched = (title.match(pattern) || []).join("");
    const textMatched = (author.match(pattern) || []).join("");
    const locationMatched = (location.match(pattern) || []).join("");
    const emailPattern = new RegExp(
      '^[a-zA-Z0-9][a-zA-Z0-9_.-]+@[a-zA-Z0-9][a-zA-Z0-9_.-]+.{1,3}[a-zA-Z]{2,4}'
    );
    const validatedEmail = emailPattern.test(author);

    if (titleMatched.length < title.length)
      throw new Error('Invalid characters in the title...');

    if (textMatched.length < text.length)
      throw new Error('Invalid characters in the title...');

    if (location && locationMatched.length < location.length)
      throw new Error('Invalid characters in the location...');

    if (!validatedEmail) throw new Error('Wrong email!');

    if (text.length < 20 || title.length < 10)
      throw new Error('The text is too short');

      if (title && text && author && status) {
      const newPost = new Post({
        author: author,
        created: created,
        updated: updated,
        status: status,
        title: escape(title),
        text: escape(text),
        photo: photo,
        price: price,
        phone: phone,
        location: escape(location),
      });
      await newPost.save();
      res.json({ message: 'OK' });
    } else {
      throw new Error('Wrong input!');
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put('/posts/:id/edit', async (req, res) => {
  try {
    const {
      author,
      created,
      updated,
      status,
      title,
      text,
      photo,
      price,
      phone,
      location,
    } = req.body;

    const emailPattern = new RegExp(
      '^[a-zA-Z0-9][a-zA-Z0-9_.-]+@[a-zA-Z0-9][a-zA-Z0-9_.-]+.{1,3}[a-zA-Z]{2,4}'
    );
    const validatedEmail = emailPattern.test(author);
    if (!validatedEmail) throw new Error('Wrong email!');
    if (text.length < 20 || title.length < 10)
      throw new Error('The text is too short');

    if (title && text && author && status) {
      const postToEdit = await Post.findById(req.params.id);
      if (postToEdit) {
        const changedPost = await Post.updateOne(
          { _id: req.params.id },
          {
            $set: {
              author: author,
              created: created,
              updated: updated,
              status: status,
              title: escape(title),
              text: escape(text),
              photo: photo,
              price: price,
              phone: phone,
              location: escape(location),
            },
          }
        );
        res.json(changedPost);
      } else {
        throw new Error('Wrong input!');
      }
    } else res.status(404).json({ message: 'Not found...' });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

module.exports = router;
