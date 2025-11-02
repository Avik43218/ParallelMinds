// Pagination variables
let currentPage = 1
let cardsPerPage = 6
let filteredCards = []

// Toggle card details
function toggleDetails(button) {
  const details = button.nextElementSibling
  const isVisible = details.style.display !== "none"

  details.style.display = isVisible ? "none" : "block"
  button.textContent = isVisible ? "Show Details" : "Hide Details"
}

// Search functionality
const searchInput = document.getElementById("searchInput")
const sortSelect = document.getElementById("sortSelect")
const limitSelect = document.getElementById("limitSelect")
const applicantCards = document.querySelectorAll(".applicant-card")

searchInput.addEventListener("input", filterApplicants)
sortSelect.addEventListener("change", sortApplicants)
limitSelect.addEventListener("change", changeCardsPerPage)

function filterApplicants() {
  const searchTerm = searchInput.value.toLowerCase()
  const clearBtn = document.getElementById("clearSearchBtn")

  // Show/hide clear button
  clearBtn.style.display = searchTerm ? "block" : "none"

  filteredCards = []

  applicantCards.forEach((card) => {
    const name = card.dataset.name.toLowerCase()
    const email = card.dataset.email.toLowerCase()

    const skillTags = card.querySelectorAll(".skill-tag")
    let skillMatches = false
    skillTags.forEach((tag) => {
      if (tag.textContent.toLowerCase().includes(searchTerm)) {
        skillMatches = true
      }
    })

    if (name.includes(searchTerm) || email.includes(searchTerm) || skillMatches) {
      filteredCards.push(card)
    }
  })

  currentPage = 1
  displayPage()
  updateSearchResultsCount()
}

function updateSearchResultsCount() {
  const resultsCount = document.getElementById("searchResultsCount")
  const totalCards = filteredCards.length > 0 ? filteredCards : Array.from(applicantCards)

  if (searchInput.value) {
    resultsCount.textContent = `${filteredCards.length} result${filteredCards.length !== 1 ? "s" : ""}`
    resultsCount.style.display = "inline"
  } else {
    resultsCount.style.display = "none"
  }
}

function clearSearch() {
  searchInput.value = ""
  document.getElementById("clearSearchBtn").style.display = "none"
  document.getElementById("searchResultsCount").style.display = "none"
  filterApplicants()
}

function sortApplicants() {
  const sortValue = sortSelect.value

  filteredCards.sort((a, b) => {
    const matchA = Number.parseInt(a.dataset.match)
    const matchB = Number.parseInt(b.dataset.match)

    switch (sortValue) {
      case "match-desc":
        return matchB - matchA
      case "match-asc":
        return matchA - matchB
      default:
        return 0
    }
  })

  displayPage()
}

function changeCardsPerPage() {
  const value = limitSelect.value
  cardsPerPage = value === "0" ? filteredCards.length : Number.parseInt(value)
  currentPage = 1
  displayPage()
}

function displayPage() {
  const grid = document.querySelector(".applicants-grid")
  const totalCards = filteredCards.length > 0 ? filteredCards : Array.from(applicantCards)

  // Hide all cards
  applicantCards.forEach((card) => {
    card.style.display = "none"
  })

  const totalPages = cardsPerPage === 0 ? 1 : Math.ceil(totalCards.length / cardsPerPage)
  const startIndex = (currentPage - 1) * cardsPerPage
  const endIndex = cardsPerPage === 0 ? totalCards.length : startIndex + cardsPerPage

  // Show cards for current page
  const cardsToShow = totalCards.slice(startIndex, endIndex)
  cardsToShow.forEach((card) => {
    card.style.display = ""
  })

  // Update pagination controls
  updatePaginationControls(totalPages, totalCards.length)
}

function updatePaginationControls(totalPages, totalCards) {
  const prevBtn = document.getElementById("prevBtn")
  const nextBtn = document.getElementById("nextBtn")
  const pageInfo = document.getElementById("pageInfo")

  prevBtn.disabled = currentPage === 1
  nextBtn.disabled = currentPage === totalPages || totalPages === 0

  if (cardsPerPage === 0) {
    pageInfo.textContent = `Showing all ${totalCards} resumes`
  } else {
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`
  }
}

function nextPage() {
  const totalCards = filteredCards.length > 0 ? filteredCards : Array.from(applicantCards)
  const totalPages = cardsPerPage === 0 ? 1 : Math.ceil(totalCards.length / cardsPerPage)

  if (currentPage < totalPages) {
    currentPage++
    displayPage()
  }
}

function previousPage() {
  if (currentPage > 1) {
    currentPage--
    displayPage()
  }
}

function downloadResume(event, applicantName, resumePath) {
  event.preventDefault()

  fetch("/api/download-resume", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      file_path: resumePath,
      applicant_name: applicantName,
    }),
  })
    .then((response) => {
      if (response.ok) {
        return response.blob()
      }
      throw new Error("Failed to download resume")
    })
    .then((blob) => {
      // Create blob URL and download
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `${applicantName.replace(/\s+/g, "_")}_resume`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      console.log(`Downloaded resume for ${applicantName}`)
    })
    .catch((error) => {
      console.error(`Error downloading resume: ${error.message}`)
      alert("Failed to download resume. Please try again.")
    })
}

function showDetailsModal(event, name, contact, email, appliedDate, matchPercentage, matchedCount, totalSkills) {
  event.preventDefault()

  // Populate modal with applicant data
  document.getElementById("modalName").textContent = name
  document.getElementById("modalContact").textContent = contact
  document.getElementById("modalEmail").textContent = email
  document.getElementById("modalAppliedDate").textContent = appliedDate
  document.getElementById("modalMatch").textContent = `${matchPercentage}%`
  document.getElementById("modalMatchedSkills").textContent = `${matchedCount}/${totalSkills}`

  // Display modal
  document.getElementById("detailsModal").style.display = "flex"

  console.log(`Opened details modal for ${name}`)
}

function closeDetailsModal() {
  document.getElementById("detailsModal").style.display = "none"
}

window.addEventListener("click", (event) => {
  const modal = document.getElementById("detailsModal")
  if (event.target === modal) {
    modal.style.display = "none"
  }
})

// Add fade-in animation
const style = document.createElement("style")
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
`
document.head.appendChild(style)

window.addEventListener("load", () => {
  filteredCards = Array.from(applicantCards)
  currentPage = 1
  displayPage()
})
