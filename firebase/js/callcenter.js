// connection variables
var base = 'https://spud-callcenter.firebaseIO.com/';
var connected = false;
var table = "phone-operators";
var result = null;

// Firebase instances
var phoneRef = null;

// Operator variables
var ops;


// Start
$(document).ready(function(){
	phoneRef = new Firebase(base + table);
	if(token != null){
		phoneRef.auth(token, function(error){
			if(error){
				console.log("Login Failed!", error);
				alert("Login FAILED");
			}else{
				console.log("Login Succeeded!");
			}
		});
	}
	
	phoneRef.once('value', initOperators);
});

function initOperators(result){
	console.log("----------------------------- STARTEN -------------------------------");
	if(result.val() === null){
		alert("initiating failed");
	}else{
		// variable for all operators
		ops = result.val();
		var el;
		for(var op in ops){
			setOperator(ops[op]);
		}
		
		// Set New Event Listener
		phoneRef.on("child_changed", changeOperator);
		
		// Admin specific initiation
		if( role == "admin"){
			$(".op input[type='button']").click(function(e){
				e.preventDefault();
				id = $(this).attr("id").replace("btn_", "");
				new_status = (ops[id].status == "open") ? "closed" : "open";
				
				phoneRef.child(id).transaction(function(currentData){
					if(currentData !== null){
						currentData.status = new_status;
						return currentData;
					}else{
						console.log("Operator doesn't exist");
					}	
				}, function(error, committed, snapshot) {
					if (error)
						console.log("FAILED", error.message);
					else if (!committed)
						console.log('Transaction aborted');
					else
						console.log('Operator updated');
				});
				
			});
		}
	}
}

function changeOperator(result){
	console.log("----------------------------- UPDATE -------------------------------");
	if(result.val() === null){
		alert("update failed");
	}else{
		// variable for 1 operator
		var op = result.val();
		ops[op.id] = op;
		
		setOperator(op);
	}
}

function setOperator(op){
	el = $("#" + String(op.id));
	el.find("span.name").html(op.name);
	el.find("span.status").html(op.status);
	
	if(op.status == "open"){
		el.removeClass("closed").addClass("open");
		if(role == "admin"){
			el.find("input[name='change']").val("Change to CLOSED");
		}
	}else{
		el.removeClass("open").addClass("closed");
		if(role == "admin"){
			el.find("input[name='change']").val("Change to OPEN");
		}
	}
}