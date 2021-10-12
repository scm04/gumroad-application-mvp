// Grab the elements needed to make the page function.
const addReviewBtn = document.querySelector("#addReviewBtn")
const ratingModal = document.querySelector("#ratingModal")
const modalOverlay = document.querySelector("#modalOverlay")
const averageRatingValue = document.querySelector("#averageRatingValue")
const averageRatingStars = document.querySelector("#averageRatingStars")
const reviewsList = document.querySelector("#reviewsList")
const reviewText = document.querySelector("#reviewText")

// Once the page is loaded, send a request to the server to retrieve the existing reviews and add everything to the page in its proper location.
let averageRating = 3.8
let reviews = [
	{ rating: 4, review: "book was full of fluff" },
	{ rating: 3, review: "book was fluff" },
	{ rating: 4, review: "book was amazing" }
]

addEventListener("load", async () => {
	// eventually replace this with the API call once I've got the server up
	setAverageRating()

	updateReviewList(reviews)
})

function setAverageRating() {
	averageRatingValue.innerText = averageRating
	clearChildren(averageRatingStars)
	let roundedAverage = Math.round(averageRating)
	setStars(averageRatingStars, roundedAverage)
}

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
		const reviewSpan = document.createElement("span")
		// Create a bolded rating element to nest inside the review element
		const boldRating = document.createElement("span")
		boldRating.innerText = rating
		boldRating.style.fontWeight = "bold"
		// Create a regular text element for the review text to nest inside of the review element
		const reviewText = document.createElement("span")
		reviewText.innerText = `, ${review}`
		// Append the bolded rating element and regular text element to the review element.
		reviewSpan.appendChild(boldRating)
		reviewSpan.appendChild(reviewText)

		// Add the star rating and text review elements to the row
		row.appendChild(ratingSpan)
		row.appendChild(reviewSpan)

		// Add the row to the review list
		reviewsList.appendChild(row)
	})
}

// A simple function that clears out all child elements of the given parent element.
function clearChildren(parent) {
	while (parent.children.length > 0) {
		parent.children[0].remove()
	}
}

// Add a click listener to the "add review" button so it opens the ratings modal and applies the overlay when clicked.
addReviewBtn.addEventListener("click", () => {
	ratingModal.classList.add("open")
	modalOverlay.classList.add("open")
})

// Add a click listener to the overlay to allow the user to cancel submitting a review.
modalOverlay.addEventListener("click", closeModal)

// Add submit listener to the rating modal to send the review to the server.
ratingModal.addEventListener("submit", e => {
	e.preventDefault()

	// Grab the star value and the review text and prepare to submit to server.
	const selectedStars = document.querySelectorAll("#stars > .star.checked")
	const review = reviewText.value

	submitRating(selectedStars.length, review)

	// Clear out the stars and text so the modal is ready for the next review.
	selectedStars.forEach(star => {
		star.classList.remove("checked")
	})
	reviewText.value = ""

	// Close the modal and overlay
	closeModal()
})

// Close the modal and overlay
function closeModal() {
	ratingModal.classList.remove("open")
	modalOverlay.classList.remove("open")
}

// Submit a rating to the server
function submitRating(starRating, reviewText) {
	// Use fetch API to send starRating and reviewText to the server with a POST request.
	reviews.push({ rating: starRating, review: reviewText })
	updateAverageRating()
	updateReviewList(reviews)
}

function updateAverageRating() {
	const sum = reviews.reduce((sum, review) => {
		return sum + review.rating
	}, 0)

	averageRating = sum / reviews.length
	averageRating = Math.round(averageRating * 10) / 10

	setAverageRating()
}

// Update the star ratings on the hello modal when one of the stars is clicked
function updateModalRating(stars) {
	for (let i = 1; i <= 5; i++) {
		const star = document.querySelector(`#star-${i}`)
		if (i === stars) {
			star.classList.toggle("checked")
		} else if (i < stars) {
			star.classList.add("checked")
		} else {
			star.classList.remove("checked")
		}
	}
}
