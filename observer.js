var app = app || {};
		
		app.Observer = function(){
			var observers = [];
			return {
				subscribe:function(observer){
					if(typeof observer === "function"){
						if(observers.indexOf(observer) === -1){
							observers.push(observer);
						}
					}
				},
				unsubscribe:function(observer){
					var index;
					if(typeof observer === "function"){
						index = observers.indexOf(observer);
						if(index !== -1){
							observers.splice(index,1);
							return;
						}
					}
				},
				notify:function(data){
					var i = 0,
						observersCopy = observers.slice();
						
					for(i=0; i<observersCopy.length; i++){
						observersCopy[i](data);
					}
				}
			}
		}