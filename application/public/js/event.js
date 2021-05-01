function addData(url, title, id) {
    let div = document.createElement('div');
    let img = document.createElement('img');
    let description = document.createElement('p');

    div.className = "item";
    div.id = `photo-${id}`;
    div.onclick=fadeOutEffect;

    img.src = url;
    img.width = "300";
    img.height = "300";

    description.innerHTML = title;
    description.className = "center";

    div.appendChild(img);
    div.appendChild(description);

    return div;
}

var mainDiv = document.getElementById("container");

if (mainDiv) {
    let fetchURL = "https://jsonplaceholder.typicode.com/albums/2/photos";
    fetch(fetchURL)
    .then((data) => data.json())
    .then( (photos) => {
        [...photos].forEach((photo) => {
            mainDiv.appendChild(addData(photo['url'], photo['title'], photo['id']));
        });
    })

}

var count = 50;

function fadeOutEffect(event) {
    var fadeTarget = event.currentTarget;
    var fadeEffect = setInterval(function () {
        if (!(fadeTarget.style.opacity)) {
            fadeTarget.style.opacity = 1;
        }
        if (fadeTarget.style.opacity > 0) {
            fadeTarget.style.opacity -= 0.05;
        } else {
            clearInterval(fadeEffect);
            fadeTarget.remove();
            count -= 1;
            document.getElementById('items-count').innerHTML = `There are ${count} photo(s) being displayed.`;
        }
    }, 50);

}

var item = document.getElementsByClassName("item");
let url = "https://jsonplaceholder.typicode.com/albums/2/photos";
fetch(url)
.then((data => data.json()))
.then ((photos) => {
    [...photos].forEach((photo) => {
        document.querySelector(".item").addEventListener("click", fadeOutEffect(photo));
    })
    document.getElementById('items-count').innerHTML = `There are ${photos.length} photo(s) being displayed.`;
});

function setFlashMessageFadeOut() {
    setTimeout(() => {
        let currentOpacity = 1.0;
        let timer = setInterval(() => {
            if (currentOpacity < 0.05) {
                clearInterval(timer);
                flashElement.remove();
            }
            currentOpacity = currentOpacity - 0.05;
            flashElement.style.opacity = currentOpacity;
        }, 50)
    }, 4000);
}


let flashElement = document.getElementById('flash-message');
if (flashElement) {
    setFlashMessageFadeOut();
}