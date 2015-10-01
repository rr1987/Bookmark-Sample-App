var MongoClient = require('mongodb').MongoClient,
	Server = require('mongodb').Server,
	db;
var ObjectId = require('mongodb').ObjectID;
var mongoClient = new MongoClient(new Server('localhost',27017));

console.info("after mongo client");
function openDB(dbName,callback){
	mongoClient.open(function(err,mongoClient){
	console.info("opening db");
		db=mongoClient.db(dbName);
		callback();
	});
}


exports.getAllBookmarkDetails = function(req,res){
	openDB("Bookmarks",function(){
		db.collection('bookmarks',function(err,collection){
			collection.find().toArray(function(err,items){
				res.jsonp(items);
				db.close();
			});
		});
	});
};

exports.getBookmarksInFolder = function(req,res){

	var folderName = req.params.folder;
	console.info("folder name"+ folderName);
	openDB("Bookmarks",function(){
		db.collection('bookmarks',function(err,collection){
			collection.find({"Folder":"sports"}).toArray(function(err,items){
				console.info(items);
				res.jsonp(items);
				db.close();
			});
		});
	});
};

exports.removeBookmarksFolder = function(req,res){
	var folderName = req.params.folder;
	openDB("Bookmarks",function(){
		db.collection('bookmarks',function(err,collection){
			collection.remove({"Folder":folderName},{},function(err,noItemsRemoved){
			console.info("removed"+ noItemsRemoved +"files");
			res.send("Deleted");
			db.close();
			});
			
		});
	});


};


exports.removeBookmarkById = function(req,res){
	var bookmarkId = req.params.id;
	openDB("Bookmarks",function(){
		db.collection('bookmarks',function(err,collection){
			collection.remove({_id:new ObjectId(bookmarkId)},{},function(err,noItemsRemoved){
			console.info("removed"+ noItemsRemoved +"files");
			res.send("Deleted");
			db.close();
			});
			
		});
	});

};

exports.createBookmark = function(req,res){
	var bookmark = req.params.bookmark;
	console.info(req.params.bookmark);
	var bookmarkJson = JSON.parse(bookmark);
	//{"Title":"TitleTest","Url":"UrlTest", "Folder": "FolderTest"}//
	openDB("Bookmarks",function(){
		db.collection('bookmarks',function(err,collection){
			collection.insert({"Title":bookmarkJson.Title,"Url":bookmarkJson.Url, "Folder": bookmarkJson.Folder},function(err,result){
			console.info(err)
			if(err){
				res.send("error while inserting");
			}else{
			console.info(result);
			res.jsonp(result);
			}
			db.close();
			});
			
		});
	});

};

exports.updateBookmark = function(req,res){
	var bookmark = req.params.bookmark;
	console.info(req.params.bookmark);
	var bookmarkJson = JSON.parse(bookmark);
	//{"Title":"TitleTest","Url":"UrlTest1", "Folder": "FolderTest1"};//
	openDB("Bookmarks",function(){
		db.collection('bookmarks',function(err,collection){
			collection.update({_id:new ObjectId(bookmarkJson._id)},{"Title":bookmarkJson.Title,"Url":bookmarkJson.Url, "Folder": bookmarkJson.Folder},function(err,result){
				console.info(err)
				if(err){
					res.send("error while inserting");
				}else{
				res.send("updated");
				}
				db.close();
			});
			
		});
	});

};

exports.sampleDetails = function(req,res){

	var items = [
		{
			"Title":"Apple",
			"Url":"http://www.apple.com/in/",
			"Folder":""
		},
		{
			"Title":"Economic Times",
			"Url":"http://economictimes.indiatimes.com/",
			"Folder":"News"
		},
		{
			"Title":"BBC News",
			"Url":"http://www.bbc.com/news",
			"Folder":"News"
		}
	
	];
	
	res.jsonp(items);
};