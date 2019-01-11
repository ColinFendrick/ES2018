fetch('http://www.google.com').then(res => {
  console.log(res)
}).catch(err => {
  console.log(err)
}).finally(() => {
  document.querySelector('#spinner').style.display = 'none'
})