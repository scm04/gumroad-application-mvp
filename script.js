// Server URL and helper function to make sending a request easier throughout the rest of the application.
const SERVER = "http://localhost:3000/mvp"

async function sendRequest(endpoint = null, method = "GET", body = null) {
	const URL = `${SERVER}/${endpoint === null ? "" : endpoint}`

	let options = {
		method,
		headers: {
			"content-type": "application/json"
		}
	}
	if (body !== null) options.body = JSON.stringify(body)

	const response = await fetch(URL, options)
	const data = await response.json()
	return data
}

// Once the page is loaded, send a request to the server to retrieve the existing reviews and add everything to the page in its proper location.
addEventListener("load", async () => {
	const data = await sendRequest()

	setAverageRating(data.averageRating)

	updateReviewList(data.reviews)
})

// Allow the "Add Review" button to open the new rating modal.
const addReviewBtn = document.querySelector("#addReviewBtn")
addReviewBtn.addEventListener("click", () => {
	ratingModal.classList.add("open")
	modalOverlay.classList.add("open")
})

// Allow the average rating to be set.
const averageRatingValue = document.querySelector("#averageRatingValue")
const averageRatingStars = document.querySelector("#averageRatingStars")
function setAverageRating(value) {
	averageRatingValue.innerText = value
	clearChildren(averageRatingStars)
	let roundedAverage = Math.round(value)
	setStars(averageRatingStars, roundedAverage)
}

// Allow the contents of the review list to be set.
const reviewsList = document.querySelector("#reviewsList")
function updateReviewList(reviews) {
	// Clear the review list before populating it to avoid duplicates
	clearChildren(reviewsList)

	// Loop through the reviews and add them to the list
	reviews.forEach(({ rating, review }) => {
		// Create the review's row container
		const row = document.createElement("div")

		// Create the star rating element and add the stars to it
		const ratingSpan = document.createElement("span")
		setStars(ratingSpan, rating)
		ratingSpan.classList.add("review-stars")

		// Create the review element
		const reviewSpan = createReviewElement(rating, review)

		// Add the star rating and text review elements to the row
		row.appendChild(ratingSpan)
		row.appendChild(reviewSpan)

		// Add the row to the review list
		reviewsList.appendChild(row)
	})
}

function createReviewElement(rating, review) {
	// Create the container element
	let reviewSpan = document.createElement("span")

	// Create the rating as a bolded text element
	let boldRating = document.createElement("span")
	boldRating.innerText = rating
	boldRating.style.fontWeight = "bold"

	// Create the rest of the review as a regular text element
	let reviewText = document.createElement("span")
	reviewText.innerText = `, ${review}`

	// Combine the text elements in the container element and return the container element
	reviewSpan.appendChild(boldRating)
	reviewSpan.appendChild(reviewText)

	return reviewSpan
}

// Grab the modal and give it functionality for the "submit" listener
const ratingModal = document.querySelector("#ratingModal")
ratingModal.addEventListener("submit", e => {
	e.preventDefault()

	// Grab the star value and the review text and prepare to submit to server.
	const selectedStars = document.querySelectorAll("#stars > .star.checked")
	const reviewText = document.querySelector("#reviewText")
	const review = reviewText.value

	submitRating(selectedStars.length, review)

	// Reset the form so it is ready for the next new review.
	selectedStars.forEach(star => {
		star.classList.remove("checked")
	})
	reviewText.value = ""

	// Close the modal and overlay
	closeModal()
})

// Submit a rating to the server
async function submitRating(rating, review) {
	// Use fetch API to send rating and review to the server with a POST request.
	let body = { rating, review }
	const response = await sendRequest("addReview", "POST", body)

	setAverageRating(response.averageRating)
	updateReviewList(response.reviews)
}

// Add a click listener to the modal's overlay to allow the user to cancel submitting a review.
const modalOverlay = document.querySelector("#modalOverlay")
modalOverlay.addEventListener("click", closeModal)

// Close the modal and overlay
function closeModal() {
	ratingModal.classList.remove("open")
	modalOverlay.classList.remove("open")
}

// Helper functions

// A simple function that clears out all child elements of the given parent element.
function clearChildren(parent) {
	while (parent.children.length > 0) {
		parent.children[0].remove()
	}
}

// Adds the specified number of stars to the given parent element.
function setStars(parent, stars) {
	for (let i = 0; i < 5; i++) {
		const star = document.createElement("span")
		star.classList.add("fa", "fa-star", "fa-lg", "star")
		if (i < stars) {
			star.classList.add("checked")
		}

		parent.appendChild(star)
	}
}

// Update the star ratings on the hello modal when one of the stars is clicked
function updateModalRating(stars) {
	const selectedStars = document.querySelectorAll("#stars > .star.checked").length
	for (let i = 1; i <= 5; i++) {
		const star = document.querySelector(`#star-${i}`)
		if (i === stars && i === selectedStars) {
			star.classList.toggle("checked")
		} else if (i <= stars) {
			star.classList.add("checked")
		} else {
			star.classList.remove("checked")
		}
	}
}
