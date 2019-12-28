/**
 * 
 * @param firebaseTableName
 * @param htmlTableName
 * @returns
 */
function showTableWithKeysAsButtons(firebaseTableName,htmlTableName){
	console.log("showTableWithKeysAsButtons:start");
	if(isSuccessful){
		var firebaseTableRef = firebase.database().ref(firebaseTableName);
		console.log("firebaseTableName:"+firebaseTableName);
		var htmlTable = document.getElementById(htmlTableName);
		// -1 is simply a workaround to insert rows after the header
		var count=0;
		firebaseTableRef.on('child_added', function(data) {
			var rowId=data.key;
			var htmlTableRow = htmlTable.insertRow(-1);
			htmlTableRow.id=rowId;
			//console.log("htmlTableRow.id:"+htmlTableRow.id);
			var buttonCell = htmlTableRow.insertCell(-1);
			var taskButton = document.createElement("input");
			taskButton.type = "button";
			taskButton.name = "button";
			taskButton.value="Add Tasks";
			taskButton.addEventListener("click", function() {
				// Create a hidden element with id as rowId
				var hiddenTextForRowId = document.createElement("input");
				hiddenTextForRowId.type = "hidden";
				hiddenTextForRowId.name = "comment";
				hiddenTextForRowId.id=rowId;
				var tasksTableName=firebaseTableName+"_tasks";
				//showTasks(tasksTableName,rowId);
				addTemplateTasks(firebaseTableName,tasksTableName,rowId);			
				
			}, false);
			buttonCell.appendChild(taskButton);
			
			// Check list button
			var checkListButton = document.createElement("input");
			checkListButton.type = "button";
			checkListButton.name = "button";
			checkListButton.value="Add Checklist";
			checkListButton.addEventListener("click", function() {
				var checklistTableName=firebaseTableName+"_checklist";
				addTemplateChecklist(firebaseTableName,"process_checklist",rowId);
				
			}, false);
			buttonCell.appendChild(checkListButton);			
			
			// These are the details of the project, viz, project description etc
			var projectDetailsRef = firebase.database().ref(firebaseTableName+"/"+rowId);
			//console.log("projectDetailsRef:"+projectDetailsRef);
			projectDetailsRef.on('child_added', function(data) {
				//console.log("key:"+data.key);
				//document.write("key:"+data.key);
				var keyCell = htmlTableRow.insertCell(-1);
				keyCell.innerHTML = data.key;
				var valueCell = htmlTableRow.insertCell(-1);
				valueCell.innerHTML = data.val();
			});		
		});	
	}else{
		alert("Login first");
	}
	console.log("showTableWithKeysAsButtons:end");
}

function updateProjectWithChecklist(firebaseTableName,htmlTableName){
	console.log("updateProjectWithChecklist:start");
	if(isSuccessful){
		var firebaseTableRef = firebase.database().ref(firebaseTableName);
		console.log("firebaseTableName:"+firebaseTableName);
		var htmlTable = document.getElementById(htmlTableName);
		// -1 is simply a workaround to insert rows after the header
		var count=0;
		firebaseTableRef.on('child_added', function(data) {
			var rowId=data.key;
			var htmlTableRow = htmlTable.insertRow(-1);
			htmlTableRow.id=rowId;
			//console.log("htmlTableRow.id:"+htmlTableRow.id);
			
			// These are the details of the project, viz, project description etc
			var projectDetailsRef = firebase.database().ref(firebaseTableName+"/"+rowId);
			//console.log("projectDetailsRef:"+projectDetailsRef);
			projectDetailsRef.on('child_added', function(data) {
				//console.log("key:"+data.key);
				//document.write("key:"+data.key);
				var keyCell = htmlTableRow.insertCell(-1);
				keyCell.innerHTML = data.key;
				var valueCell = htmlTableRow.insertCell(-1);
				valueCell.innerHTML = data.val();
			});	
			var buttonCell = htmlTableRow.insertCell(-1);
			// Check list button
			var checkListButton = document.createElement("input");
			checkListButton.type = "button";
			checkListButton.name = "button";
			checkListButton.value="Add Checklist";
			checkListButton.addEventListener("click", function() {
				var checklistTableName=firebaseTableName+"_checklist";
				addTemplateChecklist(firebaseTableName,"process_checklist",rowId);
				
			}, false);
			buttonCell.appendChild(checkListButton);						
		});	
	}else{
		alert("Login first");
	}
	console.log("updateProjectWithChecklist:end");
}

