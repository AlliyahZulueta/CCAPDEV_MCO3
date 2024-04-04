/*
function setupCardClickListeners() {
    const cardContainers = document.querySelectorAll('.reviews-card1, .comments-card1');
    cardContainers.forEach(function (cardContainer) {
        cardContainer.addEventListener('click', function () {
            const cardId = cardContainer.id;
            displayCardContent(cardId);
        });
    });
}

function displayCardContent(cardId) {
    setupImageClickHandler(cardId, '.reviews-card1', '.img_like', 'image/like_fill.png', 'image/like.png');
    setupImageClickHandler(cardId, '.comments-card1', '.img_like', 'image/like_fill.png', 'image/like.png');
    setupImageClickHandler(cardId, '.reviews-card1', '.img_dislike', 'image/dislike_fill.png', 'image/dislike.png');
    setupImageClickHandler(cardId, '.comments-card1', '.img_dislike', 'image/dislike_fill.png', 'image/dislike.png');
}

function setupImageClickHandler(cardId, containerSelector, imgSelector, filledImagePath, unfilledImagePath) {
    const containerElement = document.querySelector(`${containerSelector}#${cardId}`);
    const imgElement = containerElement.querySelector(imgSelector);

    if (imgElement) {
        let isClick = false;

        imgElement.addEventListener('click', function () {
            if (isClick) {
                imgElement.src = unfilledImagePath;
            } else {
                imgElement.src = filledImagePath;
            }
            isClick = !isClick;

            const numLikesElement = containerElement.querySelector('.num-likes');
            const numDislikesElement = containerElement.querySelector('.num-dislikes');

            if (isClick) {
                if (imgElement.classList.contains('img_like')) {
                    numLikesElement.textContent = parseInt(numLikesElement.textContent) + 1;
                } else if (imgElement.classList.contains('img_dislike')) {
                    numDislikesElement.textContent = parseInt(numDislikesElement.textContent) + 1;
                }
            } else {
                if (imgElement.classList.contains('img_like')) {
                    numLikesElement.textContent = parseInt(numLikesElement.textContent) - 1;
                } else if (imgElement.classList.contains('img_dislike')) {
                    numDislikesElement.textContent = parseInt(numDislikesElement.textContent) - 1;
                }
            }
        });
    }
}


document.addEventListener("DOMContentLoaded", function () {
    setupCardClickListeners();
});
*/