var bookmarks = require('../routes/Bookmarks');
module.exports = function(app){
	
	console.info("Inside bookmarks controller js file")
	app.get('/Bookmarks/allBookmarks',bookmarks.getAllBookmarkDetails);
	app.get('/Bookmarks/allBookmarksInFolder/:folder',bookmarks.getBookmarksInFolder);
	app.delete('/Bookmarks/removeBookmarksFolder/:folder',bookmarks.removeBookmarksFolder);
	app.delete('/Bookmarks/removeBookmark/:id',bookmarks.removeBookmarkById);
	app.post('/Bookmarks/createBookmark/:bookmark',bookmarks.createBookmark);
	app.put('/Bookmarks/updateBookmark/:bookmark',bookmarks.updateBookmark);
	
}