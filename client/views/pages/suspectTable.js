var suspectCart = Session.get('suspectCart');
if (suspectCart === undefined){
	suspectCart = {contacts:[]};
	Session.setPersistent('suspectCart',suspectCart);
}


Template.suspectTable.helpers({
	
    suspects: function () {
		suspectCart = Session.get('suspectCart');
        return suspectCart;
    },
	id: function(){
		var email = this.email;
		var id = email.substring(0,email.indexOf("@"));
		
		var queryId = id.replace(/\./g,"-");
		
		return queryId;
	}
});

setModal= function(ele){
	var $ele = $(ele);
	var email = $ele.attr('id');
		
	Session.set('openModal', email);
	
};