/*
To use any of the "access" functions you will have to pass a callback function to the function you are calling similar to the following.
You can't move the data out of the function due to the functions being asynchronous, so you'll have to preform any operations that require database information insid this function area.
==================================
var sql = require('./mysql.js');
s.accessPage(page_id, function(err, result)
{
	//Preform actions on the result
}
==================================

Result will always be an array each row returned from MySQL will be its own entry
row 1 will be result[0]
row 2 will be result[1]
row n will be result[n-1]
Each of the columns are indexed so they can be called like the following
result[0].comic_ic
result[0].page_id
*/
var mysql = require('mysql');
const config = require('./config.js');

//creates the MySQl connection string
const pool = mysql.createPool(
	{
		connectionLimit: 100,
		queueLimit : 0,
		host: config.meta.credentials.host,
		user: config.meta.credentials.user,
		password: config.meta.credentials.password,
		database: config.meta.credentials.database
	});

//Sub function that helps get the number of pages for inserting a new page
function getPageNumber(comic_id, callback) {
	var sql = `SELECT COUNT(*) as page_number FROM comic_page_list WHERE comic_id = '${comic_id}'`;
	pool.getConnection(function (err, con) {
		con.query(sql, function (err, result) {
			if (err) return console.log(err);
			callback(null, ++result[0].page_number);
		});
	});
}

/*
The methods for the MySQL connection, they can be called like the following
============================
var s = require(./mysql.js);
s.methodName(var1, var2, var3);
============================
*/
module.exports =
	{
		/*
		Creates a user in the database

		Inputs:
			username: the username of the user
			email_address: The user's email address
			pass: the user's password, it should be hashed by this point hopefully

		Returns:
			result: a boolean value for if the insertion was successful or not
		*/
		createUser: function (username, emailAddress, pass) {
			var sql = `INSERT INTO users (display_name, email_address, password) VALUES ('${username}', '${emailAddress}', '${pass}')`;
			pool.getConnection(function (err, con) {
				con.query(sql, function (err, result) {
					if (err) {
						throw err;
						return false;
					}
				});
			});
		},

		/*
		Pulls the user information from the database

		Inputs:
			Username: username of the user that we want to access

		Returns:
			result: Contains the array of all of the user's information that was saved in the database;
		*/
		accessUser: function (username, callback) {
			var sql = `SELECT * FROM users WHERE display_name = '${username}'`;
			pool.getConnection(function (err, con) {
				con.query(sql, function (err, result) {
					if (err)
						throw err;
					else
						return callback(result);
				});
			});
		},

		accessUserByEmail: function (emailAddress, callback) {
			var sql = `SELECT * FROM users WHERE email_address = '${emailAddress}'`;
			pool.getConnection(function (err, con) {
				con.query(sql, function (err, result) {
					if (err)
						throw err;
					return callback(result);
				});
			});
		},

		/*
		Creates an entry for a new comic in the database

		Inputs:
			username: username of the user that is creating the comic
			comic_name: name of the comic that is being made
			tags: text of the tags that are associated with the comic, json data will work, or any text
			isPrivate: a boolean that says if the comic should be private

		Returns:
			boolean: tells if the insertion was successful or not

		TODO: If private is true a second function should be called to create the private table
		*/
		createComic: function (username, comic_name, tags, isPrivate, descrip) {
			var sql = `INSERT INTO comics (user_id, comic_name, tags, is_private, descrip) VALUES ('${username}', '${comic_name}', '${tags}', '${isPrivate}', '${descrip})`;
			pool.getConnection(function (err, con) {
				con.query(sql, function (err, result) {
					if (err) {
						throw err;
						return false;
					}
				});
				return true;
			});
		},

		/*
		Pulls the data for a comic that exist in the database

		Inputs:
			comic_name: the name of the comic that you want to pull

		Returns:
			result: an array of all of the data in the comic table
				columns:
					user_id: id of the user that created the comic
					comic_name: the comics name
					tags: the tag list for the comic
					is_pirvate: says if the comic is private or not
					descrip: description of the comic
		*/
		accessComic: function (comic_name, callback) {
			var sql = `SELECT * FROM comics WHERE comic_name = '${comic_name}'`;
			pool.getConnection(function (err, con) {
				con.query(sql, function (err, result) {
					if (err)
						throw callback(err);
					else
						return callback(err, result);
				});
			});
		},

		/*
		Inserts a new page to the database and adds it to the comics page list

		Inputs:
			comic_id:
			creator_user_id:
			layout:
		Returns:
			Nothing
		*/
		createPage: function (comic_id, creator_user_id, layout) {
			var sql = `INSERT INTO pages (layout) VALUES ('${layout}')`;
			pool.getConnection(function (err, con) {
				con.query(sql, function (err, result) {
					if (err) console.log(err);
					//Subfunction that is used to get the page number
					getPageNumber(comic_id, function (err, page_number) {
						var sql2 = `INSERT INTO comic_page_list (comic_id, page_number, creator_user_id, page_id) VALUES ('${comic_id}', '${page_number}', '${creator_user_id}', '${result.insertId}')`;
						con.query(sql2, function (err, result) {
							if (err) console.log(err);
						});
					});
				});
			});
		},

		/*
		accesses the page of the provided id

		Inputs:
			page_id: page id that you want to access
		Returns:
			results: an array of the contents of the table for this page id
				columns:
					layout: the layout of the page
		*/
		accessPage: function (page_id, callback) {
			var sql = `SELECT * from pages WHERE page_id = '${page_id}'`;
			pool.getConnection(function (err, con) {
				con.query(sql, function (err, result) {
					if (err) callback(err);
					callback(null, result);
				});
			});
		},
		/*
		accesses the page of the provided id

		Inputs:
				page_id: page id that you want to access
		Returns:
			results: an array of the contents of the table for this page id
				columns:
					layout: the layout of the page
		*/
		accessComicPageList: function (comic_id, callback) {
			var sql = `SELECT * from comic_page_list WHERE comic_id = '${comic_id}'`;
			pool.getConnection(function (err, con) {
				con.query(sql, function (err, result) {
					if (err) callback(err);
					callback(null, result);
				});
			});
		},

		createImage: function () {
		},

		accessImage: function () {

		},

		forkComic: function () {
			//Not done
		},
	}
