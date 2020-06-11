function getAllBreedsObject() {
    return axios.get('https://dog.ceo/api/breeds/list/all')
        .then(response => {
            return response.data.message;
        })
        .catch(error => {
            console.log(error);
        });
};

function getBreedImages(breed) {
    return axios.get(`https://dog.ceo/api/breed/${breed}/images/random/3`)
        .then(response => {
            return response.data.message;
        })
        .catch(error => {
            console.log(error);
        });
};

function getRandoms() {
    return axios.get('https://dog.ceo/api/breeds/image/random/3')
        .then(response => {
            return response.data.message;
        })
        .catch(error => {
            console.log(error);
        });
};

function getSubBreedsList(breed) {
    return axios.get(`https://dog.ceo/api/breed/${breed}/list`)
        .then(response => {
            return response.data.message;
        })
        .catch(error => {
            console.log(error);
        });
};

function getSubBreedImages(breed, subBreed) {
    return axios.get(`https://dog.ceo/api/breed/${breed}/${subBreed}/images/random/3`)
        .then(response => {
            return response.data.message;
        })
        .catch(error => {
            console.log(error);
        })
}

export default {
    getAllBreedsObject: getAllBreedsObject,
    getBreedImages: getBreedImages,
    getRandoms: getRandoms,
    getSubBreedsList: getSubBreedsList,
    getSubBreedImages: getSubBreedImages,
};
