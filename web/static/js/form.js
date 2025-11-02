document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form")
  const fileInput = document.querySelector('input[type="file"]')
  const dropZone = document.querySelector(".drop-zone")

  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
  ]
  const maxFileSize = 5 * 1024 * 1024 // 5MB

  // File validation function
  function validateFile(file) {
    const errors = []

    if (!allowedTypes.includes(file.type)) {
      errors.push("Invalid file type. Please upload PDF, DOC, DOCX, or TXT files only.")
    }

    if (file.size > maxFileSize) {
      errors.push("File size exceeds 5MB limit.")
    }

    return errors
  }

  // Handle file selection
  if (fileInput) {
    fileInput.addEventListener("change", (e) => {
      const file = e.target.files[0]
      if (file) {
        const errors = validateFile(file)
        if (errors.length > 0) {
          alert(errors.join("\n"))
          fileInput.value = ""
        }
      }
    })
  }

  // Form submission validation
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault()

      const nameInput = form.querySelector('input[name="name"]')
      const contactInput = form.querySelector('input[name="contact"]')
      const emailInput = form.querySelector('input[name="email"]')
      const fileInput = form.querySelector('input[type="file"]')

      const errors = []

      // Validate name
      if (!nameInput.value.trim()) {
        errors.push("Name is required.")
      }

      // Validate contact
      if (!contactInput.value.trim()) {
        errors.push("Contact information is required.")
      }

      // Validate email
      if (!emailInput.value.trim()) {
        errors.push("Email is required.")
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) {
        errors.push("Please enter a valid email address.")
      }

      // Validate file
      if (!fileInput.files[0]) {
        errors.push("Please upload a resume or document.")
      } else {
        const fileErrors = validateFile(fileInput.files[0])
        errors.push(...fileErrors)
      }

      if (errors.length > 0) {
        alert(errors.join("\n"))
        return
      }

      // If validation passes, submit the form
      form.submit()
    })
  }

  // Drag and drop functionality
  if (dropZone) {
    dropZone.addEventListener("dragover", (e) => {
      e.preventDefault()
      dropZone.classList.add("drag-over")
    })

    dropZone.addEventListener("dragleave", () => {
      dropZone.classList.remove("drag-over")
    })

    dropZone.addEventListener("drop", (e) => {
      e.preventDefault()
      dropZone.classList.remove("drag-over")

      const files = e.dataTransfer.files
      if (files.length > 0) {
        const file = files[0]
        const errors = validateFile(file)

        if (errors.length > 0) {
          alert(errors.join("\n"))
          return
        }

        fileInput.files = files
        updateFileDisplay(file)
      }
    })
  }

  // Update file display
  function updateFileDisplay(file) {
    if (fileInput) {
      fileInput.value = ""
      const dataTransfer = new DataTransfer()
      dataTransfer.items.add(file)
      fileInput.files = dataTransfer.files
    }
  }
})
