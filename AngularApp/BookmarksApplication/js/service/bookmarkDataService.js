angular.module('bookmarkService',[])
	.factory('commonData',function(){
		return{
			bookmarks:[],
			bookmarkFolders:[],
			editValues : false,
			newBookmark:{
				Title:"",
				Url:"",
				Folder:""
			},
			growable:[],
			pageType:""
		}
	})
	.factory('BookmarksDataFactory', ['$http', function ($http) {
		var urlBase = 'http://127.0.0.1:9080/Bookmarks';
		return {
			getAllBookmarks : function(){
				return $http.get(urlBase+'/allBookmarks');
			},
			getAllBookmarksInFolder : function(folder){
				return $http.get(urlBase+'/allBookmarksInFolder/'+ folder );
			},
			createBookmark : function (bookmark) {
				return $http.post(urlBase+'/createBookmark/'+ bookmark);
			},
			updateBookmark : function (bookmark) {
				return $http.put(urlBase + '/updateBookmark/' + bookmark);
			},
			deleteBookmark : function (id) {
				return $http.delete(urlBase + '/removeBookmark/' + id);
			},
			deleteFolder : function (folder) {
				return $http.delete(urlBase + '/removeBookmarksFolder/' + folder);
			}
		}
	}]);
    