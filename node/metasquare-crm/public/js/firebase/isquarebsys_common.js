/**
 * 
 * @param firebaseTableName
 * @param htmlTableName
 * @param statusValue
 * @returns
 */
function dateWiseFormsWithStatus(firebaseTableName,htmlTableName,statusValue){
	var statusQueried=document.getElementById("statusQueried");
	deleteRows(htmlTableName);
//	var statusQueriedValue=statusQueried.value;
//	if(statusQueriedValue){		
//		statusValue=statusQueriedValue;
//		console.log("statusValue is reassigned to: "+statusQueriedValue);
//	}
//	
	if(isSuccessful){
		var isAdminBoolean=false;
		var adminTable = firebase.database().ref("config/roles/admin");
		adminTable.on('value', function(data) {
			var key=data.key;
			//console.log("key:"+data.key);
			var adminMails=data.val();
			//console.log("adminMails: "+adminMails);
			if(adminMails.includes(email)){
				isAdminBoolean=true;
			}
		});	
		//console.log("isAdminBoolean: "+isAdminBoolean);
		var formAssignee="";
		var email=document.getElementById("firebase_email").value;
		var rowCount=0;
		var table = document.getElementById(htmlTableName);
		var startDateAsString=document.getElementById("start_date").value;
		//console.log("startDateAsString: "+startDateAsString);
		//alert("startDateAsString: "+startDateAsString);
		var endDateAsString=document.getElementById("end_date").value;
		//console.log("endDateAsString: "+endDateAsString);
		var firebaseTableRef = firebase.database().ref(firebaseTableName+"_status");
		//console.log("firebaseTableRef:"+firebaseTableRef);
		//ref.set("Test");
		// First get all the rows for the table
		firebaseTableRef.on('child_added', function(data) {
			var dateAndUniqueKey=data.key;
			var formStatus=data.val();
			//console.log("formStatus:"+formStatus);
			//console.log("statusValue:"+statusValue);
			// dateAndUniqueKey is the timestamp
			// Dont do any thing here
			// dateAndUniqueKey is the combination of date and firebase unique key, ex: 13-9-2017_-Ktt7MkLMzZc2FdhGGoT
			var itemDateFromRow=getDateFromRowIdWithDate(dateAndUniqueKey);
			// Caution: itemDate will NOT BE IN yyyy-mm-dd. It WILL be in dd-mm-yyyy
			//console.log("itemDateFromRow: "+itemDateFromRow);
			//console.log("key:"+dateAndUniqueKey);
			// -1 is simply a workaround to insert rows after the header
			if(isDateWithinRange(itemDateFromRow,startDateAsString,endDateAsString)&& 
					((formStatus==statusValue) || statusValue=="all" || statusValue=="ALL")){
				// Before showing the DATA, check if the assignee is same as logged in user
				var assigneeTableRef = firebase.database().ref(firebaseTableName+"_assignee"+"/"+dateAndUniqueKey);
				//console.log("assigneeTableRef:"+assigneeTableRef);
				assigneeTableRef.on('value', function(data) {
					var rowId=data.key;
					var assigneeEmail=data.val();
					//console.log("assigneeEmail:"+assigneeEmail);
					//console.log("email:"+email);
					if(email==assigneeEmail || isAdminBoolean){
						//console.log("Inside assignees forms");	
						rowCount++;
						var colorMod=rowCount/2;
						//console.log("colorMod: "+colorMod);
						//alert("Checking DATA for the provided DATE Range"); 
						var row = table.insertRow(-1);
						row.id=dateAndUniqueKey;
						//console.log("row.id:"+row.id);
						if(colorMod=1){
							row.style.color = themeFontColorMain;
						}else{
							row.style.color = themeFontColorSub;
						}
						var rowIdCol = row.insertCell(-1);
						rowIdCol.innerHTML = dateAndUniqueKey;
						var commentRow = table.insertRow(-1);
						commentRow.style.backgroundColor = themeFontColorSub;
						// This cell is to SHOW LATEST comment alone
						var latestCommentCell = commentRow.insertCell(-1);
						// Before showing input for comment, display the latest comment
						var latestComment = firebase.database().ref(firebaseTableName+"_comments"+"/"+row.id);
						latestComment.on('child_added', function(data) {
							var commentId=row.id+"_comment";
							//console.log("commentId: "+commentId);
							//alert("commentId: "+commentId);
							latestCommentCell.innerHTML = data.val();
						});		
						// This cell is to add new comments. Set colspan as well
						var commentCell = commentRow.insertCell(-1);
						commentCell.setAttribute("colspan", 9);
						// Insert input type text for comment. Generate the ID as unique,viz, combine the row.id with _comment
						var commentTextElement = document.createElement("input");
						commentTextElement.type = "text";
						commentTextElement.name = "comment";
						commentTextElement.id=row.id+"_comment";
						//console.log("commentTextElement.id: "+commentTextElement.id);
						commentCell.appendChild(commentTextElement);
						var commentButtonElement = createButton("btn btn-info btn-sm","Comment");
						commentButtonElement.addEventListener("click", function() {
							var commentId=row.id+"_comment";
							//console.log("commentId: "+commentId);
							//alert("commentId: "+commentId);
							var commentForCurrentForm=document.getElementById(commentId).value;
							//console.log("commentForCurrentForm: "+commentForCurrentForm.innerHTML);
							//alert("commentForCurrentForm: "+commentForCurrentForm);
							var commentForForm = firebase.database().ref(firebaseTableName+"_comments"+"/"+row.id);
							var commentRowId=commentForForm.push().key;
							var date=new Date();
							var systemTimeInMillis=date.getTime();
							//alert("systemTimeInMillis: "+systemTimeInMillis);
							var commentRowForForm = firebase.database().ref(firebaseTableName+"_comments"+"/"+row.id+"/"+systemTimeInMillis);
							//alert("commentRowId: "+commentRowId);
							commentRowForForm.set(commentForCurrentForm);
							alert("COMMENT is SET");
							
						}, false);
						commentCell.appendChild(commentButtonElement);
						
						// Reminder buttons
						var reminderDateElement = document.createElement("input");
						reminderDateElement.type = "text";
						reminderDateElement.name = "reminder_date";
						reminderDateElement.id=row.id+"_reminder_date";
						reminderDateElement.placeholder="Date [dd-mm-yyyy]";
						//console.log("reminderDateElement.id: "+reminderDateElement.id);
						commentCell.appendChild(reminderDateElement);
						
						// Reminder time element
						var reminderTimeElement = document.createElement("input");
						reminderTimeElement.type = "text";
						reminderTimeElement.name = "reminder_time";
						reminderTimeElement.id=row.id+"_reminder_time";
						//console.log("reminderTimeElement.id: "+reminderTimeElement.id);
						reminderTimeElement.placeholder="Time [hh:mm]";
						commentCell.appendChild(reminderTimeElement);
		//				commentCell.appendChlild("<br/>");
						
						// reminder button element
						var reminderButtonElement = createButton("btn btn-warning btn-sm","Reminder");
						reminderButtonElement.addEventListener("click", function() {
							var dateId=row.id+"_reminder_date";
							//console.log("dateId: "+dateId);
							var timeId=row.id+"_reminder_time";
							//console.log("timeId: "+timeId);
							//alert("commentId: "+commentId);
							var dateForReminder=document.getElementById(dateId).value;
							var timeForReminder=document.getElementById(timeId).value;
							var reminderForForm = firebase.database().ref(firebaseTableName+"_reminders"+"/"+row.id);
							reminderForForm.set(dateForReminder+" "+timeForReminder);
							alert("Reminder is SET");
							
						}, false);				
						commentCell.appendChild(reminderButtonElement);
						
						// Status change select option
						var statusDropDown = document.createElement("select");
						var statusDropDownId=row.id+"_statusDropDown";
						statusDropDown.id=statusDropDownId;
						populateSelectElementWithValues("config/forms_stage_buttons"+"/"+firebaseTableName,statusDropDown);
						commentCell.appendChild(statusDropDown);
						// Status change button element
						var statusChangeButtonElement = createButton("btn btn-success btn-sm","Change Status");
						statusChangeButtonElement.addEventListener("click", function() {
							var changedStatus=document.getElementById(statusDropDownId).value;
							//alert("Status will be changed to "+ changedStatus);
							var statusTableRef = firebase.database().ref(firebaseTableName+"_status"+"/"+row.id);
							statusTableRef.set(changedStatus);
							alert("Status is changed to "+ changedStatus);
						}, false);		
						commentCell.appendChild(statusChangeButtonElement);
						
						
						// Display all form elements now
						var individualForms = firebase.database().ref(firebaseTableName+"/"+row.id);
						//console.log("individualForms:"+individualForms);
						individualForms.on('child_added', function(data) {
							//console.log("key:"+dateAndUniqueKey);
							//document.write("key:"+dateAndUniqueKey);
							var invidualCol = row.insertCell(-1);
							invidualCol.innerHTML = data.val();
						});			
					}					
				});				

			}
		});	
		}else{
			alert("Please login first");
		}
}


