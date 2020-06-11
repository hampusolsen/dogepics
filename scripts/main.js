import data from './import';

window.addEventListener('hashchange', renderFromHash);

const breedSelector = document.querySelector('#breeds');
breedSelector.addEventListener('change', getBreeds);

const refreshButton = document.querySelector('footer > i');
refreshButton.addEventListener('click', getBreeds);

function capitalize(string) {
    return string[0].toUpperCase() + string.slice(1);
};

data.getAllBreedsObject() // gets object with all breed & subbreed names
    .then(allBreeds => {

        for (let breed in allBreeds) {
            const breedOption = document.createElement('option');
            breedOption.value = breed;
            breedOption.textContent = capitalize(breed);
            if (allBreeds[breed].length > 0)
                breedOption.hassubbreed = true;

            breedSelector.appendChild(breedOption);
        };

        getBreeds(allBreeds);
    });

function renderFromHash() {
    let hash = window.location.hash.slice(1);

    if (hash.includes('-')) {
        hash = hash.split('-');

        data.getAllBreedsObject()
            .then(allBreeds => {
                for (let breed in allBreeds) {
                    if (breed === hash[0]) {
                        for (let i = 0; i < Object.keys(allBreeds).length; i++) { // sets option to breed in hash
                            if (Object.keys(allBreeds)[i] === hash[0]) {
                                breedSelector.selectedIndex = i + 1;
                                getBreeds();
                                break;
                            };
                        };

                        for (let subBreed of allBreeds[breed]) {
                            if (subBreed === hash[1]) {
                                refreshButton.removeEventListener('click', getBreeds);
                                refreshButton.removeEventListener('click', getSubBreeds);
                                refreshButton.addEventListener('click', renderFromHash);
                                data.getSubBreedImages(hash[0], hash[1])
                                    .then(subBreedImages => {
                                        renderImages(subBreedImages);
                                        const subBreedSelector = document.querySelector('#subBreeds');
                                        for (let i = 0; i < allBreeds[breed].length; i++) { // sets option to sub-breed in hash
                                            if (allBreeds[breed][i] === hash[1]) {
                                                subBreedSelector.selectedIndex = i + 1;
                                                getSubBreeds();
                                                break;
                                            };
                                        };
                                    });

                                return;
                            };
                        };
                    };
                };
            });
    } else {
        data.getAllBreedsObject()
            .then(allBreeds => {
                for (let breed in allBreeds) {
                    if (breed === hash) {
                        for (let i = 0; i < Object.keys(allBreeds).length; i++) { // sets option to breed in hash
                            if (Object.keys(allBreeds)[i] === hash) {
                                breedSelector.selectedIndex = i + 1;
                                getBreeds();
                                break;
                            };
                        };

                        refreshButton.removeEventListener('click', getBreeds);
                        refreshButton.removeEventListener('click', getSubBreeds);
                        refreshButton.addEventListener('click', renderFromHash);

                        data.getBreedImages(hash)
                            .then(breedImages => {
                                renderImages(breedImages);
                            });

                        return;
                    };
                };
            });
    };
};

function getBreeds() { // gets subbreeds and creates subbreed <select>
    if (document.querySelector('#subBreeds')) {
        const subBreedSelector = document.querySelector('#subBreeds');
        subBreedSelector.parentElement.removeChild(subBreedSelector);
        refreshButton.removeEventListener('click', getSubBreeds);
        refreshButton.addEventListener('click', getBreeds);
    };

    if (breedSelector.options[breedSelector.selectedIndex].value === 'placeholder') {
        data.getRandoms()
            .then(randomImages => {
                renderImages(randomImages);
            });
    } else if (breedSelector.options[breedSelector.selectedIndex].hassubbreed) {
        data.getSubBreedsList(breedSelector.value)
            .then(subBreeds => {
                const selectsWrapper = document.querySelector('.selectsWrapper'),
                    selectsContainer = document.createElement('div'),
                    subBreedSelector = document.createElement('select');

                selectsContainer.className = 'selectContainer';
                subBreedSelector.id = 'subBreeds';

                const subBreedPlaceholder = document.createElement('option');
                subBreedPlaceholder.value = 'placeholder';
                subBreedPlaceholder.textContent = 'Select sub-breed';
                subBreedSelector.appendChild(subBreedPlaceholder);

                for (let subBreed of subBreeds) {
                    const subBreedOption = document.createElement('option');
                    subBreedOption.value = subBreed;
                    subBreedOption.textContent = capitalize(subBreed);
                    subBreedSelector.appendChild(subBreedOption);
                };

                selectsContainer.appendChild(subBreedSelector);
                selectsWrapper.appendChild(selectsContainer);

                subBreedSelector.addEventListener('change', getSubBreeds);

                data.getBreedImages(breedSelector.value)
                    .then(breedImages => {
                        renderImages(breedImages)
                    });
            });
    } else {
        data.getBreedImages(breedSelector.value)
            .then(breedImages => {
                renderImages(breedImages);
            });
    };
};

function getSubBreeds() {
    refreshButton.removeEventListener('click', getBreeds);
    refreshButton.removeEventListener('click', renderFromHash);
    refreshButton.addEventListener('click', getSubBreeds);

    let subBreedSelector = document.querySelector('#subBreeds');

    if (subBreedSelector.value === 'placeholder') {
        data.getBreedImages(breedSelector.value)
            .then(breedImages => {
                renderImages(breedImages);
            });
    } else {
        data.getSubBreedImages(breedSelector.value, subBreedSelector.value)
            .then(subBreedImages => {
                renderImages(subBreedImages);
            });
    };
};

function renderImages(array) {
    const imagesContainer = document.querySelector('.imagesContainer');
    imagesContainer.innerHTML = '';

    for (let image of array) {
        const img = document.createElement('img');

        img.src = image;

        imagesContainer.appendChild(img);
    };
};
