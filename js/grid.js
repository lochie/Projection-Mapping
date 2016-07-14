var grid = (function(){

	var graph = [];
	var base = [];

	function init(callback, file){
		if( file ){
			importGrid( file, callback );
		}else{
			create();
			callback();
		}
	}
	function get(){ return graph; }
	function set(g){ graph = g; }


	function create(){
		var g = [];
		for(var i=0; i<map.x+1; i++){
			var m = [];
			for(var j=0; j<map.y+1; j++){
				var _x = i * ( map.width / map.x );
				var _y = j * ( map.height / map.y );
				m.push({ x:_x, y:_y });
			}
			g.push(m);
		}
		graph = g;
		base = g;
	}


	function importGrid(file,callback){
		console.log(">Uploading grid file: "+file);
		readTextFile(file,function(a){
			graph = JSON.parse(a);
			if(map.x != graph.length-1 || map.y != graph[0].length-1){
				console.log(">Your uploaded grid does not match the map settings of "+graph.length-1+"x"+graph[0].length-1);
				newGrid();
			}
			callback();
		});
	}
	function exportGrid(){
		console.log(">Exporting grid, check popup for blob file");
		createFile(JSON.stringify(graph, null, 4));
	}


	var isModifying = false;
	function modifyGrid(){
		if(isModifying){
			document.getElementById("modify").innerHTML = "Modify";
		}else{
			document.getElementById("modify").innerHTML = "Done";
		}
		isModifying = !isModifying;
	}
	function createFile(content) {
		var textFileAsBlob = new Blob([content], {type:'text/plain'});
		var downloadLink = document.createElement("a");
		window.URL = window.URL || window.webkitURL;
		downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
		downloadLink.style.display = "none";
		downloadLink.setAttribute("target", "_blank");
		document.body.appendChild(downloadLink);
		downloadLink.click();
	}
	function readTextFile(file, callback){
		var rawFile = new XMLHttpRequest();
		rawFile.open("GET", file, false);
		rawFile.onreadystatechange = function(){
			if(rawFile.readyState === 4){
				if(rawFile.status === 200 || rawFile.status == 0){
					var allText = rawFile.responseText;
					callback(allText);
				}
			}
		}
		rawFile.send(null);
	}

	return{
		init,
		create,
		export:exportGrid,

		get,
		set,

		modify:modifyGrid,
		isModify:function(){ return isModifying },
	}
})();