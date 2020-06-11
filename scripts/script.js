const breedSelector = document.querySelector('#breeds'),
    subBreedSelector = document.querySelector('#subBreeds'),
    refreshButton = document.querySelector('footer > i'),
    imagesContainer = document.querySelector('.imagesContainer');

let breeds;

addEventListener('load', init);
addEventListener('hashchange', getImages);
addEventListener('hashchange', setSelectors);
breedSelector.addEventListener('change', setBreed);
breedSelector.addEventListener('change', checkBreedForSub);
subBreedSelector.addEventListener('change', setSubBreed);
refreshButton.addEventListener('click', getImages);

function capitalize(string) {
    return string[0].toUpperCase() + string.slice(1);
}

function checkBreedForSub() {
    while (subBreedSelector.children.length > 0) {
        subBreedSelector.removeChild(subBreedSelector.firstElementChild);
    }
    if (breedSelector.selectedOptions[0].hasAttribute('data-sub')) {
        pushSubBreeds(breeds[breedSelector.value]);
    } else {
        subBreedSelector.style.display = 'none';
    }
}

function checkHash() {
    let hash = [];

    if (location.hash.includes('-')) {
        hash = location.hash.slice(1).split('-');
    } else {
        hash.push(location.hash.slice(1));
    }

    return hash;
}

function getImages() {
    if (location.hash === '') {
        axios.get('https://dog.ceo/api/breeds/image/random/3')
            .then(response => {
                renderImages(response.data.message);
            })
    } else if (location.hash.includes('-')) {
        const breed = location.hash.split('-')[0].slice(1);
        const subBreed = location.hash.split('-')[1];

        axios.get(`https://dog.ceo/api/breed/${breed}/${subBreed}/images/random/3`)
            .then(response => {
                renderImages(response.data.message);
            })
    } else {
        const breed = location.hash.slice(1);

        axios.get(`https://dog.ceo/api/breed/${breed}/images/random/3`)
            .then(response => {
                renderImages(response.data.message);
            })
    }
}

function getList() {
    axios.get('https://dog.ceo/api/breeds/list/all')
        .then(response => {
            breeds = response.data.message;
            pushBreeds(breeds);
        })
}

function init() {
    getList();
    getImages();
}

function pushBreeds(breeds) {
    for (let breed in breeds) {
        const option = document.createElement('option');

        if (breeds[breed].length > 0) {
            option.setAttribute('data-sub', true);
        }

        option.textContent = capitalize(breed);
        option.value = breed;
        breedSelector.appendChild(option);
    }

    setSelectors();
}

function pushSubBreeds(subBreeds) {
    const option = document.createElement('option');
    option.textContent = 'All sub-breeds';
    option.value = '';
    subBreedSelector.appendChild(option);

    for (let subBreed of subBreeds) {
        const option = document.createElement('option');
        option.textContent = capitalize(subBreed);
        option.value = subBreed;
        subBreedSelector.appendChild(option);
    }

    subBreedSelector.style.display = 'block';
}

function renderImages(images) {
    while (imagesContainer.children.length > 0) {
        imagesContainer.removeChild(imagesContainer.firstElementChild);
    }

    for (let image of images) {
        const img = document.createElement('img');
        img.src = image;
        imagesContainer.appendChild(img);
    }
}

function setBreed() {
    if (location.hash.slice(1) === breedSelector.value) return;
    else location.hash = breedSelector.value;
}

function setSelectors() {
    const hash = checkHash(),
        array = [...breedSelector.children];

    for (let i = 0; i < array.length; ++i) {
        if (array[i].value === hash[0]) {
            breedSelector.selectedIndex = i;
            checkBreedForSub();
        }

        if (i > 0) {
            let subs = [...subBreedSelector.children];

            for (let j = 0; j < subs.length; ++j) {
                if (subs[j].value === hash[1]) {
                    subBreedSelector.selectedIndex = j;
                }
            }
        }
    }
}

function setSubBreed() {
    if (subBreedSelector.value === '') location.hash = breedSelector.value;
    else location.hash = `${breedSelector.value}-${subBreedSelector.value}`;
}
