const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!isValid(username)) {
            users.push({"username":username, "password":password});
            return res.status(200).json({message: "User succesfully registered, Now you can login"});
        }
        if (username.length < 0 || password.length < 0) {
            return res.status(404).json({message: "Username &/or password was not provided."})
        }
        else {
            return res.status(404).json({message : "The user already exist!"});
        }
    }
    return res.status(300).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    return res.status(300).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    return res.status(300).json(books[isbn]);
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {  // needs to display the isbn as well
    const author = req.params.author;
    const booksIsbn = Object.values(books);
    const booksByAuthor = {Author: booksIsbn.filter((isbn) => isbn.author === author)}
    return res.status(300).json(booksByAuthor);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    const booksIsbn = Object.values(books);
    const booksByTitle = booksIsbn.filter((isbn) => isbn.title === title);
    return res.status(300).json(booksByTitle);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    return res.status(300).json(books[isbn].reviews);
});

module.exports.general = public_users;
