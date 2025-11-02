// Success page animation and interaction logic

document.addEventListener("DOMContentLoaded", () => {
  // Add subtle animation on page load
  const card = document.querySelector(".success-card")
  card.style.animation = "slideUp 0.6s ease-out"

  // Add click handlers to buttons with smooth transitions
  const buttons = document.querySelectorAll(".btn")
  buttons.forEach((button) => {
    button.addEventListener("mouseenter", function () {
      this.style.transition = "all 0.3s ease"
    })
  })

  // Log success page load (optional analytics)
  console.log("[v0] Success page loaded - form submission confirmed")
})
