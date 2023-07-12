const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios").default;


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!isValid(username)) {
            users.push({"username":username, "password":password});
            return res.status(200).json({message: "User succesfully registered, Now you can login"});
        }
        if (!username || !password) {
            return res.status(404).json({message: "Username &/or password was not provided."})
        }
        else {
            return res.status(404).json({message : "The user already exist!"});
        }
    }
    return res.status(300).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
    try {
        const get_books = new Promise((resolve, reject) => {
            resolve(res.status(300).json(books));
        });
        await get_books;
        console.log("Promise from task 10 resolved");
    }
    catch (err) {
        console.error(error);
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
    const isbn = req.params.isbn;
    try {
        const bookByIsbn = new Promise ((resolve, reject) => {
            resolve(res.status(300).json(books[isbn]));
        });
        await bookByIsbn;
        console.log("Promise from task 11 resolved")
    }
    catch (error) {
        console.error(error);
    }
});
  
// Get book details based on author
public_users.get('/author/:author', async (req, res) => {  // needs to display the isbn as well
    const author = req.params.author;
    try {
        const booksByAuthor = new Promise ((resolve, reject) => {
            let filtered_books = {};
            const booksIsbn = Object.values(books);
            const byAuthor = booksIsbn.filter((isbn) => isbn.author === author);
            filtered_books[author] = byAuthor;
            resolve(res.status(300).json(filtered_books));
        });
        await booksByAuthor;
        console.log("Promise from task 12 resolved")
    }
    catch (error) {
        console.error(error);
    }
});

// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
    const title = req.params.title;
    try {
        const booksByTitle = new Promise ((resolve, reject) => {
            let filteredByTitle = {};
            const booksIsbn = Object.values(books);
            const byTitle = booksIsbn.filter((isbn) => isbn.title === title);
            filteredByTitle[title] = byTitle;
            resolve(res.status(300).json(filteredByTitle));
        });
        await booksByTitle;
        console.log("Promise from task 13 resolved")
    }
    catch {
        console.error(error);
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    return res.status(300).json(books[isbn].reviews);
});

module.exports.general = public_users;
