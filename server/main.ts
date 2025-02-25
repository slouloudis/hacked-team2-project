// #region set up

const express = require('express');
const { lstat } = require('fs');
const path = require('path');

// import modules for supabase 
import { createClient } from '@supabase/supabase-js';

// quick hand notation
import { decodeJson, encodeJson } from './json.js';
import { parse } from 'dotenv';

// read `.env`
require('dotenv').config();

// init app
const app = express();
// set port
const PORT: number = 3000;
// needed for post and get requests
app.use(express.json());

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
        console.info(`Example app listening at http://localhost:${PORT}`);
    } else {
        console.error(error);
    }
});

// sets a home screen of index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// #endregion setup

// a test connection for the sql
app.get('/hazards', (req, res) => {
    tables.hazards.select(
        '*'
    ).then((data) => {
        res.send(data.data);
    })
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

app.get('/reports', (req, res) => {
    tables.reports.select(
        '*'
    ).then((data) => {
        res.send(data.data);
    })
});

app.post('/reports', (req, res) => {
    // console.log(req.body);
    
    const {hazard_id, description, time_start, latitude, longitude, estimated_duration, is_planned, severity} = req.body  

    const user_id = 1;

    if (!req.body.description === null) {
        res.json({error: 'bad request, send data'})
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
        .then((data) => {
            // res.json(data.data);
            res.json("success")
        })
    } catch (e) {
        console.error(e);

        res.json("error in catch")
        // res.json({error: e.message});
    }
});


app.delete('/report/:id', (req, res) => {
    let reportId: string = req.params.id;
    if (reportId == null) {
        res.send('provide report id');
        return;
    }
    reportId = reportId.toString();

    tables.reports.delete().eq('id', reportId).then((data) => {
        res.send(data.data);
    })
})


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



