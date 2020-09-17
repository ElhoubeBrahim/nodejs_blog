function slugger(txt) {
  if (typeof txt != "undefined") {
    // Set The Output
    let slug = ''
    // Get Chars Thant Will Not Exist in The Slug
    let forbidden_chars = '\`~!@#$%^&*()[{]}\\|;:\'",.<>/?'.split('')
    // Start Slugifying
    txt = txt.toLowerCase()
    txt = txt.trim()
    // Check and Remove Forbidden Chars
    for (let i = 0; i < txt.length; i++) {
      if (forbidden_chars.indexOf(txt[i]) === -1) {
        slug += txt[i]
      }
    }
    // Output The Slug
    return slug.replace(/\s+/g, '-')
  } else {
    return ''
  }
}

module.exports = slugger