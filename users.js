	var app = app || {};
	
	app.Users = (function(app){
			function Model(store){					//////	{type:"local",key:"users"}
				var self = this;
				this.users = store.read() || [];
				this.filterFields = ["id","firstName","lastName","age"];
				
				////// events   ////////
				this.onAddUser = app.Observer();
				this.onUserUpdate = app.Observer();
				this.onUsersChange = app.Observer();
				
				////// logic    ////////
				this.add = function(user){	//////  add/update user
					if(typeof user !== "object"){
						return;
					}
					if(!user.id){
						console.log("add");
						user.id = self.getId();
						self.users.push(user);
						self.onAddUser.notify(user);
					}else if(user.id != undefined){
						console.log("update");
						self.update(user);
					}
				}
				
				this.delete = function(userId){	//////  delete user
					var currentUser;
					currentUser = self.getUsers("id:"+userId);
					if(currentUser.length){
						self.users.splice(self.users.indexOf(currentUser[0]),1);
						self.onUsersChange.notify();
					}
				}
				
				this.getId = function(){		////// get next ID by max current id + 1
					var id = 0;
					id  = self.users.reduce(function(prev,next){
						if(next.id > prev){
							prev = next.id;
						}
						return prev;
					},id);
					return +id + 1;
				}
				
				this.update = function(user){	////// update existing user
					var i = 0,
						result;
					for(i = 0; i < self.users.length; i++){
						if(user.id == self.users[i].id){
							self.users[i] = user;
							self.onUserUpdate.notify();
							break;
						}
					}
					return;
				}
				this.getUsers = function(filter){	////// get users by filter or all
					var result = [],
						parts;
					
					if(filter === undefined){
						return self.users;
					}
					console.log(filter);
					if(filter.indexOf(":") != -1){
						parts = filter.split(":");
						filter = {};
						filter[parts[0]] = parts[1];
						self.filterFields.forEach(function(key){
							if(filter[key] != undefined){
								result = self.users.filter(function(user){
									return filter[key] == user[key];
								});
							}
						});
					}else{
						result = self.users.filter(function(user){
									var res = false;
									self.filterFields.forEach(function(key){
										res = res ||(user[key] == filter);
									});
									return res;
								});
					}
					
					return result;
				}
				this.readStore = function(){
					return store.read();
				}
				this.save = function(){
					store.save(self.users);
				}
				this.clear = function(){
					store.save([]);
					self.users = [];
					self.onUsersChange.notify();
				}
				this.cancel = function(){
					self.users = store.read();
					self.onUsersChange.notify();
				}
				
			}
			
			return Model;
		})(app);