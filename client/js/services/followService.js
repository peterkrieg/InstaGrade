angular.module('myApp')
.service('followService', followFunc);

function followFunc($http, $q){
// everything inside of followFunc

this.unfollowUser = function(id, token){
	// console.log('token is ', token);
	// console.log('inside of service, unfollow id is', id);
	// var url = 'https://api.instagram.com/v1/users/'+id+'/relationship?access_token='+token+'&action=unfollow&callback=JSON_CALLBACK';

	var url = '/api/insta/relationships?action=unfollow&token='+token+'&id='+id;

	return $http.post(url)
	.then(function(response){
		console.log(response);
	})





};


this.followUser = function(id){
	console.log('inside of service, id is', id);
};



































}