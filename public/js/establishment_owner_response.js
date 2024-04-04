
let cardIds =[
    'owner-comment-box1', 'owner-comment-box2',
    'owner-comment-box3', ,'owner-comment-box4'
];

let newTexts = [
    "Thank you so much for taking the time to share your feedback! We truly appreciate your kind words and are delighted to hear that you had a positive experience at our laundry shop.",
    "We're thrilled to learn that our services met your expectations. Providing excellent customer service and quality results is our top priority, and we're glad to know we achieved that during your visit.",
    "Your detailed review is incredibly valuable to us. We take all feedback seriously, and we'll use your comments to continuously improve and enhance our services. If there's anything specific you think we could do even better, please let us know.",
    "We're honored to have you as a satisfied customer and look forward to serving you again in the future. Your support means the world to us, and we're committed to maintaining the high standards that earned your positive review."
];

let middleClassNameNoOfChar = 38;


function truncateText() {
    cardIds.forEach(function(cardId) {
        const element = document.getElementById(cardId);
        if (element && !isInsidePopupContent(element)) {
            const middleClassName = `#${cardId} #${cardId}-middle-commentlbl`;
            const isInsidePopup = isInsidePopupContent(element);
            truncateElements(middleClassName, middleClassNameNoOfChar, !isInsidePopup);
        }
    });
}

function isInsidePopupContent(element) {
    return element.closest('.popup-review-comment-container') !== null;
}

function truncateElements(selector, maxChars, truncate) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(function (element) {
        if (!isInsidePopupContent(element) && truncate) {
            let textContent = element.textContent.trim();
            if (textContent.length > maxChars) {
                element.textContent = textContent.substring(0, maxChars) + '...';
            }
        }
    });
}

function hidePopup() {
    const popupContainer = document.querySelector('.popup-review-comment-container');
    const containerBottom = document.querySelector('.container-bottom');
    popupContainer.style.display = 'none';
    containerBottom.innerHTML = '';
}

function setupCardClickListeners() {
    cardIds.forEach(function (cardId) {
        const cardElement = document.getElementById(cardId);

        if (cardElement) {
            cardElement.addEventListener('click', function () {
                displayCardContent(cardId);
            });
        }
    });
}

function displayCardContent(cardId) {
    const cardContent = document.getElementById(cardId).cloneNode(true);
    const containerBottom = document.querySelector('.container-bottom');
    if (cardContent) {
        cardContent.style.width = '100%';
        cardContent.style.padding = '3px';
    }
    const cardMiddle = cardContent.querySelector('.comment-card1-middle');
    if (cardMiddle) {
        cardMiddle.style.height = '200px';
    }

    const commentCard = cardContent.querySelector('.comment-card1');
    if(commentCard){
        commentCard.style.marginTop = '30px';
        commentCard.style.height =  '200px';
    }

    containerBottom.innerHTML = '';
    containerBottom.appendChild(cardContent);


    showPopup();
    //owner-comment-box1
    setupImageClickHandler(cardId,'.popup-review-comment-container #owner-comment-box1',     '.img_like', 'image/like_fill.png', 'image/like.png');
    setupImageClickHandler(cardId,'.popup-review-comment-container #owner-comment-box1',     '.img_dislike',  'image/dislike_fill.png', 'image/dislike.png');
    setupImageClickHandler(cardId,'.popup-review-comment-container #owner-comment-box2',     '.img_like', 'image/like_fill.png', 'image/like.png');
    setupImageClickHandler(cardId,'.popup-review-comment-container #owner-comment-box2',     '.img_dislike',  'image/dislike_fill.png', 'image/dislike.png');
    setupImageClickHandler(cardId,'.popup-review-comment-container #owner-comment-box3',     '.img_like', 'image/like_fill.png', 'image/like.png');
    setupImageClickHandler(cardId,'.popup-review-comment-container #owner-comment-box3',     '.img_dislike',  'image/dislike_fill.png', 'image/dislike.png');
    setupImageClickHandler(cardId,'.popup-review-comment-container #owner-comment-box4',     '.img_like', 'image/like_fill.png', 'image/like.png');
    setupImageClickHandler(cardId,'.popup-review-comment-container #owner-comment-box4',     '.img_dislike',  'image/dislike_fill.png', 'image/dislike.png');

    //replaceTextWithCompleteStrings
    if (cardContent.querySelector('.comment-card1') !== undefined) {
        let typeStr = "comment-card1";
        replaceTextWithCompleteStrings(typeStr, cardId);
    }
}

