
let searchstr = "";
let chosenFilter = "";

function updatePlaceholder() {
    let searchText = document.getElementById("search-txt").value;
    let filterValue = document.getElementById("filter").value;
    localStorage.setItem("searchText", searchText);
    localStorage.setItem("filterValue", filterValue);
}

function updateSearchResultPlaceholder() {
    let urlParams = new URLSearchParams(window.location.search);
    let searchTextParam = urlParams.get('search-txt');
    let filterParam = urlParams.get('filter');

    searchstr = searchTextParam;
    chosenFilter = filterParam;

    if (searchTextParam) {
        document.getElementById("search-result-txt").placeholder = "Searched: " + searchTextParam;
    }

    if (filterParam) {
        let filterSelect = document.getElementById("filter");
        filterSelect.value = filterParam;
    }
}
function updateSearchResultNumber() {
    let searchPanelBottomContainer = document.querySelector('.search-panel-bottom-container');
    let storeCards = searchPanelBottomContainer.querySelectorAll('.store-container-card');

    let numberOfResults = 0;

    storeCards.forEach(function (storeCard) {
        if (storeCard.style.display === 'block') {
            numberOfResults++;
        }
    });

    let searchNumberSpan = document.querySelector('.search-number');
    if (searchNumberSpan) {
        searchNumberSpan.textContent = numberOfResults;
    }
}


function filterBySearchWording() {
    let urlParams = new URLSearchParams(window.location.search);
    let searchTextParam = urlParams.get('search-txt');

    if (searchTextParam) {
        let storeCards = document.querySelectorAll('.store-container-card');

        storeCards.forEach(function (storeCard) {
            let storeDescription = storeCard.querySelector('.store-description').innerText.toLowerCase();
            if (storeDescription.includes(searchTextParam.toLowerCase())) {
                storeCard.style.display = 'block';
            } else {
                storeCard.style.display = 'none';
            }
        });
    }
    updateSearchResultNumber()
}

function filterByNumOfStars() {
    let filterValue = document.getElementById("filter").value;
    if (filterValue !== "filterlbl") {
        let storeCards = document.querySelectorAll('.store-container-card');

        storeCards.forEach(function (storeCard) {
            let imgStars = storeCard.querySelectorAll('.img_star').length;
            // Convert the filterValue to a number for comparison
            let filterNum = parseInt(filterValue);
            if (imgStars === filterNum) {
                storeCard.style.display = 'block';
            } else {
                storeCard.style.display = 'none';
            }
        });
    } else {
        // If filterValue is "filterlbl", display all store-container-cards
        let storeCards = document.querySelectorAll('.store-container-card');
        storeCards.forEach(function (storeCard) {
            storeCard.style.display = 'block';
        });
    }
    updateSearchResultNumber();
}

function filterSearchAndStars() {
    let urlParams = new URLSearchParams(window.location.search);
    let searchTextParam = urlParams.get('search-txt');
    let filterValue = document.getElementById("filter").value;

    let storeCards = document.querySelectorAll('.store-container-card');

    storeCards.forEach(function (storeCard) {
        let storeDescription = storeCard.querySelector('.store-description').innerText.toLowerCase();
        let imgStars = storeCard.querySelectorAll('.img_star').length;

        // Filter by search wording
        let isSearchMatch = !searchTextParam || storeDescription.includes(searchTextParam.toLowerCase());

        // Filter by number of stars
        let isStarsMatch = filterValue === "filterlbl" || imgStars === parseInt(filterValue);

        // Set display property based on both conditions
        storeCard.style.display = isSearchMatch && isStarsMatch ? 'block' : 'none';
    });

    updateSearchResultNumber();
}



document.addEventListener("DOMContentLoaded", function () {
    updateSearchResultPlaceholder();
    updateSearchResultNumber();
    updateSearchResultNumber();
    filterByNumOfStars();
    filterBySearchWording();
    filterSearchAndStars();
});