/**
 * Show a table with all COLUMNS except ROW ID
 * @param firebaseTableName
 * @param htmlTableName
 * @returns
 */
function showTableWithKeysAndRemoveRowId(firebaseTableName,htmlTableName){
	if(isSuccessful){
		var firebaseTableRef = firebase.database().ref(firebaseTableName);
		//console.log("firebaseTableName:"+firebaseTableName);
		var htmlTable = document.getElementById(htmlTableName);
		// -1 is simply a workaround to insert rows after the header
		var count=0;
		firebaseTableRef.on('child_added', function(data) {
			var htmlTableRow = htmlTable.insertRow(-1);
			//console.log("htmlTableRow.id:"+htmlTableRow.id);
			var rowId=data.key;
//			var htmlTableCell = htmlTableRow.insertCell(-1);
//			htmlTableCell.innerHTML = rowId;
			
			var individualSales = firebase.database().ref(firebaseTableName+"/"+rowId);
				individualSales.on('child_added', function(data) {
				var productKeyCell = htmlTableRow.insertCell(-1);
				var key=data.key;
				//console.log("key:"+key);
				productKeyCell.innerHTML=key;	
				var value=data.val();	
				//console.log("value:"+value);
				var productValueCell = htmlTableRow.insertCell(-1)
				productValueCell.innerHTML=value;	
			});	
		});	
	}else{
		alert("Login first");
	}
}

/**
 * Show a table with all values of COLUMNS except ROW ID and KEY as well
 * @param firebaseTableName
 * @param htmlTableName
 * @returns
 */
function showTableWithValuesOnly(firebaseTableName,htmlTableName,statusValue){
	var statusQueried=document.getElementById("statusQueried");
	deleteRows(htmlTableName);
	if(isSuccessful){
		var isAdminBoolean=false;
		var adminTable = firebase.database().ref("config/roles/admin");
		adminTable.on('value', function(data) {
			var key=data.key;
			//console.log("key:"+data.key);
			var adminMails=data.val();
			//console.log("adminMails: "+adminMails);
			if(adminMails.includes(email)){
				isAdminBoolean=true;
			}
		});	
		//console.log("isAdminBoolean: "+isAdminBoolean);
		var formAssignee="";
		var email=document.getElementById("firebase_email").value;
		var rowCount=0;
		var table = document.getElementById(htmlTableName);
		var startDateAsString=document.getElementById("start_date").value;
		//console.log("startDateAsString: "+startDateAsString);
		//alert("startDateAsString: "+startDateAsString);
		var endDateAsString=document.getElementById("end_date").value;
		//console.log("endDateAsString: "+endDateAsString);
		var firebaseTableRef = firebase.database().ref(firebaseTableName+"_status");
		//console.log("firebaseTableRef:"+firebaseTableRef);
		//ref.set("Test");
		// First get all the rows for the table
		firebaseTableRef.on('child_added', function(data) {
			var dateAndUniqueKey=data.key;
			var formStatus=data.val();
			//console.log("formStatus:"+formStatus);
			//console.log("statusValue:"+statusValue);
			// dateAndUniqueKey is the timestamp
			// Dont do any thing here
			// dateAndUniqueKey is the combination of date and firebase unique key, ex: 13-9-2017_-Ktt7MkLMzZc2FdhGGoT
			var itemDateFromRow=getDateFromRowIdWithDate(dateAndUniqueKey);
			// Caution: itemDate will NOT BE IN yyyy-mm-dd. It WILL be in dd-mm-yyyy
			//console.log("itemDateFromRow: "+itemDateFromRow);
			//console.log("key:"+dateAndUniqueKey);
			// -1 is simply a workaround to insert rows after the header
			if(isDateWithinRange(itemDateFromRow,startDateAsString,endDateAsString)&& 
					((formStatus==statusValue) || statusValue=="all" || statusValue=="ALL")){
				// Before showing the DATA, check if the assignee is same as logged in user
				var assigneeTableRef = firebase.database().ref(firebaseTableName+"_assignee"+"/"+dateAndUniqueKey);
				//console.log("assigneeTableRef:"+assigneeTableRef);
				assigneeTableRef.on('value', function(data) {
					var rowId=data.key;
					var assigneeEmail=data.val();
					//console.log("assigneeEmail:"+assigneeEmail);
					//console.log("email:"+email);
					if(email==assigneeEmail || isAdminBoolean){
						//console.log("Inside assignees forms");	
						rowCount++;
						var colorMod=rowCount/2;
						//console.log("colorMod: "+colorMod);
						//alert("Checking DATA for the provided DATE Range"); 
						var row = table.insertRow(-1);
						row.id=dateAndUniqueKey;
						//console.log("row.id:"+row.id);
						if(colorMod=1){
							row.style.color = themeFontColorMain;
						}else{
							row.style.color = themeFontColorSub;
						}
						// Display all form elements now
						var individualForms = firebase.database().ref(firebaseTableName+"/"+row.id);
						//console.log("individualForms:"+individualForms);
						individualForms.on('child_added', function(data) {
							//console.log("key:"+dateAndUniqueKey);
							//document.write("key:"+dateAndUniqueKey);
							var invidualCol = row.insertCell(-1);
							invidualCol.innerHTML = data.val();
						});			
					}					
				});				

			}
		});	
		}else{
			alert("Please login first");
		}
}

/**
 * DO NOT use this. This is SUPERCEDED
 * 
 * Show a workflow form 
 * Add BUTTON called COMMENT so that USERS can ADD comment to the work flow
 * 
 * Multiple comments can be added
 * 
 * @param firebaseTableName
 * @param htmlTableName
 * @returns
 */
