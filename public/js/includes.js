function get_header() {
  var request_header = new XMLHttpRequest()
  request_header.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var header = this.responseText
      var body = document.querySelector('body').innerHTML
      document.querySelector('body').innerHTML = header + body
    }
  }
  request_header.open('GET', '/get_header', true)
  request_header.send()
}

function get_footer() {
  var request_header = new XMLHttpRequest()
  request_header.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var body = document.querySelector('body').innerHTML
      var footer = this.responseText
      document.querySelector('body').innerHTML = body + footer
    }
  }
  request_header.open('GET', '/get_footer', true)
  request_header.send()
}