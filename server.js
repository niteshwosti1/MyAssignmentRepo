require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

//Function to validate user input
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
// Function to calculate mean
function calculateMean(numbers) {
    let sum =0;
   for (const num of numbers){
        sum+= num;
   }
    return sum/numbers.length
}
//Function to calculate Standard Deviation
function calculateStandardDeviation(numbers){
   const mean = calculateMean(numbers);
   let sumOfSqDiff = 0;
    for(const num of numbers){
        const SqDiff = num - mean;
        sumOfSqDiff += SqDiff * SqDiff;
    }
    const variance = sumOfSqDiff/numbers.length;
    return Math.sqrt(variance);
}
// Endpoint to check server health
app.get('/health',(req,res)=>{
    res.json({status:"Server is healthy", port: PORT});
})

//Endpoint to calculate mean
app.post('/mean',(req,res)=>{
    const error = validateUserInput(req.body);
    if(error){
        return res.status(400).json({error});
    }
    const result = calculateMean(req.body);
    res.json({mean: Number.parseFloat(result.toFixed(3))});
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;