/**
 * 
 * @param firebaseTableName
 * @param htmlTableName
 * @returns
 */
function planProjectWithTasks(firebaseTableName,htmlTableName){
	console.log("planProjectWithTasks:start");
	if(isSuccessful){
		var firebaseTableRef = firebase.database().ref(firebaseTableName);
		console.log("firebaseTableName:"+firebaseTableName);
		var htmlTable = document.getElementById(htmlTableName);
		// -1 is simply a workaround to insert rows after the header
		var count=0;
		firebaseTableRef.on('child_added', function(data) {
			var rowId=data.key;
			var htmlTableRow = htmlTable.insertRow(-1);
			htmlTableRow.id=rowId;
			//console.log("htmlTableRow.id:"+htmlTableRow.id);
			// These are the details of the project, viz, project description etc
			var projectDetailsRef = firebase.database().ref(firebaseTableName+"/"+rowId);
			//console.log("projectDetailsRef:"+projectDetailsRef);
			projectDetailsRef.on('child_added', function(data) {
				//console.log("key:"+data.key);
				//document.write("key:"+data.key);
				var keyCell = htmlTableRow.insertCell(-1);
				keyCell.innerHTML = data.key;
				var valueCell = htmlTableRow.insertCell(-1);
				valueCell.innerHTML = data.val();
			});		
			// Task Buttons Now
			var buttonCell = htmlTableRow.insertCell(-1);
			var taskButton = document.createElement("input");
			taskButton.type = "button";
			taskButton.name = "button";
			taskButton.value="Add Tasks";
			taskButton.addEventListener("click", function() {
				// Create a hidden element with id as rowId
				var hiddenTextForRowId = document.createElement("input");
				hiddenTextForRowId.type = "hidden";
				hiddenTextForRowId.name = "comment";
				hiddenTextForRowId.id=rowId;
				var tasksTableName=firebaseTableName+"_tasks";
				//showTasks(tasksTableName,rowId);
				addTemplateTasks(firebaseTableName,tasksTableName,rowId);			
				
			}, false);
			buttonCell.appendChild(taskButton);			
		});	
	}else{
		alert("Login first");
	}
	console.log("planProjectWithTasks:end");
}
/**
 * 
 * @param firebaseTableName
 * @param htmlTableName
 * @returns
 */

function showWBSGanttChart(firebaseTableName,htmlTableName){
	console.log("showWBSGanttChart:start");
	if(isSuccessful){
		var firebaseTableRef = firebase.database().ref(firebaseTableName);
		console.log("firebaseTableName:"+firebaseTableName);
		var htmlTable = document.getElementById(htmlTableName);
		// -1 is simply a workaround to insert rows after the header
		var count=0;
		firebaseTableRef.on('child_added', function(data) {
			var rowId=data.key;
			var htmlTableRow = htmlTable.insertRow(-1);
			htmlTableRow.id=rowId;
			//console.log("htmlTableRow.id:"+htmlTableRow.id);
			var buttonCell = htmlTableRow.insertCell(-1);
			var commentButtonElement = document.createElement("input");
			commentButtonElement.type = "button";
			commentButtonElement.name = "button";
			commentButtonElement.value="Show Chart";
			commentButtonElement.addEventListener("click", function() {
				// Create a hidden element with id as rowId
				showGanttJsChart(firebaseTableName+"_tasks",rowId);
			}, false);
			buttonCell.appendChild(commentButtonElement);
			
			var projectDetailsRef = firebase.database().ref(firebaseTableName+"/"+rowId);
			//console.log("projectDetailsRef:"+projectDetailsRef);
			projectDetailsRef.on('child_added', function(data) {
				//console.log("key:"+data.key);
				//document.write("key:"+data.key);
				var keyCell = htmlTableRow.insertCell(-1);
				keyCell.innerHTML = data.key;
				var valueCell = htmlTableRow.insertCell(-1);
				valueCell.innerHTML = data.val();
			});		
		});	
	}else{
		alert("Login first");
	}
	console.log("showWBSGanttChart:end");
}

/**
 * 
 * @param firebaseTableName
 * @param rowId
 * @returns
 */
