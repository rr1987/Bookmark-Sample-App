angular.module('bookmarkController', ['ngRoute'])
	
	.controller('mainController', ['$scope','$route','$routeParams','BookmarksDataFactory','commonData', function($scope,$route, $routeParams,BookmarksDataFactory,commonData) {
		
		// Get the model from the factory to the scope
		$scope.BookmarkInfo= commonData;
		
		// To load the data into the appropriate scope variables
		var loadData = function(){
		
			$scope.BookmarkInfo.newBookmark = {};
			$scope.BookmarkInfo.folderSelected="";
			$scope.searchTerm="";
			$scope.BookmarkInfo.editValues=false;
			
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
		loadData();
		// Load the folder names into the custom select dropdown
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
		
		//To filter out the deleted or updated values from the scope
		function bookmarkToRetain(value){
			
				if(value.Folder.toString() == this.toString())
				{
					return true;
				}
				else
					return false;
			
		}
		
		//To filter out the deleted or updated values from the scope
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
		
		var setPageConfig = function(folder,pageType){
			$scope.BookmarkInfo.folderSelected = folder;
			$scope.BookmarkInfo.pageType = pageType;
			$scope.BookmarkInfo.newBookmark = {};
			$scope.searchTerm="";
			$scope.BookmarkInfo.editValues=false;
		}
		
		// Load the data into the scope 
		$scope.$on('$routeChangeSuccess', function ($scope,$routeParams) {
			console.log($routeParams);
			console.log($routeParams.params);
			setPageConfig($routeParams.params.folder,$routeParams.params.type);
			//loadData($routeParams.params.type);
			
		});
		

		// CREATE ==================================================================
		// To create a new bookmark
		$scope.createBookmark = function(bookmark) {
			$scope.searchTerm="";
			if (bookmark != undefined) {
				console.log(bookmark);
				var bookmarkString = angular.toJson(bookmark);
				BookmarksDataFactory.createBookmark(bookmarkString)
					.success(function(data) {
						console.log(data);
						$scope.BookmarkInfo.newBookmark = {}; 
						if(bookmark.Folder == "" || bookmark.Folder == null){
								$scope.BookmarkInfo.bookmarks.push(data[0]);
								
							}
							else{
							
								$scope.BookmarkInfo.bookmarkFolders.push(data[0]);
								
							}
					});
			}
		};
		
		// To populate the bookmark in the form fields when edited
		$scope.editBookmark = function(bookmark){
		console.log(bookmark);
			$scope.BookmarkInfo.newBookmark = bookmark;
			$scope.BookmarkInfo.editValues = true;
			console.log($scope.BookmarkInfo.newBookmark);
		}
		
		// UPDATE ==================================================================
		// To update the bookmark
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
							//if($scope.BookmarkInfo.folderName == bookmark.Folder){
								$scope.BookmarkInfo.bookmarkFolders[index] = bookmark;
							//}else{
								//$scope.BookmarkInfo.bookmarkFolders.splice(index,1);
							//}
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
		//to delete the bookmark
		$scope.deleteBookmark = function(id,$index) {
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

				});
			$scope.BookmarkInfo.newBookmark = {};
			
			$scope.BookmarkInfo.editValues=false;
			
		};
		
		//to delete the bookmark folder
		$scope.deleteBookmarkFolder = function(folder) {
			$scope.BookmarkInfo.bookmarkFolders= $scope.BookmarkInfo.bookmarkFolders.filter(bookmarkToBeDeleted,[folder,"folder"]);
			customSelectData();
			console.log($scope.BookmarkInfo.bookmarkFolders);
			BookmarksDataFactory.deleteFolder(folder)
				.success(function(data) {
					
				});
		};
		
	}]);
