const router = require("express").Router();
const { Post, User, Comment } = require("../models");
const withAuth = require("../utils/auth");
// Start by creating the models (User.js, Comment.js, Post.js)
// Once you have created the models, create the associations in the index.js of the models folder
// Finish the routes in the controllers/api folder (POST, PUT, DELETE operations for User, Post, Comment)
// The comment route just needs a POST route.
// Write the code for the server.js, schema.sql, .env
// Once you have finished the API folder, you can start to build the front end. At this point, we have all of the backend work done.
// This will entail writing code for the homeRoutes in the controllers folder, creating the handlebars in the views folder, and lastly, writing the public folder javascript to run fetches to your backend (api folder).
// homepage route, single post route, dashboard route, edit post route login route signup route
router.get("/", async (req, res) => {
  try {
    // Get all projects and JOIN with user data
    const postData = await Post.findAll({
      include: [
        {
          model: User,
          attributes: ["name"],
        },
      ],
    });

    // Serialize data so the template can read it
    const posts = postData.map((post) => post.get({ plain: true }));

    // Pass serialized data and session flag into template
    res.render("homepage", {
      posts,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/post/:id", async (req, res) => {
  try {
    const postData = await Post.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ["name"],
        },
      ],
    });

    const commentData = await Comment.findAll({
      where: { post_id: req.params.id },
      include: [
        {
          model: User,
          attributes: ["name"],
        },
      ],
    });
    console.log(commentData);
    const comments = commentData.map((comment) => comment.get({ plain: true }));

    const post = postData.get({ plain: true });

    res.render("post", {
      ...post,
      comments,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err.message);
  }
});

router.get("/edit/:id", withAuth, async (req, res) => {
  try {
    const postData = await Post.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ["name"],
        },
      ],
    });

    const post = postData.get({ plain: true });

    res.render("edit", {
      ...post,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Use withAuth middleware to prevent access to route
router.get("/profile", withAuth, async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ["password"] },
      include: [{ model: Post }],
    });

    const user = userData.get({ plain: true });

    res.render("profile", {
      ...user,
      logged_in: true,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/login", (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect("/profile");
    return;
  }

  res.render("login");
});

module.exports = router;
