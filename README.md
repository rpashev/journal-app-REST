# Journal app REST API
Node/Express/Mongo REST API for my [Vue journal app](https://github.com/rpashev/vue-journal-app)


## Endpoints

- /signup &emsp; `POST`
- /login &emsp; `POST`
- /journals &emsp; `GET`
- /journals/:journalID &emsp; `GET` | `PATCH` | `DELETE`
- /journals/create-journal &emsp; `POST`
- /journals/:journalID/:entryID &emsp; `GET` | `PATCH` | `DELETE`
- /journals/:journalID/create-entry &emsp; `POST`


## Setup
### To get a local copy up and running follow these simple steps:

1. Make sure you have **`node`** and **`npm`** installed globally on your machine.  
2. Environmental variables - you need **JWT_SECRET** and **DB_CONNECTION** (mongoDB connection string) to run the app

3. Clone the repo  
    ### `git clone https://github.com/rpashev/journal-app-REST.git`  

3. Install NPM packages  
    ### `npm install`    
  
4. Run the app in development mode 
    ### `npm start`  
