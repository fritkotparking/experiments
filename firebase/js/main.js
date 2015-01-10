// connection variables
var base = 'https://spud-firebase.firebaseIO.com/';
var connected = false;
var code = null;
var result = null;

// Firebase instances
var codeRef = null;
var statusRef = null;
var pixelRef = null;

// drawing variables
var canvas, stage, drawImg;
var drawingCanvas;
var oldPt;
var oldMidPt;
var stroke;
var index;
var bmpStroke;


// Start
$(document).ready(function(){
	if(role == "display"){
		code = makeid();
		connectDisplay();
		
		$("#sendBtn").click(function(e){
    		$.ajax({
			  type: "POST",
			  url: "sendSms.php",
			  data: {'number' : $("input#number").val(), 'code' : code},
			  dataType: "json",
			  success: function(msg){
			  	if(msg.result == 1){
				  	$("#code-wrapper").hide();
				  	$("#status").html("Message sent " + msg.url).show();
			  	}else{
				  	$("#status").html("Error sending").show();
			  	}
			  }
			});	
		});	
	}else{
		connectRemote();
	}
});

function connectRemote(){
	code = getParameterByName("code");
	codeRef = new Firebase(base + code);
	codeRef.on('value', function(conn){
	
		if(conn.val() == null){
			
		
		}else{
			if(connected == false){
			
				connected = true;
				codeRef.update({status:"connected"});
				
				$("#code-wrapper").hide();
				$("#status").html("Connected").show();
				$("#canvas-wrapper").show();
				
				initRemote();
			}else{
				result = conn.val();
				$("#msg").html(result.msg);
			}	
		}
		setupRef();
	});	
}

function connectDisplay(){
	codeRef = new Firebase(base + code);
	codeRef.transaction(function(result){
		if(result == null){
			statusRef = new Firebase(base + code + "/status");
			statusRef.on("value", function(txt){
			
				if(txt.val() == "connected"){
					connected = true;
					
					$("#code-wrapper").hide();
					$("#status").html("Connected").show();
					$("#canvas-wrapper").show();
					
				}
				initDisplay();
			});
			return {status:"locked", msg:""};
		}else{
			// reload function
		}
	});
	setupRef();
}

function setupRef(){
	codeRef.on('child_removed', function(r){
		connected = false;
	
		$("#link").hide();
		$("#nolink").show();
		
		$("#code-wrapper").show();
		$("#canvas-wrapper").hide();
		
		if(role == "display"){
			code = makeid();
			connectDisplay();
		}else{
			
		}
		
		$("#status").html("Disconnected");
	});
	
	codeRef.onDisconnect().remove();
}


function initDisplay() {
    canvas = document.getElementById("drawing-canvas");
    bmpStroke = document.getElementById("img-draw");
    stroke = 0.5 * 30 + 10 | 0;
    initCanvas("display", "#ccc");
}

function initRemote() {
	canvas = document.getElementById("remote");
	initCanvas("remote", "#333");
}

function initCanvas(type, clr){
	//check to see if we are running in a browser with touch support
    stage = new createjs.Stage(canvas);
    stage.autoClear = false;
    stage.enableDOMEvents(true);

    createjs.Touch.enable(stage);
    createjs.Ticker.setFPS(24);

    pixelRef = new Firebase(base + code + "/pixelData/");
    
    if(type == "display"){
    	drawingCanvas = new createjs.Shape();
    	drawingCanvas.graphics.beginFill(clr).drawRect(0, 0, 300, 300);
	    pixelRef.on('child_added', drawPixel); 
	    stage.addChild(drawingCanvas); 
    }else{
	    stage.addEventListener("stagemousedown", handleMouseDown);
	    stage.addEventListener("stagemouseup", handleMouseUp); 
    }
    stage.update();
}

function drawPixel(snap){
	//console.log(snap.val().type);
	switch(snap.val().type){
		case "down":
			oldPt = new createjs.Point(snap.val().x, snap.val().y);
			oldMidPt = oldPt;
			break;
		case "up":
			//pixelRef.remove();
			break;
		default:
			var midPt = new createjs.Point(oldPt.x + snap.val().x>>1, oldPt.y+snap.val().y>>1);
			drawingCanvas.graphics.clear().setStrokeStyle(stroke, 'round', 'round').beginBitmapStroke(bmpStroke, "no-repeat").moveTo(midPt.x, midPt.y).curveTo(oldPt.x, oldPt.y, oldMidPt.x, oldMidPt.y);
			oldPt.x = snap.val().x;
			oldPt.y = snap.val().y;

			oldMidPt.x = midPt.x;
			oldMidPt.y = midPt.y;

			stage.update();
	}
}


function stop() {
    createjs.Ticker.removeEventListener("tick", tick);
}
            
function handleMouseDown(event) {
	pixelRef.push({x:stage.mouseX, y:stage.mouseY, type:"down"});
	//oldMidPt = oldPt;
	stage.addEventListener("stagemousemove" , handleMouseMove);
}

function handleMouseMove(event) {
	pixelRef.push({x:stage.mouseX, y:stage.mouseY, type:"move"});
	//var midPt = new createjs.Point(oldPt.x + stage.mouseX>>1, oldPt.y+stage.mouseY>>1);

	stage.update();
}

function handleMouseUp(event) {
	pixelRef.push({type:"up"});
	stage.removeEventListener("stagemousemove" , handleMouseMove);
}


function makeid()
{
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

	for( var i=0; i < 6; i++ )
	text += possible.charAt(Math.floor(Math.random() * possible.length));

	return text;
}

function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}
