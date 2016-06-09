var app = app || {};

app.Store = (function(conf){
			var type = conf.type,
				key = conf.key;
				
			function localS(){
				var self = this;
				
				this.read = function(){
					var temp,
						data = [];
						
					if(localStorage.getItem(key)){
						temp = JSON.parse(localStorage.getItem(key));
						if(temp.constructor.toString().toLowerCase().indexOf("array") != -1){
							data = temp;
						}
					}
					return data;
				}
				
				this.save = function(data){
					localStorage.setItem(key,JSON.stringify(data));
				}
			
			}
			return localS;
		})({key:"users",type:"local"});