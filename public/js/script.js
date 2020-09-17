var errors = [] // Used by get_error Function

/**
 * This Function Will Get All Posts By Sending an AJAX Request To The posts Api
 * Then Will Render HTML According To The render_in Parameter
 * @param {string} render_in 
 */
function get_all_posts(render_in = 'blog') {
  // Create The Request
  let request = new XMLHttpRequest()
  request.onreadystatechange = function () {
    // If The Request is Set and The Response is Ready
    if (this.readyState == 4 && this.status != 500) {
      //  Get The Result
      let result = JSON.parse(this.responseText)
      // If There is No Error in The Api
      if (result.status) {
        // Get All Posts
        let posts = result.posts
        // Check Where To Fetch Posts
        switch (render_in) {
          case 'blog':
            // Render Posts in '/blog' and '/' Routes
            posts.forEach(post => {
              render_post_card_html(post)
            });
            break;

          case 'dashboard':
            let n = 1
            // Render Posts in '/dashboard' Route
            posts.forEach(post => {
              render_post_table_html(post, n)
              n++
            });
            break;

          default:
            posts.forEach(post => {
              render_post_card_html(post.title, post.slug, post.picture)
            });
            break;
        }
      } else {
        alert(result.msg)
      }
    } else if (this.status == 500) {
      location.replace('/500')
    }
  }

  // Send The Request
  request.open('GET', '/api/posts/', true)
  request.send()
}

/**
 * This Function Will Get Single Post By Sending an AJAX Request To The post Api
 * @param {string} render_in 
 */
function get_single_post(slug, render_in = 'single-post') {
  // Create The Request
  let request = new XMLHttpRequest()
  request.onreadystatechange = function () {
    // If The Request is Set and The Response is Ready
    if (this.readyState == 4 && this.status != 500) {
      //  Get The Result
      let result = JSON.parse(this.responseText)
      // If There is No Error in The Api
      if (result.status) {
        let post = result.post
        switch (render_in) {
          case 'single-post':
            render_single_post_html(post)
            break;

          case 'edit-post':
            render_edit_post_form_html(post)
            break;

          default:
            render_single_post_html(post)
            break;
        }
      } else {
        alert(result.msg)
        location.replace('/')
      }
    } else if (this.status == 500) {
      location.replace('/500')
    }
  }

  // Send The Request
  request.open('GET', '/api/posts/' + slug, true)
  request.send()
}

/**
 * This Function Will Send a Request to The Add Post Api
 * With Information Sent By User
 * @param {*} form 
 */
function add_new_post(form) {
  // Get Post Sent info
  let post = new FormData()
  post.append('title', form['title'].value)
  post.append('picture', form['picture'].files[0])
  post.append('content', form['content'].value)

  // Create AJAX Request
  let request = new XMLHttpRequest()
  request.onreadystatechange = function () {
    // If The Request is Sent and The Response is Ready
    if (this.readyState == 4 && this.status != 500) {
      let response = JSON.parse(this.responseText)
      if (response.status) {
        alert(response.msg)
        location.replace('/dashboard')
      } else {
        // Remove All Previous Error Nodes
        let error_nodes = document.querySelectorAll('form .input-gp .error')
        if (typeof error_nodes != "undefined") {
          for (let i = 0; i < error_nodes.length; i++) {
            error_nodes[i].previousElementSibling.classList.remove('invalid')
            error_nodes[i].remove()
          }
        }

        // Display Errors
        response.errors.forEach(error => {
          errors[error.key] = error.msg
          get_error(error.key, error.key)
        });
      }
    } else if (this.status == 500) {
      location.replace('/500')
    }
  }

  // Send The Request
  request.open('POST', '/api/posts/add', true)
  request.send(post)
}

/**
 * This Function Will Send a Request to The Update Post Api
 * With Information Sent By User
 * @param {*} form
 */
function update_post(form, id) {
  let post = new FormData()
  post.append('title', form['title'].value)
  post.append('picture', form['picture'].files[0])
  post.append('content', form['content'].value)

  // Create AJAX Request
  let request = new XMLHttpRequest()
  request.onreadystatechange = function () {
    // If The Request is Sent and The Response is Ready
    if (this.readyState == 4 && this.status != 500) {
      let response = JSON.parse(this.responseText)
      if (response.status) {
        alert(response.msg)
        location.replace('/dashboard')
      } else {
        // Remove All Previous Error Nodes
        let error_nodes = document.querySelectorAll('form .input-gp .error')
        if (typeof error_nodes != "undefined") {
          for (let i = 0; i < error_nodes.length; i++) {
            error_nodes[i].previousElementSibling.classList.remove('invalid')
            error_nodes[i].remove()
          }
        }

        // Display Errors
        response.errors.forEach(error => {
          errors[error.key] = error.msg
          get_error(error.key, error.key)
        });
      }
    } else if (this.status == 500) {
      location.replace('/500')
    }
  }

  // Send The Request
  request.open('POST', '/api/posts/update/' + id, true)
  request.send(post)
}

/**
 * This Function Will Send a Request to The Delete Post Api
 * @param {*} form
 */
function delete_post(id) {

  // Create AJAX Request
  let request = new XMLHttpRequest()
  request.onreadystatechange = function () {
    // If The Request is Sent and The Response is Ready
    if (this.readyState == 4 && this.status != 500) {
      let response = JSON.parse(this.responseText)
      if (response.status) {
        alert(response.msg)
        location.reload()
      }
    } else if (this.status == 500) {
      location.replace('/500')
    }
  }

  // Send The Request
  request.open('POST', '/api/posts/delete/' + id, true)
  request.send()
}

/**
 * This Function Will Send a Request to The Login User Api
 * @param {*} form
 */
function login(form) {
  // Get Sent Data
  let data = {
    email: form['email'].value,
    password: form['password'].value
  }

  // Create Ajax Request
  let request = new XMLHttpRequest()
  request.onreadystatechange = function () {
    // If Request is Sent and Response is Ready
    if (this.readyState && this.status == 200) {
      // Get The Response From The Api
      let response = JSON.parse(this.responseText)

      // If There is No Error in The Api
      if (response.status) {
        // Get User info
        let user = response.user

        // Redirect to The Dashboard
        location.replace('/dashboard')
      } else {
        // Remove All Previous Error Nodes
        let error_nodes = document.querySelectorAll('form .input-gp .error')
        if (typeof error_nodes != "undefined") {
          for (let i = 0; i < error_nodes.length; i++) {
            error_nodes[i].previousElementSibling.classList.remove('invalid')
            error_nodes[i].remove()
          }
        }

        // Display Errors
        errors[response.key] = response.msg
        get_error(response.key, response.key)
      }
      // If There is Errors on The Server
    } else if (this.status == 500) {
      location.replace('/500')
    }
  }
  // Send The Request
  request.open('POST', '/api/users/login', true)
  request.setRequestHeader('Content-Type', 'application/json')
  request.send(JSON.stringify(data))
}

/**
 * This Function Will Create Error Nodes After Every invalid input
 * Using The Errors Array Declared in The First Line On This File
 * @param {string} field 
 * @param {string} key 
 */
function get_error(field, key) {
  // Get Main Nodes El
  let el = document.querySelector('#' + field)
  // Show The Error
  if (errors[key] && typeof el != 'undefined') {
    el.classList.add('invalid')
    el.parentElement.innerHTML += '<div class="error">' + errors[key] + '</div>'
  }
}