function showTasks(firebaseTableName,rowId){
	console.log("showTasks:start");
	console.log("firebaseTableName: "+firebaseTableName);
	console.log("rowId: "+rowId);

	console.log("showTasks:end");
}

/**
 * 
 * @param firebaseTableName
 * @param tasksTableName
 * @param projectId
 * @returns
 */
function addTemplateTasks(firebaseTableName,tasksTableName,projectId){
	console.log("addTemplateTasks:start");
	var htmlTable=document.getElementById("project_tasks");
	//console.log("htmlTableRow.id:"+htmlTableRow.id);
	var columns=["task_name","resource","duration","percentage_completion","start_date","end_date"];
	var htmlTableRow = htmlTable.insertRow(-1);
	htmlTableRow.id=projectId;
	for(i=0;i<columns.length;i++){
		var columnName=columns[i];
		//alert("columnName: "+columnName);
		var taskAttributeCell = htmlTableRow.insertCell(-1);
		var inputElement = document.createElement("input");
		inputElement.type = "text";
		inputElement.id=projectId+"_"+columnName;
		taskAttributeCell.appendChild(inputElement);
	}

	var buttonCell = htmlTableRow.insertCell(-1);
	var addButton = document.createElement("input");
	addButton.type = "button";
	addButton.name = "button";
	addButton.value="Save";
	var uniqueKeyForTasks = firebase.database().ref(tasksTableName+"/"+projectId).push().getKey();
	addButton.addEventListener("click", function() {
		for(i=0;i<columns.length;i++){
			var columnName=columns[i];
			//alert("columnName: "+columnName);
			var taskAttribute=document.getElementById(projectId+"_"+columnName).value;
			//alert("taskAttribute: "+taskAttribute);
			var tasksTableRef = firebase.database().ref(tasksTableName+"/"+projectId+"/"+uniqueKeyForTasks+"/"+columnName);
			tasksTableRef.set(taskAttribute);
		}
		alert("Tasks are ADDED");
	}, false);	
	
	buttonCell.appendChild(addButton);
	console.log("addTemplateTasks:end");
}

/**
 * 
 * @param firebaseTableName
 * @param checkListTableName
 * @param projectId
 * @returns
 */
function addTemplateChecklist(firebaseTableName,checkListTableName,projectId){
	console.log("addTemplateChecklist:start");
	var htmlTable=document.getElementById("process_checklist");
	var uniqueKeyForTasks = firebase.database().ref(checkListTableName+"/"+projectId).push().getKey();
	//console.log("htmlTableRow.id:"+htmlTableRow.id);
	var columns=["checklist_name","completed_yes_or_no","completion_date","document_link"];
	var htmlTableRow = htmlTable.insertRow(-1);
	htmlTableRow.id=projectId;
	for(i=0;i<columns.length;i++){
		var columnName=columns[i];
		//alert("columnName: "+columnName);
		var taskAttributeCell = htmlTableRow.insertCell(-1);
		var inputElement = document.createElement("input");
		inputElement.type = "text";
		inputElement.id=projectId+"_"+columnName;
		taskAttributeCell.appendChild(inputElement);
	}
	
	// Create div for uploading documents
	/**
	 *   <div class="form-group">
	 *   <label for="exampleFormControlFile1">Example file input</label>
	 *   <input type="file" class="form-control-file" id="exampleFormControlFile1">
  	 *   </div>
	 */
	var fileCell = htmlTableRow.insertCell(-1);
	var formGroupDiv = document.createElement('div');
	formGroupDiv.id = "formgroup_"+uniqueKeyForTasks;
	formGroupDiv.className = 'form-group';
	//document.getElementsByTagName('body')[0].appendChild(formGroupDiv);

	var fileInput = document.createElement("input");
	fileInput.type = "file";
	fileInput.class = "form-control-file";
	formGroupDiv.appendChild(fileInput);
	
	fileCell.appendChild(formGroupDiv);
	
	var buttonCell = htmlTableRow.insertCell(-1);
	var addButton = document.createElement("input");
	addButton.type = "button";
	addButton.name = "button";
	addButton.value="Save";
	addButton.addEventListener("click", function() {
		for(i=0;i<columns.length;i++){
			var columnName=columns[i];
			//alert("columnName: "+columnName);
			var checklistAttribute=document.getElementById(projectId+"_"+columnName).value;
			//alert("checklistAttribute: "+checklistAttribute);
			var checklistTableRef = firebase.database().ref(checkListTableName+"/"+projectId+"/"+uniqueKeyForTasks+"/"+columnName);
			checklistTableRef.set(checklistAttribute);
		}
		alert("CheckList is ADDED");
	}, false);	
	
	buttonCell.appendChild(addButton);
	console.log("addTemplateChecklist:end");
}