function showTableWithComments(firebaseTableName,htmlTableName){
	//alert("inside showTableWithComments");
	if(isSuccessful){
		var firebaseTableRef = firebase.database().ref(firebaseTableName);
		//console.log("firebaseTableRef:"+firebaseTableRef);
		//ref.set("Test");
		// First get all the rows for the table
		firebaseTableRef.on('child_added', function(data) {
			console.log("key:"+data.key);
			//document.write("key:"+data.key);
			var table = document.getElementById(htmlTableName);
			// -1 is simply a workaround to insert rows after the header
			var row = table.insertRow(-1);
			var commentRow = table.insertRow(-1);
			row.id=data.key;
			console.log("row.id:"+row.id);
			var phoneEnquiryCell = row.insertCell(-1);
			phoneEnquiryCell.innerHTML = data.key;
			var commentCell = commentRow.insertCell(-1);
			// Insert input type text for comment. Generate the ID as unique,viz, combine the row.id with _comment
			var commentTextElement = document.createElement("input");
			commentTextElement.type = "text";
			commentTextElement.name = "comment";
			commentTextElement.id=row.id+"_comment";
			console.log("commentTextElement.id: "+commentTextElement.id);
			commentCell.appendChild(commentTextElement);
			var commentButtonElement = document.createElement("input");
			commentButtonElement.type = "button";
			commentButtonElement.name = "button";
			commentButtonElement.value="Add Comment";
			commentButtonElement.addEventListener("click", function() {
				var commentId=row.id+"_comment";
				console.log("commentId: "+commentId);
				//alert("commentId: "+commentId);
				var commentForCurrentForm=document.getElementById(commentId).value;
				//console.log("commentForCurrentForm: "+commentForCurrentForm.innerHTML);
				//alert("commentForCurrentForm: "+commentForCurrentForm);
				var commentForForm = firebase.database().ref("phone_enquiry_comments"+"/"+row.id);
				var commentRowId=commentForForm.push().key;
				var date=new Date();
				var systemTimeInMillis=date.getTime();
				//alert("systemTimeInMillis: "+systemTimeInMillis);
				var commentRowForForm = firebase.database().ref("phone_enquiry_comments"+"/"+row.id+"/"+systemTimeInMillis);
				//alert("commentRowId: "+commentRowId);
				commentRowForForm.set(commentForCurrentForm);
				
			}, false);
			commentCell.appendChild(commentButtonElement);
			var individualForms = firebase.database().ref(firebaseTableName+"/"+row.id);
			console.log("individualForms:"+individualForms);
			individualForms.on('child_added', function(data) {
					console.log("key:"+data.key);
					//document.write("key:"+data.key);
					var phoneEnquiryCell = row.insertCell(-1);
					phoneEnquiryCell.innerHTML = data.val();
				});			
		});	
		}else{
			alert("Please login first");
		}
}

/**
 * DO NOT Use this method. This is REPLACED with dateWiseFormsWithStatus
 * @param firebaseTableName
 * @param htmlTableName
 * @returns
 */
function showWorkFlowFormsDateWiseWithComments(firebaseTableName,htmlTableName){
	//alert("inside showWorkFlowFormsDateWiseWithComments");
	if(isSuccessful){
		var rowCount=0;
		var table = document.getElementById(htmlTableName);
		var startDateAsString=document.getElementById("start_date").value;
		console.log("startDateAsString: "+startDateAsString);
		//alert("startDateAsString: "+startDateAsString);
		var endDateAsString=document.getElementById("end_date").value;
		console.log("endDateAsString: "+endDateAsString);
		//alert("endDateAsString: "+endDateAsString);

		var firebaseTableRef = firebase.database().ref(firebaseTableName);
		//console.log("firebaseTableRef:"+firebaseTableRef);
		//ref.set("Test");
		// First get all the rows for the table
		firebaseTableRef.on('child_added', function(data) {
			var dateAndUniqueKey=data.key;
			// dateAndUniqueKey is the timestamp
			// Dont do any thing here
			// dateAndUniqueKey is the combination of date and firebase unique key, ex: 13-9-2017_-Ktt7MkLMzZc2FdhGGoT
			var itemDateFromRow=getDateFromRowIdWithDate(dateAndUniqueKey);
			// Caution: itemDate will NOT BE IN yyyy-mm-dd. It WILL be in dd-mm-yyyy
			console.log("itemDateFromRow: "+itemDateFromRow);
			var itemDate=getDateForScript(itemDateFromRow);
			//alert("itemDate"+itemDate);
			console.log("itemDate: "+itemDate);
			var startDate=getDateForScript(startDateAsString);
			//alert("startDate"+startDate);
			//console.log("startDate: "+startDate);
			var endDate=getDateForScript(endDateAsString);
			//alert("endDate"+endDate);
			//console.log("endDate: "+endDate);
			// item date should be >= start date and <=end date
			console.log("key:"+dateAndUniqueKey);
			//document.write("key:"+dateAndUniqueKey);
			// -1 is simply a workaround to insert rows after the header
			if(itemDate>=startDate && itemDate<=endDate){
				rowCount++;
				var colorMod=rowCount/2;
				console.log("colorMod: "+colorMod);
				//alert("Checking DATA for the provided DATE Range"); 
				var row = table.insertRow(-1);
				row.id=dateAndUniqueKey;
				console.log("row.id:"+row.id);
				if(colorMod=1){
					row.style.color = themeFontColorMain;
				}else{
					row.style.color = themeFontColorSub;
				}
				var rowIdCol = row.insertCell(-1);
				rowIdCol.innerHTML = dateAndUniqueKey;
				var commentRow = table.insertRow(-1);
				commentRow.style.backgroundColor = themeFontColorSub;
				// This cell is to SHOW LATEST comment alone
				var latestCommentCell = commentRow.insertCell(-1);
				// Before showing input for comment, display the latest comment
				var latestComment = firebase.database().ref(firebaseTableName+"_comments"+"/"+row.id);
				latestComment.on('child_added', function(data) {
					var commentId=row.id+"_comment";
					console.log("commentId: "+commentId);
					//alert("commentId: "+commentId);
					latestCommentCell.innerHTML = data.val();
				});		
				// This cell is to add new comments. Set colspan as well
				var commentCell = commentRow.insertCell(-1);
				commentCell.setAttribute("colspan", 9);
				// Insert input type text for comment. Generate the ID as unique,viz, combine the row.id with _comment
				var commentTextElement = document.createElement("input");
				commentTextElement.type = "text";
				commentTextElement.name = "comment";
				commentTextElement.id=row.id+"_comment";
				console.log("commentTextElement.id: "+commentTextElement.id);
				commentCell.appendChild(commentTextElement);
				var commentButtonElement = document.createElement("input");
				commentButtonElement.setAttribute("class","btn btn-info btn-sm");
				commentButtonElement.type = "button";
				commentButtonElement.name = "button";
				commentButtonElement.value=" "+"Comment"+" ";
				commentButtonElement.addEventListener("click", function() {
					var commentId=row.id+"_comment";
					console.log("commentId: "+commentId);
					//alert("commentId: "+commentId);
					var commentForCurrentForm=document.getElementById(commentId).value;
					//console.log("commentForCurrentForm: "+commentForCurrentForm.innerHTML);
					//alert("commentForCurrentForm: "+commentForCurrentForm);
					var commentForForm = firebase.database().ref(firebaseTableName+"_comments"+"/"+row.id);
					var commentRowId=commentForForm.push().key;
					var date=new Date();
					var systemTimeInMillis=date.getTime();
					//alert("systemTimeInMillis: "+systemTimeInMillis);
					var commentRowForForm = firebase.database().ref(firebaseTableName+"_comments"+"/"+row.id+"/"+systemTimeInMillis);
					//alert("commentRowId: "+commentRowId);
					commentRowForForm.set(commentForCurrentForm);
					alert("COMMENT is SET");
					
				}, false);
				commentCell.appendChild(commentButtonElement);
				
				// Reminder buttons
				var reminderDateElement = document.createElement("input");
				reminderDateElement.type = "text";
				reminderDateElement.name = "reminder_date";
				reminderDateElement.id=row.id+"_reminder_date";
				reminderDateElement.placeholder="Date [dd-mm-yyyy]";
				console.log("reminderDateElement.id: "+reminderDateElement.id);
				commentCell.appendChild(reminderDateElement);
				
				// Reminder time element
				var reminderTimeElement = document.createElement("input");
				reminderTimeElement.type = "text";
				reminderTimeElement.name = "reminder_time";
				reminderTimeElement.id=row.id+"_reminder_time";
				console.log("reminderTimeElement.id: "+reminderTimeElement.id);
				reminderTimeElement.placeholder="Time [hh:mm]";
				commentCell.appendChild(reminderTimeElement);
//				commentCell.appendChlild("<br/>");
				
				// reminder button element
				var reminderButtonElement = document.createElement("input");
				reminderButtonElement.setAttribute("class","btn btn-warning btn-sm");
				reminderButtonElement.type = "button";
				reminderButtonElement.name = "button";
				reminderButtonElement.value=" "+"Reminder"+" ";
				reminderButtonElement.addEventListener("click", function() {
					var dateId=row.id+"_reminder_date";
					console.log("dateId: "+dateId);
					var timeId=row.id+"_reminder_time";
					console.log("timeId: "+timeId);
					//alert("commentId: "+commentId);
					var dateForReminder=document.getElementById(dateId).value;
					var timeForReminder=document.getElementById(timeId).value;
					var reminderForForm = firebase.database().ref(firebaseTableName+"_reminders"+"/"+row.id);
					reminderForForm.set(dateForReminder+" "+timeForReminder);
					alert("Reminder is SET");
					
				}, false);				
				commentCell.appendChild(reminderButtonElement);
				var individualForms = firebase.database().ref(firebaseTableName+"/"+row.id);
				console.log("individualForms:"+individualForms);
				individualForms.on('child_added', function(data) {
						console.log("key:"+dateAndUniqueKey);
						//document.write("key:"+dateAndUniqueKey);
						var invidualCol = row.insertCell(-1);
						invidualCol.innerHTML = data.val();
					});			
			}else{
				//alert("No items matched your query. Change dates as applicable");
			}
		});	
		}else{
			alert("Please login first");
		}
}

