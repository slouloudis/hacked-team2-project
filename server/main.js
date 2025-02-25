"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require('express');
var lstat = require('fs').lstat;
var path = require('path');
// import modules for supabase 
var supabase_js_1 = require("@supabase/supabase-js");
// quick hand notation
// var json_js_1 = require("./json.js");
// console.log((0, json_js_1.decodeJson)('{"test": "test"}'));
// read `.env`
require('dotenv').config();
// init app
var app = express();
// set port
var PORT = 3000;
// connect to database
var supabaseUrl = 'https://lhbvrjbqokpjbubaanqv.supabase.co';
var supabaseKey = process.env.SUPABASE_KEY;
var supabaseClient = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
var tables = {
    hazards: supabaseClient.from('hazards'),
    reports: supabaseClient.from('reports'),
    users: supabaseClient.from('users'),
};
// sets a default error
app.listen(PORT, function (error) {
    if (!error) {
        console.log("Example app listening at http://localhost:".concat(PORT));
    }
    else {
        console.log(error);
    }
});
// sets a home screen of index.html
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});
// a test connection for the sql
app.get('/get-hazards', function (req, res) {
    tables.hazards.select('*').then(function (data) {
        console.log(data)
        res.json(data.data);
    });
});
app.get('/get-users', function (req, res) {
    tables.users.select('*').then(function (data) {
        res.json(data.data);
    });
});
app.get('/get-reports', function (req, res) {
    tables.reports.select('*').then(function (data) {
        res.json(data.data);
    });
});
