// Import Express Module
const express = require('express')
const route = express.Router()

// Import DB Connection Module
const connection = require('../../database/connection')

// Import Some Helpful Modules
const path = require('path')
const fs = require('fs')
const sanitizer = require('sanitize-html')

// Import my Own Simple Modules
const slugger = require('../../my_modules/slugger')
const random = require('../../my_modules/random')

/*

Posts Apis
  1 => /api/posts/add         : POST : Auth
  2 => /api/posts/update/id   : POST : Auth
  3 => /api/posts/delete/id   : POST : Auth
  4 => /api/posts             : GET
  5 => /api/posts/id          : GET

*/

// Get All Posts Router
route.get('/', (req, res) => {
  // Prepare SQL Statement
  let sql = "SELECT * FROM posts"
  // Execute Query
  connection.query(sql, (err, posts) => {
    // if There is Error
    if (err) {
      res.status(500).json({
        status: 0,
        msg: 'Oooops! There is Some Error While Fetching Posts. Please Try Again Later',
        err: err
      })
      return
    }
    // if There is Posts
    if (posts.length > 0) {
      // Return Posts and Success Message
      res.json({
        posts: posts,
        status: 1,
        msg: 'Posts Fetched Successfully'
      })
    } else {
      res.json({
        status: 0,
        msg: 'There is No Posts in The Database, Please Create One'
      })
    }
  })
})

// Get Single Post Router
route.get('/:slug', (req, res) => {
  // Get The Slug From The URL
  let slug = req.params.slug
  // Prepare SQL Syntax
  let sql = "SELECT * FROM posts WHERE slug = ?"
  // Execute Query
  connection.query(sql, slug, (err, post) => {
    // if There is Error
    if (err) {
      res.status(500).json({
        status: 0,
        msg: 'Oooops! There is Some Error While Fetching Posts. Please Try Again Later',
        err: err
      })
      return
    }
    // If There is Post
    if (post.length > 0) {
      // Return The Post
      res.json({
        post: post[0],
        status: 1,
        msg: 'Post Fetched Successfully'
      })
    } else {
      // Return 404 Post Not Found Error
      res.status(404).json({
        status: 0,
        msg: 'Post Not Found'
      })
    }
  })
})

// Add New Post Router
route.post('/add', (req, res) => {
  // If User is Logged in
  if (req.session.loggedin) {
    // Get Sent Data
    let post = {
      title: sanitizer(req.body.title),
      slug: slugger(sanitizer(req.body.title)),
      picture: req.files ? req.files.picture : false,
      content: sanitizer(req.body.content)
    }

    let errors = []

    // Validate Post Title
    if (post.title == '' || post.title.length <= 5) {
      errors.push({
        key: 'title',
        msg: 'Title Must Be More Than 5 Characters'
      })
    }

    // Validate Post Content
    if (post.content == '' || post.content.length <= 10) {
      errors.push({
        key: 'content',
        msg: 'Title Must Be More Than 10 Characters'
      })
    }

    // Validate Picture
    if (!post.picture || Object.keys(post.picture).length === 0 || post.picture.mimetype.substring(0, 5) != 'image') {
      errors.push({
        key: 'picture',
        msg: 'Please Upload a Picture'
      })
    }

    if (errors.length > 0) {
      res.json({
        status: 0,
        errors: errors
      })
      return
    } else {

      let rename_to = 'post_' + Date.now() + '_' + random(10) + path.parse(post.picture.name).ext
      post.picture.mv(path.join(__dirname, '..', '..', 'public', 'images', rename_to), (err) => {
        if (err) {
          res.status(500).json({
            status: 0,
            msg: 'Oooops! There is Some Error While Uploading Post Picture. Please Try Again Later',
            err: err
          })
          return
        }

        post.picture = rename_to

        // Prepare SQL Statement
        let sql = "INSERT INTO posts SET ?"

        // Execute Query
        connection.query(sql, post, (err) => {
          // if There is Error
          if (err) {
            res.status(500).json({
              status: 0,
              msg: 'Oooops! There is Some Error While Adding Post. Please Try Again Later',
              err: err
            })
            return
          }
          // Return Success Message
          res.json({
            status: 1,
            msg: 'Post Added Successfully'
          })
        })
      })
    }
  } else {
    res.status(401).json({
      status: 0,
      msg: 'Unauthorized Request'
    })
  }
})

