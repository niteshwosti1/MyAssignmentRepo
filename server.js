const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

function validateUserInput(body){
    // Check if the array is valid and not empty
    if (!Array.isArray(body) || body.length === 0) {
        return "Invalid input: Expected a valid non-empty array.";
    }
    //Check if the item in array is number or not
    for (const item of body) {
        if (typeof item !== 'number' || Number.isNaN(item)) {
            return "Invalid input: Expected an array of numbers.";
        }
    }
    return null;
}