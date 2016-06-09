var app = app || {};

app.UsersView = (function(_){
						
			function View(model,rootElement){
				var self = this,
					templates = {
						userManager:"#user-manager",
						userData:"#user-data"
					},
					uiElements = {
						newUserForm:"#add-user-form",
						addUserBtn:".add-user-btn",
						editUserBtn:".user-edit-btn",
						filterBtn:".user-filter-btn",
						filterValue:"#user-filter-text",
						usersClearBtn:".users-clear-btn",
						usersSaveBtn:".users-save-btn",
						usersCancelBtn:".users-cancel-btn",
						usersList:".users-list"
					};
				
				this.rootElement = document.querySelector(rootElement);
				this.model = model || [];
				
				this.initialize = function(){
					var userManager = document.querySelector(templates.userManager);
					// set interpolate for {{}}
					_.templateSettings = {
						interpolate: /\{\{(.+?)\}\}/g
					};
					//
					self.rootElement.appendChild(userManager.content.cloneNode(true));
					/// cache ui elements
					self.addUserBtn = self.rootElement.querySelector(uiElements.addUserBtn);
					self.editUserBtn = self.rootElement.querySelector(uiElements.editUserBtn);
					self.usersClearBtn = self.rootElement.querySelector(uiElements.usersClearBtn);
					self.usersSaveBtn = self.rootElement.querySelector(uiElements.usersSaveBtn);
					self.usersCancelBtn = self.rootElement.querySelector(uiElements.usersCancelBtn);
					self.filterBtn = self.rootElement.querySelector(uiElements.filterBtn);
					self.filterValue = self.rootElement.querySelector(uiElements.filterValue);
					self.addUserForm = self.rootElement.querySelector(uiElements.newUserForm);
					self.usersList = self.rootElement.querySelector(uiElements.usersList);
					/// add event listener
					self.model.onAddUser.subscribe(self.renderUser);
					self.model.onUserUpdate.subscribe(self.renderAll);
					self.model.onUsersChange.subscribe(self.renderAll);
					self.addUserBtn.addEventListener("click",self.onAddUser);
					self.usersClearBtn.addEventListener("click",self.onClearUsers);
					self.usersSaveBtn.addEventListener("click",self.onUsersSave);
					self.usersCancelBtn.addEventListener("click",self.onCancel);
					self.filterBtn.addEventListener("click",self.onFilter);
					self.usersList.addEventListener("click",self.onClickUsersList);
					/// render
					self.renderAll();
				}
				// events handlers
				this.onAddUser = function(){
					self.model.add(self.getUserData(self.addUserForm));
					self.setUserData({id:"",firstName:"",lastName:"",age:""},self.addUserForm);
					this.innerText = "Add";
				}
				this.onFilter = function(){
					filterValue = self.filterValue.value;
					if(!filterValue){
						self.renderAll();
						return;
					}
					self.renderAll(self.model.getUsers(filterValue));
				}
				this.onClickUsersList = function(e){
					var currentUser = {};
					if(e.target.tagName === "BUTTON"){
						currentUser = self.getCurrentUserData(e.target);
					}
					if(e.target.className == "user-edit-btn"){
						self.setUserData(currentUser,self.addUserForm);
						self.addUserBtn.innerText = "Update";
					}
					if(e.target.className == "user-delete-btn"){
						self.model.delete(currentUser.id);
					}
				}
				
				self.onClearUsers = function(){
					console.log(self.model.clear);
					self.model.clear();
				}
				
				self.onUsersSave = function(){
					self.model.save(self.users);
				}
				self.onCancel = function(){
					self.model.cancel();
				}
				/////
				this.getCurrentUserData = function(target){
					var i,
						parent,
						fields = ["id","firstName","lastName","age"];
						data={};
					parent = target.parentNode
					while(parent){
						if(parent.tagName === "TR"){
							break;
						}
						parent = parent.parentNode;
					}
					if(parent.children){
						for(i = 0; i<parent.children.length; i++){
							if(parent.children[i].querySelector("button")){
								break;
							}
							data[fields[i]] = parent.children[i].innerText;
						}
					}
					return data;
				}
				
				this.getUserData = function(userForm){
					var i, userData  = {};
					for (i = userForm.elements.length - 1; i >= 0; i = i - 1) {
							if (userForm.elements[i].name === "") {
									continue;
							}
							switch (userForm.elements[i].nodeName) {
								case 'INPUT':
									switch (userForm.elements[i].type) {
										case 'text':
											userData[userForm.elements[i].name] = encodeURIComponent(userForm.elements[i].value);
											break;
									}
							}
					}
					return userData;
				}
				
				this.setUserData = function(data,userForm){
					for (i = userForm.elements.length - 1; i >= 0; i = i - 1) {
							if (data[userForm.elements[i].name] != undefined ) {
								userForm.elements[i].value = data[userForm.elements[i].name];
							}
					}
				}
				
				this.renderAll = function(filteredUsersList){
					var userDataTemp = document.querySelector(templates.userData).innerHTML;
					var newUser = _.template(userDataTemp);
					var tr;
					self.deleteAllRecords(self.usersList);
					if(filteredUsersList){
						if(filteredUsersList.length){
							filteredUsersList.forEach(self.renderUser);
						}
					}else{
						self.model.getUsers().forEach(self.renderUser);
					}
				}
				
				this.renderUser = function(data){
				var userDataTemp = document.querySelector(templates.userData).innerHTML;
					var newUser = _.template(userDataTemp);
					var tr;
					tr = document.createElement("TR");
					tr.innerHTML = newUser(data);
					self.usersList.appendChild(tr);
				}
				this.deleteAllRecords = function(usersList){
					var i = 0,
						count = 0,
						allRecords = usersList.querySelectorAll(uiElements.usersList+" > tr");
						
					allRecords = Array.prototype.slice.call(allRecords);
					count = allRecords.length;
					allRecords.forEach(function(el){
						usersList.removeChild(el);
					});
				}
			}
			return View;
		})(_);