window.addEventListener("load", function () {
    var textarea = document.getElementById("review-comment");
    textarea.focus(); // Set focus to the textarea
    textarea.setSelectionRange(0, 0); // Set cursor position to the start
});

const toggleLike = async (element, reviewId) => {
    const container = element.closest('.user-review-actions-1');
    const likebtn = container.querySelector(".like");
    const likeCount = container.querySelector(".like-counter");
    const dislikebtn = container.querySelector(".dislike");
    const dislikeCount = container.querySelector(".thumbsdown-counter");

    // Check the source of the like button image
    const likeImgSrc = likebtn.getAttribute("src");

    if (likeImgSrc.includes("blue-like.png")) {
        // Unlike the review
        try {
            const response = await fetch(`/unlike_review/${reviewId}`, {
                method: 'POST'
            });
            const data = await response.json();
            if (response.ok) {
                likeCount.textContent = parseInt(likeCount.textContent) - 1;
                likebtn.setAttribute("src", "image/althea/like.png");
            } else {
                console.error(data.error);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    } else {
        // Like the review
        try {
            const response = await fetch(`/like_review/${reviewId}`, {
                method: 'POST'
            });
            const data = await response.json();
            if (response.ok) {
                likeCount.textContent = parseInt(likeCount.textContent) + 1;
                likebtn.setAttribute("src", "image/althea/blue-like.png");

                // If dislike button is blue, decrement dislikes
                if (dislikebtn.getAttribute("src").endsWith("thumbsdown-red.png")) {
                    try {
                        const response = await fetch(`/undislike_review/${reviewId}`, {
                            method: 'POST'
                        });
                        const data = await response.json();
                        if (response.ok) {
                            dislikeCount.textContent = parseInt(dislikeCount.textContent) - 1;
                            dislikebtn.src = "image/althea/thumbsdown.png";
                        } else {
                            console.error(data.error);
                        }
                    } catch (error) {
                        console.error('Error:', error);
                    }
                }
            } else {
                console.error(data.error);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
};

const toggleDislike = async (element, reviewId) => {
    const container = element.closest('.user-review-actions-1');
    const dislikebtn = container.querySelector(".dislike");
    const dislikeCount = container.querySelector(".thumbsdown-counter");
    const likebtn = container.querySelector(".like");
    const likeCount = container.querySelector(".like-counter");

    if (dislikebtn.src.endsWith("thumbsdown.png")) {
        // Dislike the review
        try {
            const response = await fetch(`/dislike_review/${reviewId}`, {
                method: 'POST'
            });
            const data = await response.json();
            if (response.ok) {
                dislikeCount.textContent = parseInt(dislikeCount.textContent) + 1;
                dislikebtn.src = "image/althea/thumbsdown-red.png";

                // If like button is blue, decrement likes
                if (likebtn.src.endsWith("blue-like.png")) {
                    try {
                        const response = await fetch(`/unlike_review/${reviewId}`, {
                            method: 'POST'
                        });
                        const data = await response.json();
                        if (response.ok) {
                            likeCount.textContent = parseInt(likeCount.textContent) - 1;
                            likebtn.setAttribute("src", "image/althea/like.png");
                        } else {
                            console.error(data.error);
                        }
                    } catch (error) {
                        console.error('Error:', error);
                    }
                }
            } else {
                console.error(data.error);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    } else {
        // Undislike the review
        try {
            const response = await fetch(`/undislike_review/${reviewId}`, {
                method: 'POST'
            });
            const data = await response.json();
            if (response.ok) {
                dislikeCount.textContent = parseInt(dislikeCount.textContent) - 1;
                dislikebtn.src = "image/althea/thumbsdown.png";
            } else {
                console.error(data.error);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
};

const toggleLikeReply = async (element, reviewId, replyId) => {
    const container = element.closest('.user-review-actions-1');
    const likebtn = container.querySelector(".like");
    const likeCount = container.querySelector(".like-counter");
    const dislikebtn = container.querySelector(".dislike");
    const dislikeCount = container.querySelector(".thumbsdown-counter");

    // Check the source of the like button image
    const likeImgSrc = likebtn.getAttribute("src");

    if (likeImgSrc.includes("blue-like.png")) {
        // Unlike the reply
        try {
            const response = await fetch(`/unlike_reply/${reviewId}/${replyId}`, {
                method: 'POST'
            });
            const data = await response.json();
            if (response.ok) {
                likeCount.textContent = parseInt(likeCount.textContent) - 1;
                likebtn.setAttribute("src", "image/althea/like.png");
            } else {
                console.error(data.error);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    } else {
        // Like the reply
        try {
            const response = await fetch(`/like_reply/${reviewId}/${replyId}`, {
                method: 'POST'
            });
            const data = await response.json();
            if (response.ok) {
                likeCount.textContent = parseInt(likeCount.textContent) + 1;
                likebtn.setAttribute("src", "image/althea/blue-like.png");

                // If dislike button is blue, decrement dislikes
                if (dislikebtn.getAttribute("src").endsWith("thumbsdown-red.png")) {
                    try {
                        const response = await fetch(`/undislike_reply/${reviewId}/${replyId}`, {
                            method: 'POST'
                        });
                        const data = await response.json();
                        if (response.ok) {
                            dislikeCount.textContent = parseInt(dislikeCount.textContent) - 1;
                            dislikebtn.src = "image/althea/thumbsdown.png";
                        } else {
                            console.error(data.error);
                        }
                    } catch (error) {
                        console.error('Error:', error);
                    }
                }
            } else {
                console.error(data.error);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
};

const toggleDislikeReply = async (element, reviewId, replyId) => {
    const container = element.closest('.user-review-actions-1');
    const dislikebtn = container.querySelector(".dislike");
    const dislikeCount = container.querySelector(".thumbsdown-counter");
    const likebtn = container.querySelector(".like");
    const likeCount = container.querySelector(".like-counter");

    if (dislikebtn.src.endsWith("thumbsdown.png")) {
        // Dislike the reply
        try {
            const response = await fetch(`/dislike_reply/${reviewId}/${replyId}`, {
                method: 'POST'
            });
            const data = await response.json();
            if (response.ok) {
                dislikeCount.textContent = parseInt(dislikeCount.textContent) + 1;
                dislikebtn.src = "image/althea/thumbsdown-red.png";

                // If like button is blue, decrement likes
                if (likebtn.src.endsWith("blue-like.png")) {
                    try {
                        const response = await fetch(`/unlike_reply/${reviewId}/${replyId}`, {
                            method: 'POST'
                        });
                        const data = await response.json();
                        if (response.ok) {
                            likeCount.textContent = parseInt(likeCount.textContent) - 1;
                            likebtn.setAttribute("src", "image/althea/like.png");
                        } else {
                            console.error(data.error);
                        }
                    } catch (error) {
                        console.error('Error:', error);
                    }
                }
            } else {
                console.error(data.error);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    } else {
        // Undislike the reply
        try {
            const response = await fetch(`/undislike_reply/${reviewId}/${replyId}`, {
                method: 'POST'
            });
            const data = await response.json();
            if (response.ok) {
                dislikeCount.textContent = parseInt(dislikeCount.textContent) - 1;
                dislikebtn.src = "image/althea/thumbsdown.png";
            } else {
                console.error(data.error);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
};

// ALMOST DONE
const editReview = async (element, reviewId) => {
    const reviewContainer = element.closest('.review-1');
    const commentElement = reviewContainer.querySelector('.comment');
    const titleElement = reviewContainer.querySelector('.user-review-title-1');
    const ratingElement = reviewContainer.querySelector('.stars');

    const stars = ratingElement.querySelectorAll('.starsImg');
    const rating = stars.length;
    console.log(rating);

    // Get the current values
    const currentComment = commentElement.textContent;
    const currentTitle = titleElement.textContent;

    // Switch to edit mode
    commentElement.innerHTML = `<textarea class="edit-comment">${currentComment.trim()}</textarea>`;
    titleElement.innerHTML = `<input type="text" class="edit-title" value="${currentTitle.trim()}">`;

    const newRating = prompt('Enter new rating:');
    let updatedRating;
    if (newRating !== null) {
        updatedRating = parseInt(newRating); // Convert to integer
    }
        

    // Create save and cancel buttons
    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save Edit';
    saveButton.classList.add('save-btn');

    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancel';
    cancelButton.classList.add('cancel-btn');

    // Event listener for save button
    saveButton.addEventListener('click', async () => {

        // Confirm with the user if they want to continue with the edit
        const confirmEdit = confirm('Are you sure you want to save the changes?');
        if (confirmEdit) {
            // Get the updated values
            const updatedComment = commentElement.querySelector('.edit-comment').value;
            const updatedTitle = titleElement.querySelector('.edit-title').value;

            if (updatedComment.trim() === '' || updatedTitle.trim() === '') {
                // Alert the user and do not save if either is empty
                alert("Comment and title cannot be empty!");
                return;
            }

            try {
                const response = await fetch(`/edit_review/${reviewId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        title: updatedTitle,
                        content: updatedComment,
                        rating: updatedRating
                    })
                });

                if (!response.ok) {
                    throw new Error('Failed to update review');
                }

                // Update elements on the page with new data
                commentElement.textContent = updatedComment;
                titleElement.textContent = updatedTitle;
                ratingElement.innerHTML  = generateStarRating(updatedRating); // Update rating
            } catch (error) {
                console.error('Error updating review:', error);
                alert('Failed to update review');
            }

        } else {
            // Cancel the edit and revert back to the original values
            commentElement.innerHTML = currentComment;
            titleElement.innerHTML = currentTitle;
            ratingElement.innerHTML  = generateStarRating(rating);
        }

        // Remove the save and cancel buttons
        reviewContainer.removeChild(saveButton);
        reviewContainer.removeChild(cancelButton);
    });

    // Event listener for cancel button
    cancelButton.addEventListener('click', () => {
        // Cancel the edit and revert back to the original values
        commentElement.innerHTML = currentComment;
        titleElement.innerHTML = currentTitle;
        ratingElement.innerHTML  = generateStarRating(rating);

        // Remove the save and cancel buttons
        reviewContainer.removeChild(saveButton);
        reviewContainer.removeChild(cancelButton);
    });

    // Append the save and cancel buttons
    reviewContainer.appendChild(saveButton);
    reviewContainer.appendChild(cancelButton);
};

function generateStarRating(rating) {
    const stars = parseInt(rating);
    let starIcons = '';
    for (let i = 0; i < stars; i++) {
        starIcons += '<img src="image/star.png" alt="" class="starsImg">'
    }
    return starIcons;
}

//FINISHED EDITING
function deleteReview(shop_name, reviewId) {
    fetch(`/reviews/${reviewId}/${shop_name}`, {
        method: 'DELETE',
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log(data); // Log success message or handle response accordingly
        
        // REDIRECTING
        if(shop_name === "Weclean Laundry Shop")
            window.location.href = "/Weclean";
        else if (shop_name === "XYZ Laundry Service")
            window.location.href ="/XYZLaundryService";
        else if (shop_name === "7Folds Laundry Shop")
            window.location.href ="/7FoldsLaundry";
        else
            window.location.href ="/NonstopLaundryShopMalate";
    })
    .catch(error => {
        console.error('Error deleting review:', error);
        // Handle error
    });
}

function previewProfileImage(event) {
    const input = event.target;
    const previewImage = document.getElementById('previewImage');

    const file = input.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            previewImage.src = e.target.result;
        };

        reader.readAsDataURL(file);
    }
}


//di ko na alam silbi nila
const reportReview = (element) => {
    const container = element.closest('.user-review-actions-1');
    console.log("working report");
    // You can also display a message to the user confirming that the review has been reported
    alert('Review has been reported successfully!');
};


document.addEventListener("DOMContentLoaded", function() {
    function validateForm() {
        const title = document.getElementById("review-title").value.trim();
        const comment = document.getElementById("review-comment").value.trim();
        const rating = getSelectedRating();

        if (title === "") {
            alert("Please enter a title for your review.");
            return false;
        }

        if (comment === "") {
            alert("Please enter a comment for your review.");
            return false;
        }

        if (!rating) {
            alert("Please select a rating for your review.");
            return false;
        }

        return true;
    }

    function hideEmptyImages() {
        const imageContainers = document.querySelectorAll('.user-review-image-1');

        imageContainers.forEach(container => {
            const img = container.querySelector('img');
            const src = img ? img.getAttribute('src') : '';
            if (!src || src.startsWith('http://') || src.startsWith('https://')) {
                container.style.display = 'none';
            } else {
                container.style.display = 'flex'; // Show the container if there's an image with a relative source
            }
        });
    }

    let noOfCharac = 150;
    let contents = document.querySelectorAll(".comment");

    function sliceComments() {
        const contents = document.querySelectorAll(".user-review-comment-1");
        contents.forEach(container => {
            let comment = container.querySelector(".comment");
            let button = container.querySelector(".show-more-btn"); // Get the button inside the container
    
            if (!comment || !button) {
                console.error("Comment or button not found within container:", container);
                return; // Exit the loop if comment or button is not found
            }
    
            let commentText = comment.textContent.trim(); // Remove leading and trailing white spaces
            if (commentText.length < noOfCharac) {
                console.log("Comment length is less than noOfCharac");
                console.log(commentText.length);
                button.style.display = "none"; // Hide the button
                container.style.height = "auto"; // Adjust container height
            } else {
                console.log("Comment length is greater than or equal to noOfCharac");
                console.log(commentText.length);
                let displayText = commentText.slice(0, noOfCharac);
                let moreText = commentText.slice(noOfCharac);
                comment.innerHTML = `${displayText}<span class="hide more">${moreText}</span>`;
            }
        });
    }
    
    // Call sliceComments function when the DOM is loaded
    sliceComments();

    function applyNewShowMoreListeners() {
        console.log("working");
        const reviewContainer = document.querySelector(".review-container");
        const newShowMoreBtns = reviewContainer.querySelectorAll(".show-more-btn:not(.listener-added)");

        newShowMoreBtns.forEach(btn => {
            btn.classList.add("listener-added"); // Mark button as having the listener added
            btn.addEventListener("click", function() {
                readMore(this);
            }); // Add event listener
        });
    }

    function readMore(btn) {
        let user_review_comment_1 = btn.parentElement;
        let review_container = user_review_comment_1.parentElement;
        let more = user_review_comment_1.querySelector(".more");

        if (more) {
            more.classList.toggle("hide");

            if (btn.textContent == "Show more...") {
                btn.textContent = "Show less...";
                review_container.style.height = "auto";
            } else {
                btn.textContent = "Show more...";
                review_container.style.height = "auto";
            }
        }
    }

    const publishBtn = document.getElementById("submitBtn");

    function getCurrentDate() {
        const currentDate = new Date();
        return currentDate.toLocaleDateString();
    }

    function getSelectedRating() {
        const selectedRating = document.querySelector("input[name='rate']:checked");
        return selectedRating ? selectedRating.value : null;
    }

    function generateStarRating(rating) {
        const stars = parseInt(rating);
        let starIcons = '';
        for (let i = 0; i < stars; i++) {
        starIcons += '<img src="image/althea/star.png" alt="star" class="stars-img">&nbsp;&nbsp;&nbsp;';
        }
        return starIcons;
    }

    function resetFileInputs() {
        // Reset image file input
        document.getElementById("default-Btn").value = "";
        // Reset video file input
        document.getElementById("video-file").value = "";

        document.getElementById('file-name').textContent = "";
    }

    publishBtn.addEventListener("click", function() {
        sliceComments();
        applyNewShowMoreListeners();
    });


    // Function to fetch review data from the server and populate the review containers
    applyNewShowMoreListeners();
    hideEmptyImages();

    
});