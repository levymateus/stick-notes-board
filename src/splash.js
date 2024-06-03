(function() {
  const el = document.getElementById('progress')
  document.getElementById('root').style.visibility = 'hidden'
  document.title = `Stick notes | ${el.value}%`
  let i = null
  window.addEventListener('DOMContentLoaded', function() {
    el.value = 100;
    window.clearInterval(i)
    document.title = `Stick notes`
    document.getElementById('root').style.visibility = 'visible'
    el.remove()
  })
  i = window.setInterval(function() {
    if (el.value < 100) {
      el.value += 10;
      document.title = `Stick notes | ${el.value}%`
    } else {
      el.remove()
      document.getElementById('root').style.visibility = 'visible'
    }
  }, 1000)
})()