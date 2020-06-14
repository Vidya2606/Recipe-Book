const usersStore = require('./usersStore');
const { v4: uuidv4 } = require('uuid');

const users = {
    //Create new uid for a new login
    createUid: function (username) {
        users.validateUsername(username);
        let uid = uuidv4();
        usersStore.usersDB[uid] = username;
        return uid;
    },

    //Delete uid on logout
    deleteUid: function(uid) {
        delete usersStore.usersDB[uid];
    },

    //checks if the username entered is valid
    validateUsername: function (username) {
        if(!username
           || username.replace(/\s/g, '').length < 1
           || username === null
           || username === undefined
           || username.indexOf(' ') >= 0
           || username.includes('dog')) {
               throw "bad login";
        }
    },
    //Checks if the uid is valid
    validateRequest: function(req) {
        if(req.cookies === null || req.cookies.uid === undefined) {
            throw "not authorized";
        }
        if(usersStore.usersDB[req.cookies.uid.uid] === undefined) {
            throw "not authorized";
        }
        return usersStore.usersDB[req.cookies.uid.uid];
    }
}
module.exports = users;