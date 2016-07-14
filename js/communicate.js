var communicate = (function(){

	var cookieName = "lochieaxon-projection-mapper-";

	function set(name, value){
	    document.cookie = cookieName + name + "=" + JSON.stringify( value ) + "; path=/";
	    return true;
	}
	
	function get(name){
	    var cname = cookieName + name + "=";
	    var ca = document.cookie.split(';');
	    for (var i=0; i < ca.length; i++) {
	        var c = ca[i];
	        while (c.charAt(0)==' ') c = c.substring(1,c.length);
	        if (c.indexOf(cname) == 0) {
	            return JSON.parse( c.substring(cname.length, c.length) );
	        }
	    }
	    return null;
	}

	return {
		set,
		get,
	}
})();