/**
 * 
 * @param firebaseTableName
 * @param htmlTableName
 * @returns
 */
function showTableWithKeys(firebaseTableName,htmlTableName){
	if(isSuccessful){
		var firebaseTableRef = firebase.database().ref(firebaseTableName);
		//console.log("firebaseTableName:"+firebaseTableName);
		var htmlTable = document.getElementById(htmlTableName);
		// -1 is simply a workaround to insert rows after the header
		var count=0;
		firebaseTableRef.on('child_added', function(data) {
			var htmlTableRow = htmlTable.insertRow(-1);
			//console.log("htmlTableRow.id:"+htmlTableRow.id);
			var rowId=data.key;
			var htmlTableCell = htmlTableRow.insertCell(-1);
			htmlTableCell.innerHTML = rowId;
			
			var individualSales = firebase.database().ref(firebaseTableName+"/"+rowId);
				individualSales.on('child_added', function(data) {
				var productKeyCell = htmlTableRow.insertCell(-1);
				var key=data.key;
				//console.log("key:"+key);
				productKeyCell.innerHTML=key;	
				var value=data.val();	
				//console.log("value:"+value);
				var productValueCell = htmlTableRow.insertCell(-1)
				productValueCell.innerHTML=value;	
			});	
		});	
	}else{
		alert("Login first");
	}
}

/**
 * 
 * @param firebaseTableName
 * @param htmlTableName
 * @returns
 */
function showTableWithoutKeys(firebaseTableName,htmlTableName){
	if(isSuccessful){
		var firebaseTableRef = firebase.database().ref(firebaseTableName);
		//console.log("firebaseTableName:"+firebaseTableName);
		var htmlTable = document.getElementById(htmlTableName);
		//console.log("htmlTable element is "+htmlTable);
		// -1 is simply a workaround to insert rows after the header
		var count=0;
		firebaseTableRef.on('child_added', function(data) {
			var htmlTableRow = htmlTable.insertRow(-1);
			console.log("htmlTableRow.id:"+htmlTableRow.id);
			var rowId=data.key;
			var htmlTableCell = htmlTableRow.insertCell(-1);
			htmlTableCell.innerHTML = rowId;
			var value=data.val();	
			console.log("value:"+value);
			var productValueCell = htmlTableRow.insertCell(-1)
			productValueCell.innerHTML=value;	
		});	
	}else{
		alert("Login first");
	}
}

/**
 * Generic usage
 * Show transactions date wise,viz, similar to what we bank statement for a period
 * @param firebaseTableName
 * @param htmlTableName
 * @returns
 */
function showItemTransactionsDateWise(firebaseTableName,htmlTableName){
	// timestamp/item_id/item_attribute/value
	if(isSuccessful){
		var firebaseTableRef = firebase.database().ref(firebaseTableName);
		//console.log("firebaseTableName:"+firebaseTableName);
		var htmlTable = document.getElementById(htmlTableName);
		// -1 is simply a workaround to insert rows after the header
		var count=0;
		firebaseTableRef.on('child_added', function(data) {
			var htmlTableRow = htmlTable.insertRow(-1);
			console.log("htmlTableRow.id:"+htmlTableRow.id);
			var rowId=data.key;
			// rowId is the timestamp
			var htmlTableCell = htmlTableRow.insertCell(-1);
			htmlTableCell.innerHTML = rowId;
			
			var individualSales = firebase.database().ref(firebaseTableName+"/"+rowId);
				individualSales.on('child_added', function(data) {
				// Dont show keys, keys will be like item,notes etc
				//var productKeyCell = htmlTableRow.insertCell(-1);
				var item=data.key;
				// This key is the item
				console.log("item:"+item);
				var itemTable=firebaseTableName+"/"+rowId+"/"+item;
				console.log("itemTable:"+itemTable);
				var itemTableRef= firebase.database().ref(itemTable);
					itemTableRef.on('child_added', function(data) {
					// Keys will be item attributes like name,Notes,Qty Sold etc. So dont add the key in the table
					var item=data.key;
					console.log("item:"+item);
					//var productKeyCell = htmlTableRow.insertCell(-1);
					//productKeyCell.innerHTML=item;
					var value=data.val();	
					console.log("value:"+value);
					var productValueCell = htmlTableRow.insertCell(-1)
					productValueCell.innerHTML=value;	
				});					
			});	
		});	
	}else{
		alert("Login first");
	}
}

