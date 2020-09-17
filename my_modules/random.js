function random(size) {
  let final = []
  for (let i = 0; i < size; i++) {
    final.push(Math.floor(Math.random() * 10))
  }
  return final.join('')
}

module.exports = random