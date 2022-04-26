document.querySelectorAll('.collapsible__button').forEach(button => {
  button.addEventListener('click', () => {
    button.classList.toggle('collapsible__button--active')
  })
})
