# prerequisites

* node


## local host roots

### `/` root
this take you to the home page of index.html

### `hazards`
#### GET
returns the table of all hazards. this is the types of hazards.
```json
// example data
[
    {"id":1,"name":"Fallen tree","description":"A tree has fallen over on a pathway, causing disruption for pedestrians hoping to cross the footpath.","severity":"low"},
    {"id":2,"name":"Icy roads","description":"Due to snowfall the roads have become icy, causing risk of vehicles of losing control causing an accident","severity":"medium"},
    {"id":5,"name":"Flooded Roads","description":"Heavy rainfall has caused roads to be submerged, posing a risk of vehicles stalling and being swept away","severity":"high"},
]
```

### `users`
#### GET
returns the tales of all users. 
```json
// example data
[
    {"id":1,"clerk_id":"id1"},
    {"id":2,"clerk_id":"id2"},
    {"id":3,"clerk_id":"id3"}
]
```


### `reports`
#### GET
returns the tables of all the reports. these are uploaded by users and automated pi.
```json
// example data
[
    {"id":1,"clerk_id":"id1"},
    {"id":2,"clerk_id":"id2"},
    {"id":3,"clerk_id":"id3"}
]
```

#### POST
adds a new a report to the table.
```js
fetch(
    `localhost:3000/reports/${userId}/${hardIdType}/${description}/${latitude}/${longitude}/${estDuration}/${isPlaned}`
)
```

#### POST
uploads a report with params

### `user-reports`
#### GET
returns a table with report that the `id` corresponds to the user. 
```js
// example request
const data = fetch(`http://localhost:3000/user-reports/${userId}`)
```
```json
// example data
[
    {"id":1,"user_id":1,"hazard_id":1,"description":"Tree fallen over","time_start":"2025-02-24T09:00:00","latitude":53.6309,"longitude":1.2974,"estimated_duration":"unknown","is_planned":false},
]
```



