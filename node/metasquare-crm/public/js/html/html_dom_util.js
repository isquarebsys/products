/**
 * Create form-group element [bootstrap]
 */
 
function createInputTextElement(elementName,formElement){
		// <div class="form-group"><div class="col-xs-4"><input type="text" class="form-control inputsm" placeholder="Start Date [dd-mm-yyyy]" id="start_date"/>
	var divElementFormGroup = document.createElement("div");
	divElementFormGroup.setAttribute("class","form-group");
	var divColumnForElement=document.createElement("div");
	divColumnForElement.setAttribute("class","col-xs-4");
	var inputElement=document.createElement("input"); 
	inputElement.setAttribute("class","form-control inputsm");			
	inputElement.setAttribute("id",elementName);
	divColumnForElement.appendChild(inputElement); 
	divElementFormGroup.appendChild(divColumnForElement); 
	formElement.appendChild(divElementFormGroup); 				
	return inputElement;
}


/**
 * Create dropdown element [bootstrap]
 */
 
function createDropdownElement(elementName,elementLabel,formElement){
	//<label for="sel1">Select list:</label><select class="form-control" id="sel1"><option>1</option>
	//var labelElement=document.createElement("label");
	//labelElement.innerHTML="Select "+elementLabel;
	//labelElement.setAttribute("for",elementName);
	//formElement.appendChild(labelElement); 				
	var dropDownElement = document.createElement("select");
	dropDownElement.id=elementName;
	dropDownElement.setAttribute("class","form-group");
	formElement.appendChild(dropDownElement); 				
	return dropDownElement;
}

						
/**
* Create button element [bootstrap]
*/
function createButton(buttonClass,buttonTitle){
	var buttonElement=document.createElement("button");
	buttonElement.setAttribute("class",buttonClass);
	//buttonElement.setAttribute("placeholder",buttonTitle);
	buttonElement.type = "button";
	buttonElement.innerHTML=buttonTitle;
	return buttonElement;
}

/**
 * Clear all tables etc
 *
 *
 */
 
 function clearTablesAndDiv(){
	 removeAllChilds("data_add_form");
	 removeAllChilds("form_details");
 }
 
 /**
* Create tab element [bootstrap]
*/
function createTab(tabTitle){
	var tabElement = document.createElement("li"); 
	var tabAnchorElement=document.createElement("a"); 
	tabAnchorElement.setAttribute('href',"#");			
	tabAnchorElement.innerHTML=tabTitle;
	tabElement.appendChild(tabAnchorElement); 
	return tabElement;
}