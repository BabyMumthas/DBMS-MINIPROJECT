const axios = require("axios");

const apiClient = axios.create({
    baseURL: "https://exampleapi.com", // Replace with the actual API base URL
    headers: {
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
        "X-RapidAPI-Host": "exampleapi.com", // Replace with the actual API host
    },
});

module.exports = apiClient;