function replaceTextWithCompleteStrings(typeStr, cardId) {
    const ownerProfileReviews = document.querySelectorAll(`.owner-profile-container .${typeStr}-middle`);
    const ownerProfileReviewsArr = Array.from(ownerProfileReviews);

    const commentCardMiddleElements = document.querySelectorAll(`.popup-review-comment-container .${typeStr}-middle`);
    const commentCardMiddleElementsArr = Array.from(commentCardMiddleElements);

    let indexCount = 0;

    console.log(ownerProfileReviewsArr.length);
    console.log(commentCardMiddleElementsArr.length);

    if (ownerProfileReviewsArr.length > 0) {
        if (cardId === "owner-comment-box1") {
            indexCount = 0;
        } else if (cardId === "owner-comment-box2") {
            indexCount = 1;
        } else if (cardId === "owner-comment-box3") {
            indexCount = 2;
        } else if (cardId === "owner-comment-box4") {
            indexCount = 3;
        }
        let searchDOMPopUpCard = document.querySelector(`.popup-review-comment-container #${cardId} .${typeStr}-middle`);
        console.log(searchDOMPopUpCard.textContent);
        commentsCardSetText(searchDOMPopUpCard, indexCount);
    }
}

function commentsCardSetText(element, indexCount) {
    element.textContent = newTexts[indexCount];
}


function showPopup() {
    const popupContainer = document.querySelector('.popup-review-comment-container');
    const popupContent = document.querySelector('.popup-content');


    popupContainer.style.display = 'flex';
    popupContainer.style.position = 'fixed';
    popupContainer.style.top = '250px';
    popupContainer.style.left = '0';
    popupContainer.style.width = '100vw';
    popupContainer.style.height = '50vh';
    popupContainer.style.justifyContent = 'center';
    popupContainer.style.alignItems = 'center';
    popupContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'; 

    popupContent.style.backgroundColor = 'white';
    popupContent.style.padding = '5px';
    popupContent.style.borderRadius = '8px';
    popupContent.style.border = '1px solid black';
    popupContent.style.height = '50%';
    popupContent.style.width = '50%';


}

function setupImageClickHandler(cardId, containerSelector, imgSelector, unfillImagePath, filledImagePath) {
    const containerElements = document.querySelectorAll(containerSelector);

    containerElements.forEach(function(containerElement) {
        const imgElement = containerElement.querySelector(imgSelector);

        if (imgElement) {
            let isClick = false;

            imgElement.addEventListener('click', function () {
                if (isClick) {
                    imgElement.src = filledImagePath;
                } else {
                    imgElement.src = unfillImagePath;
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
                        numLikesElement.textContent = parseInt(numLikesElement.textContent) -  1;
                    } else if (imgElement.classList.contains('img_dislike')) {
                        numDislikesElement.textContent = parseInt(numDislikesElement.textContent) - 1;
                    }
                }
                const cardSelector = getCardSelector(cardId);
                updateProfileCardInner(cardSelector, numLikesElement.textContent, numDislikesElement.textContent);

            });
        }
    });
}
function getCardSelector(cardId) {
    return `.owner-profile-container #${cardId}`;
}

function updateProfileCardInner(containerSelector, numLikes, numDislikes) {
    const profileCard = document.querySelector(containerSelector);

    if (profileCard) {
        const profileCardInnerNumLikes = profileCard.querySelector('.num-likes');
        const profileCardInnerNumDislikes = profileCard.querySelector('.num-dislikes');

        if (profileCardInnerNumLikes && profileCardInnerNumDislikes) {
            profileCardInnerNumLikes.textContent = numLikes;
            profileCardInnerNumDislikes.textContent = numDislikes;
        }
    }
}

function setupPopupOnClick(cardContainerSelector, cardSelector) {
    const cardContainers = document.querySelectorAll(cardSelector);
    hidePopup();
    cardContainers.forEach(function (cardContainer) {
        cardContainer.addEventListener('click', showPopup);
    });
}




document.addEventListener("DOMContentLoaded", function () {
    truncateText();
    hidePopup();
    setupCardClickListeners();
    setupPopupOnClick('.owner-profile-container', '.owner-comment-box');
});