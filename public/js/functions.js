/**
 * This Function Will Render Post Card HTML in The Blog Page
 * @param {object} post
 */
function render_post_card_html(post) {
  let html = ''
  html += '<article class="post">'
  html += '<div class="picture">'
  html += '<img src="/images/' + post.picture + '">'
  html += '</div>'
  html += '<div class="title">'
  html += '<a href="/posts/' + post.slug + '">' + post.title + '</a>'
  html += '</div>' // Close .title div
  html += '</article>' // Close .article div

  document.querySelector('.blog .posts').innerHTML += html
}


/**
 * This Function Will Render Post Table Rows HTML in The Dashboard Page
 * @param {object} post
 */
function render_post_table_html(post, id) {

  let html = '<tr>'
  html += '<td>' + format_number(id) + '</td>'
  html += '<td><a href="/posts/' + post.slug + '">' + post.title + '</a></td>'
  html += '<td><a class="edit" href="/edit_post/' + post.slug + '">Edit Post</a></td>'
  html += '<td><form method="post" onsubmit="delete_post(' + post.id + '); return false">'
  html += '<button type="submit">Delete Post</button>'
  html += '</form></td>'
  html += '</tr>'

  document.querySelector('.dashboard table tbody').innerHTML += html
}

/**
 * This Function Will Render Edit Post Form HTML in The Edit Post Page
 * @param {object} post
 */
function render_edit_post_form_html(post) {

  let html = '<form enctype="multipart/form-data" method="post" onsubmit="update_post(this, ' + post.id + '); return false">'

  html += '<div class="input-gp">'
  html += '<label for="title">Title :</label>'
  html += '<input type="text" name="title" placeholder="Post Title ..." value="' + post.title + '" id="title">'
  html += '</div>' // Close .input-gp div

  html += '<div class="input-gp">'
  html += '<label for="picture">Picture :</label>'
  html += '<input type="file" name="picture" id="picture">'
  html += '</div>' // Close .input-gp div

  html += '<div class="input-gp">'
  html += '<label for="content">Content :</label>'
  html += '<textarea type="text" name="content" placeholder="Post Content ..." id="content">' + post.content + '</textarea>'
  html += '</div>' // Close .input-gp div

  html += '<button type="submit">Update Post</button>'
  html += '</form>'

  document.querySelector('.edit-form').innerHTML += html
}

/**
 * This Function Will Render Single Post HTML
 * @param {object} post
 */
function render_single_post_html(post) {

  let html = '<h1 class="title">' + post.title + '</h1>'
  html += '<div class="picture"><img src="/images/' + post.picture + '" ></div>'
  html += '<div class="content">' + post.content + '</div>'

  document.querySelector('.single-post').innerHTML += html
}

/**
 * This Function Will Show Welcome Message in The Dashboard
 * @param {object} post
 */
function say_welcome(username) {
  document.querySelector('.dashboard .welcome .msg').innerHTML = 'Welcome ' + username + ' ^_^'
}

/**
 * This Function Will Add a 0 to The Numbers Less Than 9 To Become '09'
 * @param {integer} n 
 */
function format_number(n) {
  // Check if The Number is Less Than 9
  if (n <= 9) {
    // Add 0 to The Number To be Like '01', '02' ... '09' 
    return '0' + n.toString()
  }

  // If The Number is More Than 9 Let it
  return n.toString()
}