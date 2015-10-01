angular.module('bookmarkController', ['ngRoute'])
	
	// inject the Todo service factory into our controller
	.controller('mainController', ['$scope','$route','$routeParams','BookmarksDataFactory','commonData', function($scope,$route, $routeParams,BookmarksDataFactory,commonData) {
		//$locationProvider.html5Mode(true);
		/*$scope.bookmarks =[];
		$scope.bookmarkFolders=[];
		$scope.editValues = false;
		$scope.newBookmark={
				Title:"",
				Url:"",
				Folder:""
			};*/
		$scope.BookmarkInfo= commonData;
		console.log($scope.BookmarkInfo);
		//var typeOfPage = $route.current.type;
		
		
		
		// GET =====================================================================
		// when landing on the page, get all todos and show them
		// use the service to get all the todos
		
		var loadData = function(pageType){
			$scope.BookmarkInfo.newBookmark = {};
			$scope.searchTerm="";
			$scope.BookmarkInfo.editValues=false;
			console.log(pageType);
			$scope.BookmarkInfo.pageType = pageType;
			if(pageType !=null && pageType == "folder"){
				$scope.folderName = $routeParams.folder;
				console.log($scope.folderName);
				console.log($scope.BookmarkInfo.bookmarkFolders);
				//BookmarksDataFactory.getAllBookmarksInFolder($scope.folderName)
					//.success(function(data) {
						$scope.BookmarkInfo.bookmarkFolders = $scope.BookmarkInfo.bookmarkFolders.filter(bookmarkToRetain,$scope.folderName);
						console.log($scope.BookmarkInfo.bookmarkFolders);
						
						customSelectData();

					//});
			}
			else{
				BookmarksDataFactory.getAllBookmarks()
					.success(function(data) {
						if(data.length == 0) {
							customSelectData();
						}
						else{
							angular.forEach(data,function(item){
							if(item.Folder == "" || item.Folder == null){
								$scope.BookmarkInfo.bookmarks.push(item);
								customSelectData();

							}
							else{
							
								$scope.BookmarkInfo.bookmarkFolders.push(item);
								customSelectData();
							}
							});
						}
						
					});
			}
		}
		
		function customSelectData() {
			
			if($scope.BookmarkInfo.bookmarkFolders.length ==0){
				$scope.BookmarkInfo.growable=[];
				$scope.searchTerm="";
			}
			else{
			angular.forEach($scope.BookmarkInfo.bookmarkFolders,function(item){
								if($scope.BookmarkInfo.growable.indexOf(item.Folder) == -1){
									$scope.BookmarkInfo.growable.push(item.Folder);
								}
							});
			}
					$scope.growableOptions = {
						displayText: 'Select or add a new folder...',
						addText: 'Add new Folder',
						onAdd: function (searchTerm) {
							console.log(searchTerm);
							var newItem = searchTerm;
							$scope.BookmarkInfo.growable.push(searchTerm);
							console.log($scope.BookmarkInfo.growable);
							return searchTerm;
						}
					};
		
		
		}
		function suggest_state(term) {
			var q = term.toLowerCase().trim();
			var results = [];

			// Find first 10 states that start with `term`.
			for (var i = 0; i < $scope.BookmarkInfo.bookmarkFolders.length && results.length < 10; i++) {
			var state = $scope.BookmarkInfo.bookmarkFolders[i];
			console.log(state);
			if (state.Folder.toLowerCase().indexOf(q) === 0)
				results.push({ label: state.Folder, value: state.Folder });
			}

			return results;
		}

		
		$scope.$on('$routeChangeSuccess', function ($scope,$routeParams) {
			console.log($routeParams);
			console.log($routeParams.params);
			
			loadData($routeParams.params.type);
			
		});
		

		// CREATE ==================================================================
		// when submitting the add form, send the text to the node API
		$scope.createBookmark = function(bookmark) {
			$scope.searchTerm="";
			if (bookmark != undefined) {
				//$scope.loading = true;
				console.log(bookmark);
				
				
				var bookmarkString = angular.toJson(bookmark);
				// call the create function from our service (returns a promise object)
				BookmarksDataFactory.createBookmark(bookmarkString)
					.success(function(data) {
						console.log(data);
						$scope.BookmarkInfo.newBookmark = {}; // clear the form so our user is ready to enter another
						if(bookmark.Folder == "" || bookmark.Folder == null){
								$scope.BookmarkInfo.bookmarks.push(data[0]);
								
							}
							else{
							
								$scope.BookmarkInfo.bookmarkFolders.push(data[0]);
								
							}
					});
			}
		};
		
		$scope.editBookmark = function(bookmark){
		console.log(bookmark);
			$scope.BookmarkInfo.newBookmark = bookmark;
			$scope.BookmarkInfo.editValues = true;
			console.log($scope.BookmarkInfo.newBookmark);
		}
		
		$scope.updateBookmark = function(bookmark) {
			$scope.searchTerm="";
			if(bookmark.Folder=="" || $scope.BookmarkInfo.newBookmark.Folder == null){
				angular.forEach( $scope.BookmarkInfo.bookmarks, function(item,index){
					if(item._id == bookmark._id){
						$scope.BookmarkInfo.bookmarks[index] = bookmark;
					}
				});
				
			}else
			{
				var satisfied= false;
				
					angular.forEach( $scope.BookmarkInfo.bookmarkFolders, function(item,index){
						if(item._id == bookmark._id){
						satisfied=true;
							if($scope.folderName == bookmark.Folder){
								$scope.BookmarkInfo.bookmarkFolders[index] = bookmark;
							}else{
								$scope.BookmarkInfo.bookmarkFolders.splice(index,1);
							}
						}
					});
				if(!satisfied){
					angular.forEach( $scope.BookmarkInfo.bookmarks, function(item,index){
						if(item._id == bookmark._id){
							$scope.BookmarkInfo.bookmarks.splice(index,1);
						}
					});
					$scope.BookmarkInfo.bookmarkFolders.push(bookmark);
				}
			}
			$scope.BookmarkInfo.newBookmark = {};
			$scope.BookmarkInfo.editValues = false;
				var newBookmarkString = angular.toJson(bookmark);

				// call the create function from our service (returns a promise object)
				BookmarksDataFactory.updateBookmark(newBookmarkString)
					.success(function(data) {
						//$scope.loading = false;
					});
			customSelectData();
			
		};
		
		// DELETE ==================================================================
		// delete a todo after checking it
		$scope.deleteBookmark = function(id,$index) {
			//$scope.loading = true;
			console.log($index +"id"+ id);
			if($scope.BookmarkInfo.pageType !=null && $scope.BookmarkInfo.pageType == "folder"){
			
				$scope.BookmarkInfo.bookmarkFolders= $scope.BookmarkInfo.bookmarkFolders.filter(bookmarkToBeDeleted,[id,"bookmark"]);
				customSelectData();
			}
			else{
				$scope.BookmarkInfo.bookmarks= $scope.BookmarkInfo.bookmarks.filter(bookmarkToBeDeleted,[id,"bookmark"]);
			}
			
			BookmarksDataFactory.deleteBookmark(id)
				.success(function(data) {
					//$scope.loading = false;
					//$scope.todos = data; // assign our new list of todos
				});
			$scope.BookmarkInfo.newBookmark = {};
			
			$scope.BookmarkInfo.editValues=false;
			
		};
		
		function bookmarkToRetain(value){
			
				if(value.Folder.toString() == this.toString())
				{
					return true;
				}
				else
					return false;
			
		}
		
		function bookmarkToBeDeleted(value){
			if(this[1] == "folder"){
				if(value.Folder.toString() == this[0].toString())
				{
					return false;
				}
				else
					return true;
			}
			else{
				if(value._id.toString() == this[0].toString())
				{
					return false;
				}
				else
					return true;
				}
		}
		
		$scope.deleteBookmarkFolder = function(folder) {
			//$scope.bookmarkFolders = $filter('filter')($scope.bookmarkFolders, {Folder: 'News'});
			$scope.BookmarkInfo.bookmarkFolders= $scope.BookmarkInfo.bookmarkFolders.filter(bookmarkToBeDeleted,[folder,"folder"]);
			customSelectData();
			console.log($scope.BookmarkInfo.bookmarkFolders);
			BookmarksDataFactory.deleteFolder(folder)
				// if successful creation, call our get function to get all the new todos
				.success(function(data) {
					
				});
		};
		
	}]);