// Update Post Router
route.post('/update/:id', (req, res) => {
  if (req.session.loggedin) {
    // Get The Target Post ID
    let id = parseInt(req.params.id)
    // Get Sent Data
    let data = {
      title: sanitizer(req.body.title),
      slug: slugger(req.body.title),
      picture: req.files ? req.files.picture : false,
      content: sanitizer(req.body.content)
    }

    // Check if Post Exists
    // Prepare SQL Syntax
    let sql = "SELECT * FROM posts WHERE id = ?"
    // Execute Query
    connection.query(sql, id, (err, post) => {
      // if There is Error
      if (err) {
        res.status(500).json({
          status: 0,
          msg: 'Oooops! There is Some Error While Fetching Posts. Please Try Again Later',
          err: err
        })
        return
      }
      // If There is Post
      if (post.length > 0) {

        // Validate Data
        let errors = []

        // Validate Post Title
        if (data.title == '' || data.title.length <= 5) {
          errors.push({
            key: 'title',
            msg: 'Title Must Be More Than 5 Characters'
          })
        }

        // Validate Post Content
        if (data.content == '' || data.content.length <= 10) {
          errors.push({
            key: 'content',
            msg: 'Title Must Be More Than 10 Characters'
          })
        }

        // Validate Post Picture
        if (data.picture && data.picture.mimetype.substring(0, 5) != 'image') {
          errors.push({
            key: 'picture',
            msg: 'Please Upload an Image'
          })
        }

        // If There is Errors in Validation
        if (errors.length > 0) {
          res.json({
            status: 0,
            errors: errors
          })
          return
        } else {

          // If a Picture Was Uploaded
          if (data.picture) {
            // Upload Picture
            let rename_to = 'post_' + Date.now() + '_' + random(10) + path.parse(data.picture.name).ext
            data.picture.mv(path.join(__dirname, '..', '..', 'public', 'images', rename_to), (err) => {
              if (err) {
                res.status(500).json({
                  status: 0,
                  msg: 'Oooops! There is Some Error While Uploading Post Picture. Please Try Again Later',
                  err: err
                })
                return
              }

              data.picture = rename_to

              // Delete Old Picture
              delete_picture(id)

              // Update Post
              update_post(req, res, data, id)
            })
          } else {
            data.picture = post[0].picture

            // Update Post
            update_post(req, res, data, id)
          }
        }
      } else {
        // Return 404 Post Not Found Error
        res.status(404).json({
          status: 0,
          msg: 'Post Not Found'
        })
      }
    })
  } else {
    res.status(401).json({
      status: 0,
      msg: 'Unauthorized Request'
    })
  }
})

// Delete Post Router
route.post('/delete/:id', (req, res) => {
  if (req.session.loggedin) {
    let id = req.params.id

    delete_picture(id)

    let sql = "DELETE FROM posts WHERE id = ?"

    connection.query(sql, id, (err, result) => {
      // if There is Error
      if (err) {
        res.status(500).json({
          status: 0,
          msg: 'Oooops! There is Some Error While Fetching Posts. Please Try Again Later',
          err: err
        })
        return
      }

      res.json({
        status: 1,
        msg: 'Post Deleted Successfully'
      })
    })
  } else {
    res.status(401).json({
      status: 0,
      msg: 'Unauthorized Request'
    })
  }
})

/**
 * This function is userd to update post
 * 
 * @param {object} req 
 * @param {object} res 
 * @param {object} data 
 * @param {number} id 
 */
function update_post(req, res, data, id) {
  // Update The Post
  let sql = "UPDATE posts SET ? WHERE id='" + id + "'"

  connection.query(sql, data, (err, result) => {
    // if There is Error
    if (err) {
      res.status(500).json({
        status: 0,
        msg: 'Oooops! There is Some Error While Updating Post. Please Try Again Later',
        err: err
      })
      return
    }

    // Delete Previous File

    res.json({
      status: 1,
      msg: 'Post Updated Successfully'
    })
  })
}

/**
 * This function is userd to delete a post picture according to its id
 * 
 * @param {number} id 
 */
function delete_picture(id) {
  let sql = 'SELECT * from posts WHERE id=?'
  connection.query(sql, id, (err, post) => {
    if (err) throw err
    fs.unlink(path.join(__dirname, '..', '..', 'public', 'images', post[0].picture), (err) => {
      if (err) throw err
    })
  })
}

// Export routing system
module.exports = route