/**
 * 
 * @param tasksTableName
 * @param projectId
 * @returns
 */
function showGanttJsChart(tasksTableName,projectId){
	console.log("showGanttJsChart:start");
	var tasksRowIdRef = firebase.database().ref(tasksTableName+"/"+projectId);
	//console.log("tasksRowIdRef:"+tasksRowIdRef);
	g.setShowRes(1); // Show/Hide Responsible (0/1)
	g.setShowDur(1); // Show/Hide Duration (0/1)
	g.setShowComp(1); // Show/Hide % Complete(0/1)
	g.setShowEndDate(1);
	g.setShowStartDate(1); // Show/Hide Start Date(0/1)
	g.setDateInputFormat('mm/dd/yyyy');
	g.setCaptionType('Resource');  // Set to Show Caption
	var taskNumber=1;
	tasksRowIdRef.on('child_added', function(data) {
		var individualTaskId=data.key;
		//console.log("individualTaskId:"+individualTaskId);
		var individualTaskRow = firebase.database().ref(tasksTableName+"/"+projectId+"/"+individualTaskId);
		//console.log("individualTaskRow:"+individualTaskRow);
		
		// Task Name
		var taskName;
		var taskNameRef=firebase.database().ref(tasksTableName+"/"+projectId+"/"+individualTaskId+"/"+"task_name");
		taskNameRef.on('value', function(data) {
			//console.log("key:"+data.key);
			taskName = data.val();			
			//console.log("taskName:"+taskName);
		});	
		
		// Resource Name
		var resourceName;
		var resourceNameRef=firebase.database().ref(tasksTableName+"/"+projectId+"/"+individualTaskId+"/"+"resource");
		resourceNameRef.on('value', function(data) {
			//console.log("key:"+data.key);
			resourceName = data.val();	
			//console.log("resourceName:"+resourceName);
		});		

		// percentage_completion
		var percentage_completion;
		var percentage_completionRef=firebase.database().ref(tasksTableName+"/"+projectId+"/"+individualTaskId+"/"+"percentage_completion");
		percentage_completionRef.on('value', function(data) {
			//console.log("key:"+data.key);
			percentage_completion = data.val();
			//console.log("percentage_completion:"+percentage_completion);
		});		

		// startDate
		var startDate;
		var startDateRef=firebase.database().ref(tasksTableName+"/"+projectId+"/"+individualTaskId+"/"+"start_date");
		startDateRef.on('value', function(data) {
			//console.log("key:"+data.key);
			startDate = data.val();
			//console.log("startDate:"+startDate);
		});	
		
		// endDate
		var endDate;
		var endDateRef=firebase.database().ref(tasksTableName+"/"+projectId+"/"+individualTaskId+"/"+"end_date");
		endDateRef.on('value', function(data) {
			//console.log("key:"+data.key);
			endDate = data.val();
			//console.log("endDate:"+endDate);
		});			
		
		if(g) {
		  g.AddTaskItem(new JSGantt.TaskItem(taskNumber,taskName,
				  getDateForGanttJs(startDate),
				  getDateForGanttJs(endDate),'ff0000','',0,
				  resourceName,parseInt(percentage_completion),0,1,0,1));
		  g.Draw();	
		  g.DrawDependencies();
		}else{
		    alert("not defined");
		}		
	});			
	console.log("showGanttJsChart:end");		
}

/**
 * 
 * @returns
 */
function createProject(){
	console.log("createProject:start");
	var project_name=document.getElementById("project_name").value;
	var project_description=document.getElementById("project_description").value;
	var projectIdKey = firebase.database().ref("projects").push().getKey();
	console.log("projectIdKey: "+projectIdKey);
	var uniqueRowWithDate=getDate()+"_"+projectIdKey;
	var projectNameRef=firebase.database().ref("projects"+"/"+uniqueRowWithDate+"/"+project_name);
	projectNameRef.set(project_description);
	alert("Project is added");
	console.log("createProject:end");
}