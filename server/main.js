const express = require('express');
const { lstat } = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.listen(PORT, (error) => {
    if (!error) {
        console.log(`Example app listening at http://localhost:${PORT}`);
    } else {
        console.log(error);
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});
    