/**
 * Generic usage
 * Show transactions date wise,viz, similar to what we bank statement for a period
 * @param firebaseTableName
 * @param htmlTableName
 * @param startDate
 * @param endDate
 * @returns
 */
function showItemTransactionsDateWise(firebaseTableName,htmlTableName,startDate,endDate){
	// timestamp/item_id/item_attribute/value
	if(isSuccessful){
		var htmlTable = document.getElementById(htmlTableName);
		var startDateAsString=document.getElementById("start_date").value;
		console.log("startDateAsString: "+startDateAsString);
		//alert("startDateAsString: "+startDateAsString);
		var endDateAsString=document.getElementById("end_date").value;
		//console.log("endDate: "+endDate);
		var firebaseTableRef = firebase.database().ref(firebaseTableName);
		//console.log("firebaseTableName:"+firebaseTableName);
		// -1 is simply a workaround to insert rows after the header
		var count=0;
		firebaseTableRef.on('child_added', function(data) {
			var htmlTableRow = htmlTable.insertRow(-1);
			//console.log("htmlTableRow.id:"+htmlTableRow.id);
			var rowId=data.key;
			// rowId is the timestamp
			var itemDateFromRow=getDateFromRowIdWithDate(rowId);
			// itemDate will always be in yyyy-mm-dd
			var itemDate=getDateForScript(itemDateFromRow);
			//alert("itemDate"+itemDate);
			var startDate=getDateForScript(startDateAsString);
			//alert("startDate"+startDate);
			var endDate=getDateForScript(endDateAsString);
			//alert("endDate"+endDate);
			// item date should be >= start date and <=end date
			if(itemDate >= startDate || itemDate >= endDate){
				//alert("Checking DATA for the provided DATE Range");
				var htmlTableCell = htmlTableRow.insertCell(-1);
				//htmlTableCell.innerHTML = rowId;
				
				var individualSales = firebase.database().ref(firebaseTableName+"/"+rowId);
					individualSales.on('child_added', function(data) {
					// Dont show keys, keys will be like item,notes etc
					//var productKeyCell = htmlTableRow.insertCell(-1);
					var item=data.key;
					// This key is the item
					htmlTableCell.innerHTML = item;
					//console.log("item:"+item);
					var itemTable=firebaseTableName+"/"+rowId+"/"+item;
					//console.log("itemTable:"+itemTable);
					var itemTableRef= firebase.database().ref(itemTable);
						itemTableRef.on('child_added', function(data) {
						// Keys will be item attributes like name,Notes,Qty Sold etc. So dont add the key in the table
						var item=data.key;
						//console.log("item:"+item);
						//var productKeyCell = htmlTableRow.insertCell(-1);
						//productKeyCell.innerHTML=item;
						var value=data.val();	
						//console.log("value:"+value);
						var productValueCell = htmlTableRow.insertCell(-1)
						productValueCell.innerHTML=value;	
					});					
				});	
					//htmlTable.scrollIntoView(true);
			}else{
				alert("No items matched your query. Change dates as applicable");
			}
		});	
	}else{
		alert("Login first");
	}
}

/**
 * This is a GENERIC utility
 * SUMS the values of columns named IN, OUT
 * CALCULATES the BALANCE
 * Usage: Bank Balance, Stock Balance etc
 * @param firebaseTableName
 * @param htmlTableName
 * @returns
 */
function showBalance(firebaseTableName,htmlTableName){
	console.log("showBalance:start");
	var firebaseTableRef = firebase.database().ref(firebaseTableName);
	console.log("htmlTableName: "+htmlTableName);
	//alert("htmlTableName: "+htmlTableName);
	var htmlTable = document.getElementById(htmlTableName);
	//alert("htmlTable: "+htmlTable);
	try{
		firebaseTableRef.on('child_added', function(data) {
			var htmlTableRow = htmlTable.insertRow(-1);
			var itemNameCell = htmlTableRow.insertCell(-1);
			var itemBalanceCell = htmlTableRow.insertCell(-1);
			// firebase ref is not referring properly=>space is replaced with %, So add it manually
			// "itemBalanceTable: https://valueengineerscrm.firebaseio.com/item_transactions_balance/40Inch%20Screw"
			var itemBalanceTable=firebase.database().ref("item_transactions_balance");
			//console.log("itemBalanceTable: "+itemBalanceTable);
			itemBalanceTable.on('child_added', function(data) {
				var itemName=data.key;
				console.log("itemName: "+itemName);
				var balance=data.val();
				console.log("balance: "+balance);
				//alert("balance: "+balance);
				itemNameCell.innerHTML = itemName;
				itemBalanceCell.innerHTML = balance;
				// Update html table now
			});	
		});	
			
	}catch(err){
		console.log("inside error [NaN] or something else");
	}	
	console.log("showBalance:end");
}

/**
 * 
 * @param firebaseTableName
 * @param htmlTableName
 * @param startDate
 * @param endDate
 * @returns
 */
function getBalanceFromDateWiseTransactions(firebaseTableName,itemName){
	// timestamp/item_id/item_attribute/value
	console.log("getBalanceFromDateWiseTransactions:start");
	if(isSuccessful){
		var firebaseTableRef = firebase.database().ref(firebaseTableName);
		//console.log("firebaseTableName:"+firebaseTableName);
		// -1 is simply a workaround to insert rows after the header
		var balance=0;
		var incoming=0;
		var outgoing=0;
		firebaseTableRef.on('child_added', function(data) {
			var rowId=data.key;
			// We dont need to process this for balance
			var individualSales = firebase.database().ref(firebaseTableName+"/"+rowId);
			individualSales.on('child_added', function(data) {
				var item=data.key;
				// This key is the item
				//console.log("item:"+item);
				var itemTable=firebaseTableName+"/"+rowId+"/"+item;
				//console.log("itemTable:"+itemTable);
				var itemTableRef= firebase.database().ref(itemTable);
				if(item==itemName){
					//alert("Item: "+item);
					//alert("Inside item==itemName");
					itemTableRef.on('child_added', function(data) {
					// Keys will be item attributes like name,Notes,Qty Sold etc. So dont add the key in the table
					var itemAttribute=data.key;
					//console.log("item:"+item);
					//var productKeyCell = htmlTableRow.insertCell(-1);
					//productKeyCell.innerHTML=item;
					var value=data.val();	
					if(itemAttribute=="in"){
						//console.log("Inside: balance=balance+incoming");
						//console.log(value);
						if(value==""){
							//console.log("value is empty. DO NOTHING");	
						}else{
							balance=balance+parseInt(value);	
							//console.log("Updated incoming balance: "+balance);
						}					
					}
					if(itemAttribute=="out"){
						//console.log("Inside: balance=balance-outgoing");
						//console.log(value);
						if(value==""){
							//console.log("value is empty. DO NOTHING");	
						}else{
							balance=balance-parseInt(value);
							//console.log("Updated outgoing balance: "+balance);
						}					
					}
				});	
			}
			});
			//console.log("final balance: "+balance);
			var itemBalanceTable=firebase.database().ref("item_transactions_balance"+"/"+itemName);
			itemBalanceTable.set(balance);
		});
	}else{
		alert("Login first");
	}
	console.log("getBalanceFromDateWiseTransactions:end");
}


