/*
COP 4331C - Fall 2019
Brandon F.
Mitchell G.
Joshua G.
Andrew K.
Timothy O'B.
--------------------
This is the MySQL object that will interact with the database
The following functions are public can be called outside object
	createUser(username, emailAddress, userPassword);
	accessUser(username, callback)
	createComic(username, comicName, tags, isComicPrivate, comicDescription)
	accessComic(comicName, callback)
	createPage(comicId, creatorUserId, pageLayout)
	accessPage(pageIdtoAccess, callback)
	accessComicPageList(comicId, callback)
	forkComic(comicIdToSplit, newUserId, newPagelayout)
--------------------
To use any of the "access" functions you will have to pass a callback function to the function you are calling similar to the following.
You can't move the data out of the function due to the functions being asynchronous, so you'll have to preform any operations that require database information inside this function area.
==================================
var sql = require('./mysql.jd);
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
result[0].comic_id
result[0].page_id
*/
var mysql = require('mysql');
const config = require('./config.js');

//creates the MySQl connection string
const pool = mysql.createPool(
	{
		connectionLimit: 100,
		queueLimit: 0,
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
			callback(null, result[0].page_number);
		});
	});
}

//Copies all of the content for one comic to a new comic and copies the comic_page_list as well
function copyComic(comic_id_to_split, new_user_id, callback) {
	//Grab all of the data from one table and insert it as a new row, but with a new comic_id, and a new user_id
	var sql = `INSERT INTO comics (user_id, comic_name, tags, is_private, descrip) SELECT '${new_user_id}', comic_name, tags, is_private, descrip FROM comics WHERE comic_id = '${comic_id_to_split}';`;
	pool.getConnection(function (err, con) {
		con.query(sql, function (err, result) {
			if (err) throw err;
			var insertId = result.insertId;
			//Copy the comic_page_list for the source comic, but insert it with the new user id and the new comic id
			//Will create the new comic with the name '$currentComicName-$newUserID'
			var sql = `INSERT INTO comics (user_id, comic_name, tags, is_private, descrip) SELECT '${new_user_id}', concat(comic_name,'-',${new_user_id}), tags, is_private, descrip FROM comics WHERE comic_id = '${comic_id_to_split}';`;
			con.query(sql2, function (err, result2) { if (err) throw err; });
			//Now that the new comic and new comic page are made return and insert the new page
			//Result at this point still contains the comic_id
			callback(err, result);
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

		/*
		Removes the user data from the database
		Inputs:
			Username: username of the user that is to be removed
		Returns:
			Nothing
		*/
		deleteUser: function (username) {
			var sql = `DROP FROM users WHERE display_name = '${username}'`;
			pool.getConnection(function (err, con) {
				con.query(sql, function (err, result) {
					if (err) throw err;
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
		createComic: function (user_id, comic_name, tags, isPrivate, descrip, callback) {
			var sql = `INSERT INTO comics (user_id, comic_name, tags, descrip) VALUES ('${user_id}','${comic_name}', '${tags}', '${descrip}')`;
			pool.getConnection(function (err, con) {
				con.query(sql, function (err, result) {
					if (err) {
						throw err;
					}
					callback(err, result.insertId);
				});
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
			var sql = `SELECT * FROM comics WHERE comic_name like '%${comic_name}%'`;
			pool.getConnection(function (err, con) {
				con.query(sql, function (err, result) {
					if (err)
						throw callback(err, null);
					else
						return callback(err, result);
				});
			});
		},

		//passed a comics name and returns the id of the comic specified
		getComicIDByName: function (comic_name) {
			var sql = `SELECT comic_id FROM comics WHERE comic_name = '${comic_name}'`;
			pool.getConnection(function (err, con) {
				con.query(sql, function (err, result) {
					if (err) {
						throw err;
					}
					return result[0].comic_id;
				});
			});
		},

		accessComicByID: function (comic_id, callback) {
			var sql = `SELECT * FROM comics WHERE comic_id = '${comic_id}'`;
			pool.getConnection(function (err, con) {
				con.query(sql, function (err, result) {
					if (err)
						throw callback(err, null);
					else
						return callback(err, result);
				});
			});
		},

		//just removes the entry for the comic, no the actual comic, works for now : NEED TO ACTAULLY
		deleteComic: function (comic_id, user_id) {
			var sql1 = `SELECT user_id FROM  comics WHERE comic_id='${comic_id}'`;
			var sql2 = `SELECT page_id FROM comic_page_list WHERE comic_id='${comic_id}'`;
			var sql3 = `DELETE * FROM comics WHERE comic_id = '${comic_id}'`;
			pool.getConnection(function (err, con) {
				con.query(sql1, function (err, result) {
					if (err)
						throw err;

					if (result[0].user_id != user_id)
						return;

					con.query(sql2, function (err, result) {
						if (err)
							throw err;
					});
					con.query(sql3, function (err, result) {
						if (err)
							throw err;
					});
				});
			});
		},

		/*
		Inserts a new page to the database and adds it to the comics page list
		Inputs:
			comic_id: Comic_id of which comic this page is for
			creator_user_id: the user_id of the user that is inserting the page
			layout: layout of the page
		Returns:
			Nothing -> pageID
		*/
		createPage: function (comic_id, creator_user_id, layout) {
			var sql = `INSERT INTO pages (layout) VALUES ('${layout}')`;
			console.log(sql);
			pool.getConnection(function (err, con) {
				con.query(sql, function (err, result) {
					if (err) console.log(err, null);
					//Subfunction that is used to get the page number
					getPageNumber(comic_id, function (err, page_number) {
						var sql2 = `INSERT INTO comic_page_list (comic_id, page_number, creator_user_id, page_id) VALUES ('${comic_id}', '${page_number}', '${creator_user_id}', '${result.insertId}');`;
						console.log(sql2);
						con.query(sql2, function (err, result) {
							if (err) console.log(err);
						});
					});
				});
			});
		},

		updatePage: function (page_id, callback) {
			var sql1 = `SELECT layout FROM pages where page_id='${page_id}';`;
			pool.getConnection(function (err, con) {
				con.query(sql1, function (err, result) {
					if (err) console.log(err, null);
					var layout = callback(result);
					var sql2 = `UPDATE pages SET layout='${layout}' where page_id='${page_id}';`;
					con.query(sql2, function (err, result) {
						if (err) console.log(err, null);
					});
				});
			})
		},

		/*
		accesses the page of the provided id

		Inputs:
			page_id: page id that you want to access
		Returns:
			results: an array of the contents of the table for this page id
				columns:
					page_id: the numerical page_id for this page
					layout: the layout of the page
		*/
		accessPage: function (page_id, callback) {
			var sql = `SELECT * from pages WHERE page_id = '${page_id}'`;
			pool.getConnection(function (err, con) {
				con.query(sql, function (err, result) {
					if (err) callback(err, null);
					callback(err, result);
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
			var sql = `SELECT * from comic_page_list WHERE comic_id = '${comic_id}';`;
			console.log("acpl: "+sql);
			pool.getConnection(function (err, con) {
				con.query(sql, function (err, result) {
					if (err) callback(err, null);
					callback(err, result);
				});
			});
		},

		accessComicPageListDESC: function (comic_id, callback) {
			var sql = `SELECT * from comic_page_list WHERE comic_id = '${comic_id}' ORDER BY page_number DESC;`;
			console.log(sql);
			pool.getConnection(function (err, con) {
				con.query(sql, function (err, result) {
					if (err) callback(err, null);
					callback(err, result);
				});
			});
		},

		accessAllComic: function (callback) {
			var sql = `SELECT * FROM comics;`;
			pool.getConnection(function (err, con) {
				con.query(sql, function (err, result) {
					if (err)
						throw callback(err, null);
					else
						return callback(err, result);
				});
			});
		},

		accessAllComicForUser: function (callback, user_id) {
			var sql = `SELECT * FROM comics where user_id='user_id';`;
			pool.getConnection(function (err, con) {
				con.query(sql, function (err, result) {
					if (err)
						throw callback(err, null);
					else
						return callback(err, result);
				});
			});
		},

		appendImage: function (img_name, callback) {
			var sql = `INSERT into images (image_loc,image_permission,is_private) VALUES (${img_name},0,0);`;
			pool.getConnection(function (err, con) {
				con.query(sql, function (err, result) {
					callback(null, result.insertId);
				});
			});
		},

		/*
		Creates a new fork of an existing comic for when a user adds a new image to the comic
		Inputs:
			comic_id_to_split: Id of the comic to split
			new_user_id: User id of the user that is splitting the comic
			layout: layout of the new comic page
		Returns:
			None
		*/
		forkComic: function forkComic(comic_id_to_split, new_user_id, layout) {
			var new_page_id;
			var new_comic_id;
			//Sub-function that creates a new comic Id with the new user_id, also copies the comic_page_list to the have the new comic_id
			copyComic(comic_id_to_split, new_user_id, function (err, result) {
				new_comic_id = result.insertId;
				//Create a new page for the modified page
				//This query will also return the id of the page that was just inserted
				var sql = `INSERT INTO pages (layout) VALUES ('${layout}');`;
				pool.getConnection(function (err, con) {
					con.query(sql, function (err, result2) {
						if (err) { throw err; }

						new_page_id = result2.insertId;
						//Get the page_number of the comic
						getPageNumber(comic_id_to_split, function (err, page_number) {
							//Swap the last page of the comic with the new page id
							var sql2 = `UPDATE comic_page_list SET page_id = '${new_page_id}' WHERE comic_id = '${new_comic_id}' AND page_number = '${page_number}';`;
							pool.getConnection(function (err, con) {
								con.query(sql2, function (err, result) { if (err) { throw err; } });
							});
						});
					});
				});
			});
		}
	}
