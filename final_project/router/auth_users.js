const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];
let currentUser;
 
const isValid = (username)=>{                     //returns boolean
    let userInUse = users.filter((user) => {
        return user.username === username
    });
    if (userInUse.length > 0) {
        return true;
    }
    else {
        return false;
    }
}

const authenticatedUser = (username,password) => { //returns boolean
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password)
    });

    if (validusers.length > 0) {
        currentUser = username;
        return true;
    }
    else {
        return false;
    }
}


//only registered users can login
regd_users.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        res.status(404).json({message: "Error logging in"})
    }
    if (authenticatedUser(username,password)) {
        let accessToken = jwt.sign({
            data: password
        }, 'access', {expiresIn: 60 * 60 * 5});

        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User succesfully logged in.");
    }
    else {
        return res.status(300).json({message: "Invalid login. check username and password"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.body.review;
    const reviewObj = books[isbn].reviews;

    if (books[isbn].isbn === isbn) {                //need need test for, updating own, 2nd user posting review
        reviewObj[currentUser] = review;
        return res.status(200).send({message: "The user " + currentUser + " succesfully added a review under the book ISBN:" + isbn});
    }
    else {
        return res.status(300).json({message: "Error to add the review!"});
    }
});

//delete books review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const reviewObj = books[isbn].reviews;
    if (!reviewObj[currentUser]) {
        res.status(300).json({message: "You don't have a review under the book ISBN: " + isbn});
    }
    if (isbn) {
        if (isbn) [
            delete reviewObj[currentUser]
        ]
        res.status(200).json({message: "Review by the user: " + currentUser + " under the ISBN: " + isbn + " was succesfully deleted!"})
    } 
    else {
        res.status(300).json({message: "Something went wrong trying to delete your review."})
    }
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