/**
 * 
 * @param firebaseTableName
 * @param htmlTableName
 * @returns
 */
function showMultipleItemTransactionsDateWise(firebaseTableName,htmlTableName){
	// timestamp/item_id/item_attribute/value
	
	if(isSuccessful){
		var htmlTable = document.getElementById(htmlTableName);
		var startDateAsString=document.getElementById("start_date").value;
		var endDateAsString=document.getElementById("end_date").value;
		var firebaseTableRef = firebase.database().ref(firebaseTableName);
		// -1 is simply a workaround to insert rows after the header
		var count=0;
		firebaseTableRef.on('child_added', function(data) {
			var dateAndUniqueKey=data.key;
			// dateAndUniqueKey is the timestamp
			// Dont do any thing here
			// dateAndUniqueKey is the combination of date and firebase unique key, ex: 13-9-2017_-Ktt7MkLMzZc2FdhGGoT
			var itemDateFromRow=getDateFromRowIdWithDate(dateAndUniqueKey);
			// itemDate will always be in yyyy-mm-dd
			// item date should be >= start date and <=end date
			var individualItemRef = firebase.database().ref(firebaseTableName+"/"+dateAndUniqueKey);
			// Multiple times will be here for the same timestamp. So insert a new row for every record
			individualItemRef.on('child_added', function(data) {
			var item=data.key;
				if(isDateWithinRange(itemDateFromRow,startDateAsString,endDateAsString)){
					//alert("Checking DATA for the provided DATE Range");
					var individualItemRow = htmlTable.insertRow(-1);
					console.log("individualItemRow.id:"+individualItemRow.id);		
					var itemNameCell = individualItemRow.insertCell(-1);
					itemNameCell.innerHTML=item;
					var itemTableRef= firebase.database().ref(firebaseTableName+"/"+dateAndUniqueKey+"/"+item);
						itemTableRef.on('child_added', function(data) {
						var itemAttribute=data.key;
						// This key is the itemAttribute. So dO NOT show the itemAttribute
						// var itemNameCell = individualItemRow.insertCell(-1);
						// This is the itemAttribute like Nuts, Screws etc
						// itemNameCell.innerHTML=itemAttribute;				
						console.log("itemAttribute:"+itemAttribute);
						var value=data.val();	
						console.log("value:"+value);
						var itemAttributeValue = individualItemRow.insertCell(-1)
						itemAttributeValue.innerHTML=value;	
					});
				}else{
					//alert("No items matched your query. Change dates as applicable");
				}
			});	
		});	
	}else{
		alert("Login first");
	}
}

function getUniqueKey(firebaseTableName){
	var uniqueKey=firebase.database().ref(firebaseTableName).push().key;
	return uniqueKey;
}

function getUniqueKeyWithDate(firebaseTableName){
	var uniqueKey=firebase.database().ref(firebaseTableName).push().key;
	var date=getDate();
	return date+"_"+uniqueKey;
}

/**
 * This method ITERATES over a path and gets the KEY directly to the <option>
 * For example and Screw_ID/Screws will be populated as Screw_ID
 * @param firebasePath
 * @param dropDownId
 * @returns
 */
function populateDropDownWithKey(firebasePath,dropDownId){
	var individualItemsRef = firebase.database().ref(firebasePath);
//	var dropDownId=document.getElementById(dropDownId);
	individualItemsRef.on('child_added', function(data) {
		var key=data.key;
		//alert("populateDropDownWithKey:key"+key);
		var newSelect = document.createElement('option');
		selectHTML = "<option value='" + key + "'>" + key + "</option>";
	    newSelect.innerHTML = selectHTML;
	    document.getElementById(dropDownId).add(newSelect);
	});		
	
}

/**
 * This method ITERATES over a path and gets the value directly to the <option>
 * For example and Screw_ID/Screws will be populated as Screws
 * @param firebasePath
 * @param dropDownId
 * @returns
 */
function populateDropDownWithKeys(firebasePath,dropDownId){
	var individualItemsRef = firebase.database().ref(firebasePath);
//	var dropDownId=document.getElementById(dropDownId);
	individualItemsRef.on('child_added', function(data) {
		var key=data.key;
		var newSelect = document.createElement('option');
		selectHTML = "<option value='" + key + "'>" + key + "</option>";
	    newSelect.innerHTML = selectHTML;
	    document.getElementById(dropDownId).add(newSelect);
	});		
	
}

/**
 * This method ITERATES over a path and gets the value directly to the <option>
 * For example and Screw_ID/Screws will be populated as Screws
 * @param firebasePath
 * @param dropDownId
 * @returns
 */
function populateDropDownWithValues(firebasePath,dropDownId){
	var individualItemsRef = firebase.database().ref(firebasePath);
//	var dropDownId=document.getElementById(dropDownId);
	individualItemsRef.on('child_added', function(data) {
		var value=data.val();
		var newSelect = document.createElement('option');
		selectHTML = "<option value='" + value + "'>" + value + "</option>";
	    newSelect.innerHTML = selectHTML;
	    document.getElementById(dropDownId).add(newSelect);
	});		
	
}

/**
 * This function is NOT working correctly, to be fixed later
 * @param firebasePath
 * @param dropDownId
 * @returns
 */
function populateDropDownUsingJson(firebasePath,dropDownId){
	var individualItemsRef = firebase.database().ref(firebasePath);
//	var dropDownId=document.getElementById(dropDownId);
	individualItemsRef.on('child_added', function(data) {
		//var dropDownAsJson = {"name":"Screw-4 Inch"}	
		var jsonObject=JSON.stringify("{"+data.val()+"}");	
		console.log(jsonObject);
		//alert(dropDownAsJson);
		for (var key in jsonObject) {
		  alert("key: "+key);
		  if (jsonObject.hasOwnProperty(key)) {
		    var value = jsonObject[key];
		    console.log(value);
			alert("value: "+value);
			var newSelect = document.createElement('option');
			selectHTML = "<option value='" + value + "'>" + value + "</option>";
		    newSelect.innerHTML = selectHTML;
		    document.getElementById(dropDownId).add(newSelect);	
		  }
		}
	});		
}

/**
 * Adds dropdowns to a select element
 * @param firebasePath
 * @param dropDownId
 * @returns
 */
function populateSelectElementWithValues(firebasePath,selectElement){
	//console.log("populateSelectElementWithValues");
	//console.log("dropDownId: "+dropDownId);
	var individualItemsRef = firebase.database().ref(firebasePath);
	individualItemsRef.on('child_added', function(data) {
		var value=data.val();
		var newSelect = document.createElement('option');
		selectHTML = "<option value='" + value + "'>" + value + "</option>";
	    newSelect.innerHTML = selectHTML;
	    selectElement.add(newSelect);
	});		
}


/**
 * 
 * @param htmlTableId
 * @returns
 */
function deleteRows(htmlTableId){
	//console.log("deleteRows:start");
	var table = document.getElementById(htmlTableId);
	//or use :  var table = document.all.tableid;
	for(var i = table.rows.length - 1; i > 0; i--)
	{
	    table.deleteRow(i);
	}	
	//console.log("deleteRows:end");
}

