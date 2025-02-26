// // import express from "express"
// // import cors from "cors"
// // // import pg from "pg"

// // const app = express();

// // app.use(express.json());
// // // // app.get('/hazards')
// // // // app.get('/reports')
// // // // app.post('/reports')

// // app.listen(3000, () => {
// //     console.log("Server is running on http://localhost:3000");
// // });

const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);

    try {
        // supabase setup
        var supabase_js_1 = require("@supabase/supabase-js");
        // read `.env`
        require('dotenv').config();

        // connect to database
        var supabaseUrl = 'https://lhbvrjbqokpjbubaanqv.supabase.co';
        var supabaseKey = process.env.SUPABASE_KEY;
        var supabaseClient = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
        var tables = {
            hazards: supabaseClient.from('hazards'),
            reports: supabaseClient.from('reports'),
            users: supabaseClient.from('users'),
        };

        // my routes
        // app.get('/testtwo', (req, res) => {
        //     res.send('Hello, World!');
        // });

        app.get('/hazards', function (req, res) {
            tables.hazards.select('*').then(function (data) {
                console.log(data)
                res.json(data.data);
            });
        });

        app.post('/reports', function (req, res) {
            var default_userID = 1;

            // // Get current timestamp eg. 2021-09-01T12:00:00.000Z
            // // Get current date and time
            // const now = new Date();
            // // Unix timestamp
            // const unixTimestamp = now.getTime();
            // // ISO 8601 timestamp
            // const isoTimestamp = now.toISOString
            // console.log('ISO 8601 Timestamp:', isoTimestamp);

            const { id, user_id, hazard_id, description, time_start, latitude, longitude, estimated_duration, is_planned, severity } = req.body;

            if (!description) {
                res.json({ error: 'bad request, send data' });
                return;
            }

            tables.reports.insert({
                user_id: default_userID,
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
                res.json("success");
            })
            .catch(function (error) {
                res.json({ error: error.message });
            });
        });
    } catch (e) {
        console.error(e);
    }
});