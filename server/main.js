"use strict";
// #region set up
Object.defineProperty(exports, "__esModule", { value: true });
var express = require('express');
var lstat = require('fs').lstat;
var path = require('path');
var cors = require('cors')
// import modules for supabase 
var supabase_js_1 = require("@supabase/supabase-js");
// read `.env`
require('dotenv').config();
// init app
var app = express();
// set port
var PORT = 3000;
// needed for post and get requests
app.use(express.json());
app.use(cors())
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
        console.info("Example app listening at http://localhost:".concat(PORT));
    }
    else {
        console.error(error);
    }
});
// sets a home screen of index.html
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});
// #endregion setup
// a test connection for the sql
app.get('/hazards', function (req, res) {
    tables.hazards.select('*').then(function (data) {
        console.log(data)
        res.json(data.data);
    });
});
// // app.get('/users', (req, res) => {
// //     tables.users.select(
// //         '*'
// //     ).then((data) => {
// //         res.send(data.data);
// //     })
// // });
// // app.get('/user-reports/:id', (req, res) => {
// //     console.log(req.params)
// //     let userId: string = req.params.id;
// //     if (userId == null) {
// //         res.send('provide id'); 
// //         return;
// //     }
// //     userId = userId.toString();
// //     tables.reports.select(
// //         `*`
// //     ).eq(
// //         'user_id',
// //         userId
// //     ).then((data) => {
// //         res.send(data.data);
// //     })  
// // });
app.get('/reports', function (req, res) {
    tables.reports.select('*').then(function (data) {
        res.send(data.data);
    });
});
app.post('/reports', function (req, res) {
    console.log(req.body);
    var _a = req.body, hazard_id = _a.hazard_id, description = _a.description, time_start = _a.time_start, latitude = _a.latitude, longitude = _a.longitude, estimated_duration = _a.estimated_duration, is_planned = _a.is_planned, severity = _a.severity;
    var user_id = 1;
    if (!req.body.description === null) {
        res.json({ error: 'bad request, send data' });
        return;
    }
    try {
        tables.reports.insert({
            user_id: user_id,
            hazard_id: hazard_id,
            description: description,
            time_start: time_start,
            latitude: latitude,
            longitude: longitude,
            estimated_duration: estimated_duration,
            is_planned: is_planned,
            severity: severity
        })
            .then(function (data) {
            // res.json(data.data);
            res.json("success");
        });
    }
    catch (e) {
        console.error(e);
        res.json("error in catch");
        // res.json({error: e.message});
    }
});
app.delete('/report/:id', function (req, res) {
    var reportId = req.params.id;
    if (reportId == null) {
        res.send('provide report id');
        return;
    }
    reportId = reportId.toString();
    tables.reports.delete().eq('id', reportId).then(function (data) {
        res.send(data.data);
    });
});
/*

?: GET all reports
?: POST new report (assume req.body has same fields as database)
?  GET all hazards

Todo: GET a report by it’s ID
Todo: GET all report

Optional:
Todo: UPDATE change status/severity of report reports(description)
Todo: DELETE report

*/