/**
 * 
 * @param htmlTableId
 * @returns
 */
function deleteRowsWithHeader(htmlTableId){
	//console.log("deleteRows:start");
	var table = document.getElementById(htmlTableId);
	//or use :  var table = document.all.tableid;
	for(var i = table.rows.length; i > 0; i--)
	{
	    table.deleteRow(i);
	}	
	//console.log("deleteRows:end");
}

/**
 * 
 * @param firebaseTableName
 * @returns
 */
function createTableHeadersForReports(firebaseTableName){
	if(isSuccessful){
		var firebaseTableRef = firebase.database().ref("config/forms"+"/"+firebaseTableName+"/"+"fields_order");
		//console.log("firebaseTableName:"+firebaseTableName);
		var tableToBeCreated=document.createElement("table");
		tableToBeCreated.setAttribute("id",firebaseTableName);
		tableToBeCreated.setAttribute("width","100%");
		tableToBeCreated.setAttribute("bordercolor","#DAF7A6");
		tableToBeCreated.setAttribute("class","table-bordered");
		tableToBeCreated.style.display="block";
		var divElement=document.getElementById("form_details");
		divElement.appendChild(tableToBeCreated);
		var htmlTableRow = tableToBeCreated.insertRow(-1);
		htmlTableRow.setAttribute("style","color:white;background-color:"+themeTableHeaderColorSub);
		var count=0;
		firebaseTableRef.on('child_added', function(data) {
			// Value will be description,customer_name,customer_address,visit_date
			var rowId=data.key;
			var columnName=data.val();
			var htmlTableCell = htmlTableRow.insertCell(-1);
			var firebaseColumnRef = firebase.database().ref("config/forms"+"/"+firebaseTableName+"/"+"fields"+"/"+columnName+"/label");
				firebaseColumnRef.on('value', function(data) {
					htmlTableCell.innerHTML = data.val();
			});				
		});	
	}else{
		alert("Login first");
	}
}

/**
 * This is same as createTableHeadersForReports
 * DIFFERENCE: if row_id is seen, it will be REMOVED from the HEADER
 * @param firebaseTableName
 * @returns
 */
function createTableHeadersForExport(firebaseTableName){
	if(isSuccessful){
		var firebaseTableRef = firebase.database().ref("config/forms"+"/"+firebaseTableName+"/"+"fields_order");
		//console.log("firebaseTableName:"+firebaseTableName);
		var tableToBeCreated=document.createElement("table");
		tableToBeCreated.setAttribute("id",firebaseTableName);
		tableToBeCreated.setAttribute("width","100%");
		tableToBeCreated.setAttribute("bordercolor","#DAF7A6");
		tableToBeCreated.setAttribute("class","table-bordered");
		tableToBeCreated.style.display="block";
		var divElement=document.getElementById("form_details");
		divElement.appendChild(tableToBeCreated);
		var htmlTableRow = tableToBeCreated.insertRow(-1);
		htmlTableRow.setAttribute("style","color:white;background-color:"+themeTableHeaderColorSub);
		var count=0;
		firebaseTableRef.on('child_added', function(data) {
			// Value will be description,customer_name,customer_address,visit_date
			var rowId=data.key;
			var columnName=data.val();
			
			// We do NOT need the row_id
			if(columnName!="row_id"){
				
				var htmlTableCell = htmlTableRow.insertCell(-1);
				var firebaseColumnRef = firebase.database().ref("config/forms"+"/"+firebaseTableName+"/"+"fields"+"/"+columnName+"/label");
					firebaseColumnRef.on('value', function(data) {
						htmlTableCell.innerHTML = data.val();
				});								
			}
		});	
	}else{
		alert("Login first");
	}
}

function createTableHeadersForForm(firebaseTableName){
	if(isSuccessful){
		var firebaseTableRef = firebase.database().ref("config/forms"+"/"+firebaseTableName+"/"+"fields");
		//console.log("firebaseTableName:"+firebaseTableName);
		var tableToBeCreated=document.createElement("table");
		tableToBeCreated.setAttribute("id",firebaseTableName);
		tableToBeCreated.setAttribute("class","table-bordered");
		tableToBeCreated.style.display="block";
		var divElement=document.getElementById("data_add_table_div");
		divElement.appendChild(tableToBeCreated);
		var htmlTableRow = tableToBeCreated.insertRow(-1);
		var count=0;
		firebaseTableRef.on('child_added', function(data) {
			// Value will be description,customer_name,customer_address,visit_date
			var rowId=data.key;
			var columnName=data.val();
			var htmlTableCell = htmlTableRow.insertCell(-1);
			var firebaseColumnRef = firebase.database().ref("config/forms"+"/"+firebaseTableName+"/"+"fields"+"/"+columnName+"/label");
				firebaseColumnRef.on('value', function(data) {
					htmlTableCell.innerHTML = "<b>"+data.val()+"</b>";
			});				
		});	
	}else{
		alert("Login first");
	}
}

function removeAllChilds(elementId){
	var parentElement=document.getElementById(elementId);
	var noOfChildNodes=parentElement.childNodes.length;
	//console.log("noOfChildNodes: "+noOfChildNodes);
	//parentElement.removeChild(parentElement.childNodes[0]);
	/**
	for(i=noOfChildNodes;i>0;i--){
		// This is not working, to be fixed
		var childNode=parentElement.childNodes[i];
		parentElement.removeChild(childNode);
	}	
	*/
	while (parentElement.hasChildNodes()) {
		parentElement.removeChild(parentElement.lastChild);
	}
}

function initialiseDates(){
	var startDateAsString=document.getElementById("start_date");
	var endDateAsString=document.getElementById("end_date");
	startDateAsString.value=getDate();
	endDateAsString.value=getDate();
}
/**
 * 
 */
function createMenuAndRelevantHtmlTable(){
	if(isSuccessful){
		initialiseDates();
		
		//<ul class="nav nav-tabs">, <li class="active"><a href="#">Home</a></li>, <li><a href="#">Menu 1</a></li>, </ul>
		var menuUl = document.getElementById("menu_tabs");
		//console.log("menuUl:"+menuUl);
		var firebaseTableRef = firebase.database().ref("config/forms");
		//console.log("firebaseTableRef:"+firebaseTableRef);

		firebaseTableRef.on('child_added', function(data) {
			var menuName=data.key;
			//console.log("menuName:"+menuName);
			
			var liElement = document.createElement("li"); 
			liElement.setAttribute("class","");
			//console.log("liElement:"+liElement);
			var anchorElement=document.createElement("a"); 
			anchorElement.setAttribute('href',"#"+menuName);			
			anchorElement.innerHTML=menuName;
			
			anchorElement.addEventListener("click", function() {
				createTabsForForm(menuName);
				// When tab is clicked, the REPORTS generated earlier STAYS as it is, so DO NOT Display
				var reportDiv=document.getElementById("data_reports_div");
				reportDiv.style.display="none";
				var dataAddDiv=document.getElementById("data_add_div");
				dataAddDiv.style.display="none";
			}, false);
						
			liElement.appendChild(anchorElement); 
			menuUl.appendChild(liElement); 
						
		});	
	}else{
		alert("Login first");
	}
}


