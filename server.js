require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({limit:'1mb'}));

app.use((err, req, res, next) => {
    if (err.type === 'entity.parse.failed'){
        return res.status(400).json({
            error:"Invalid JSON body"
        });
    }
    next(err);
})

//Function to validate user input
function validateUserInput(body){
    // Check if the array is valid and not empty
    if (!Array.isArray(body) || body.length === 0) {
        return "Invalid input: Expected a valid non-empty array.";
    }
    //Check if the item in array is number and is finite value.
    for (const item of body) {
        if (typeof item !== 'number' || Number.isNaN(item)) {
            return "Invalid input: Expected an array of numbers.";
        }
        if (!Number.isFinite(item)) {
            return "Invalid input: Array contains infinite value(s).";
        }
    }
    //Check if the body is udefined or null
    if (body === undefined || body === null) {
        return "Invalid input: Expected an array of numbers.";
    }
    //Check if the array length exceeds the maximum load limit set
    const MAX_LENGTH = 100000;
    if (body.length > MAX_LENGTH) {
        return "Invalid input: Array length exceeds the maximum load limit";
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

//Endpoint to calculate standard deviation
app.post('/stddev',(req,res)=>{
    const error = validateUserInput(req.body);
    if (error){
        return res.status(400).json({error});
    }
    const result = calculateStandardDeviation(req.body);
    res.json({standardDeviation: Number.parseFloat(result.toFixed(3))});
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;