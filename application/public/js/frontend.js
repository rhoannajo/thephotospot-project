function setFlashMessageFadeOut(flashMessageElement) {
    setTimeout(() => {
        let currentOpacity = 1.0;
        let timer = setInterval(() => {
            if (currentOpacity < 0.05) {
                clearInterval(timer);
                flashMessageElement.remove();
            }
            currentOpacity = currentOpacity - 0.05;
            flashMessageElement.style.opacity = currentOpacity;
        }, 50)
    }, 4000);
}

function addFlashFromFrontEnd(message, level) {
    let flashMessageDiv = document.createElement('div');
    let innerFlashDiv = document.createElement('div');
    let innerTextNode = document.createTextNode(message);
    innerFlashDiv.appendChild(innerTextNode);
    flashMessageDiv.appendChild(innerFlashDiv);
    flashMessageDiv.setAttribute('id', 'flash-message');
    innerFlashDiv.setAttribute('class', `alert-success`);
    document.getElementsByTagName('body')[0].appendChild(flashMessageDiv);
    setFlashMessageFadeOut(flashMessageDiv);
}

function createCard(postData) {
    return `<div class="item" id="post-${postData.id}">
    <img src="${postData.thumbnail}" alt="Missing Image">
    <div>
        <p class="bold center">${postData.title}</p>
        <p class="center">${postData.description}</p>
        <a href="/posts/${postData.id}" class="center">Post Details</a>
    </div>
    </div>`;
}

function executeSearch() {
    let searchTerm = document.getElementById('search-text').value;
    if (!searchTerm) {
        location.replace('/');
        //addFlashFromFrontEnd('Empty search term, here are the 8 most recent posts');
        return;
    }
    let mainContent = document.getElementById('main-content');
    let searchURL = `/posts/search?search=${searchTerm}`;
    fetch(searchURL)
    .then((data) => {
        return data.json();
    })
    .then((data_json) => {
        let newMainContentHTML = '';
        data_json.results.forEach((row) => {
            newMainContentHTML += createCard(row);
        });
        mainContent.innerHTML = newMainContentHTML;
        if (data_json.message) {
            addFlashFromFrontEnd(data_json.message);
        }
    }) 
    .catch((err) => console.log(err))
}

let flashElement = document.getElementById('flash-message');
if (flashElement) {
    setFlashMessageFadeOut(flashElement);
}

let searchButton = document.getElementById('search-button');
if (searchButton) {
    searchButton.onclick = executeSearch;
}