function createTabsForForm(menuName){
	if(isSuccessful){
		var firebaseTableRef = firebase.database().ref("config/forms/"+menuName+"/"+"fields");
		//console.log("menuName: "+menuName);
		//<ul class="nav nav-tabs" id="forms_tabs_list"><li><a href="#">New</a></li>
		var menuUl = document.getElementById("forms_tabs_list");
		removeAllChilds("forms_tabs_list");
		//console.log("menuUl:"+menuUl);
		// New Form Element
		var newTabLiElement = document.createElement("li"); 
		var newTabAnchorElement=document.createElement("a"); 
		newTabAnchorElement.setAttribute('href',"#");			
		newTabAnchorElement.innerHTML="Add";
		//clearTablesAndDiv();
		var newFormElement=document.getElementById("data_add_form");		
		newTabAnchorElement.addEventListener("click", function() {
			removeAllChilds("data_add_form");
			// Show  data add div, Hide  reportsdiv
			var reportDiv=document.getElementById("data_reports_div");
			reportDiv.style.display="none";
			var dataAddDiv=document.getElementById("data_add_div");
			dataAddDiv.style.display="block";
			// Build the form based on https://www.w3schools.com/bootstrap/bootstrap_forms.asp	
			
			firebaseTableRef.on('child_added', function(data) {
				var elementName=data.key;
				//console.log("elementName:"+elementName);
				var inputElementType = firebase.database().ref("config/forms/"+menuName+"/"+"fields/"+elementName+"/type");	
				inputElementType.on('value', function(data) {
					var inputElementTypeValue=data.val();
					//console.log("inputElementTypeValue: "+inputElementTypeValue);
					if(inputElementTypeValue=="Dropdown"){
						var dropDownElement=document.createElement("select");
						dropDownElement.id=elementName;
						dropDownElement.setAttribute("class","form-group");
						newFormElement.appendChild(dropDownElement); 		
						var dropdownPath = firebase.database().ref("config/forms/"+menuName+"/"+"fields/"+elementName+"/dropdownPath");	
						dropdownPath.on('value', function(data) {
							if(data.val()!=null){								
								var dropdownPathValue=data.val();
								//console.log("dropdownPathValue: "+dropdownPathValue);
								var hyphenReplacedValue=replaceAll(dropdownPathValue,"-","/");
								//console.log("hyphenReplacedValue: "+hyphenReplacedValue);
								populateSelectElementWithValues(hyphenReplacedValue,dropDownElement);
								var inputElementRef = firebase.database().ref("config/forms/"+menuName+"/"+"fields/"+elementName+"/label");	
								inputElementRef.on('value', function(data) {
									var elementLabel=data.val();
									//console.log("elementLabel:"+elementLabel);
									dropDownElement.setAttribute("placeholder",elementLabel);
								});			
							}
						});											
					}else{
						//console.log("Else loop of Dropdown");
						var inputElement=createInputTextElement(elementName,newFormElement);
						var inputElementRef = firebase.database().ref("config/forms/"+menuName+"/"+"fields/"+elementName+"/label");	
						inputElementRef.on('value', function(data) {
							var elementLabel=data.val();
							//console.log("elementLabel:"+elementLabel);
							inputElement.setAttribute("placeholder",elementLabel);
						});			
						
						
					}
				});		

			});
			// Add submit button 
			var formSubmitButton=createButton("btn btn-info","Submit");
			newFormElement.appendChild(formSubmitButton);
			formSubmitButton.addEventListener("click", function() {
				var tableDataRef = firebase.database().ref(menuName);
				var rowId=tableDataRef.push().key;
				var date=getDate();
				var dateAndUniqueKey=date+"_"+rowId;			
				firebaseTableRef.on('child_added', function(data) {
					var elementName=data.key;
					//console.log("elementName: "+elementName);	
					var inputElementValue=document.getElementById(elementName).value; 
					//console.log("inputElementValue: "+inputElementValue);	
					var tableDataRefWithRowIdAndColumn = firebase.database().ref(menuName+"/"+dateAndUniqueKey+"/"+elementName);
					//console.log("tableDataRefWithRowIdAndColumn: "+tableDataRefWithRowIdAndColumn);
					tableDataRefWithRowIdAndColumn.set(inputElementValue);
					var statusTableDataRef = firebase.database().ref(menuName+"_status"+"/"+dateAndUniqueKey);
					statusTableDataRef.set("Open");
					var assigneeTableRef = firebase.database().ref(menuName+"_assignee"+"/"+dateAndUniqueKey);
					assigneeTableRef.set(document.getElementById("firebase_email").value);
				});
				alert("DATA is Submitted");		
				/**
				var formSubmitButtonToRemove=document.getElementById("submit_new_form");
				if(formSubmitButtonToRemove){
					formSubmitButtonToRemove.parentNode.removeChild(formSubmitButtonToRemove);
				}
				*/
				
			}, false);					
		}, false);
					
		newTabLiElement.appendChild(newTabAnchorElement); 
		menuUl.appendChild(newTabLiElement); 
		
		// Reports Tab
		var reportTabElement = document.createElement("li"); 
		var reportTabAnchorElement=document.createElement("a"); 
		reportTabAnchorElement.setAttribute('href',"#");			
		reportTabAnchorElement.innerHTML="Reports";
		reportTabElement.appendChild(reportTabAnchorElement); 	
		menuUl.appendChild(reportTabElement); 		
		reportTabAnchorElement.addEventListener("click", function() {
			// Remove all tables from the form_details
			removeAllChilds("form_details");
			removeAllChilds("form_status");
			// Set the visibility of dates to true
			//initialiseDates();
			// Show reports div, Hide data add div
			var reportDiv=document.getElementById("data_reports_div");
			reportDiv.style.display="block";
			var dataAddDiv=document.getElementById("data_add_div");
			dataAddDiv.style.display="none";
			var startDateAsString=document.getElementById("start_date").value;
			var endDateAsString=document.getElementById("end_date").value;
			var startDate=getDateForScript(startDateAsString);
			//alert("startDate"+startDate);
			//console.log("startDate: "+startDate);
			var endDate=getDateForScript(endDateAsString);
			//alert("endDate"+endDate);
			//console.log("endDate: "+endDate);
			if(!startDate instanceof Date){
				alert("Please select PROPER DATES");
			}
			// Create the table and make it visible
			createTableHeadersForReports(menuName,menuName);
			// Clear the table first
			deleteRows(menuName);
			dateWiseFormsWithStatus(menuName,menuName,"ALL");
			// Update dropdown for particular form
			var statusDropDownElement=document.getElementById("form_status");
			populateSelectElementWithValues("config/forms_stage_buttons"+"/"+menuName,statusDropDownElement);
			statusDropDownElement.addEventListener("change", function() {
				var statusSelected=document.getElementById("form_status").value;
				dateWiseFormsWithStatus(menuName,menuName,statusSelected);
			}, false);
		}, false);
		
		var excelExportFormatButton=document.getElementById("excel_format_button");
		excelExportFormatButton.addEventListener("click", function() {
			var statusSelected=document.getElementById("form_status").value;
			// createTableHeadersForReports creates table with id as menuName
			deleteRows(menuName);
			removeAllChilds("form_details");
			createTableHeadersForExport(menuName);
			showTableWithValuesOnly(menuName,menuName,statusSelected);
		}, false);		
		
	}else{
		alert("Login first");
	}	
}


 
 