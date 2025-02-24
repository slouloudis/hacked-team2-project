const express = require('express');
const { lstat } = require('fs');
const path = require('path');

// import modules for supabase 
import { createClient } from '@supabase/supabase-js';

// quick hand notation
import { decodeJson, encodeJson } from './json.js';
import { parse } from 'dotenv';

console.log(decodeJson('{"test": "test"}'));

// read `.env`
require('dotenv').config();

// init app
const app = express();
// set port
const PORT: number = 3000;

// connect to database
const supabaseUrl: string = 'https://lhbvrjbqokpjbubaanqv.supabase.co';
const supabaseKey: string = process.env.SUPABASE_KEY!;
const supabaseClient = createClient(supabaseUrl, supabaseKey);
const tables = {
    hazards: supabaseClient.from('hazards'),
    reports: supabaseClient.from('reports'),
    users: supabaseClient.from('users'),
}

// sets a default error
app.listen(PORT, (error) => {
    if (!error) {
        console.log(`Example app listening at http://localhost:${PORT}`);
    } else {
        console.log(error);
    }
});

// sets a home screen of index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// a test connection for the sql
app.get('/get-hazards', (req, res) => {
    tables.hazards.select('*').then((data) => {
        res.send(data.data);
    })
});

app.get('/get-users', (req, res) => {
    tables.users.select('*').then((data) => {
        res.send(data.data);
    })
});

app.get('/get-reports', (req, res) => {
    tables.users.select('*').then((data) => {
        res.send(data.data);
    })
});