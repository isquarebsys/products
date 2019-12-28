
// This is NOT Working, especially set Map is not working
function createPhoneEnquiry(firebaseTableName){
	console.log("createPhoneEnquiry:start");
	//alert("createPhoneEnquiry:start");
	//alert("firebaseTableName: "+firebaseTableName);
	var enquiryTableFields=["address","consultant_name","date","description","email","entered_by","phone_number","project_type"];
	var description=document.getElementById("description");
	var address=document.getElementById("address");
	var consultant_name=document.getElementById("consultant_name");
	var date=document.getElementById("date");
	var email=document.getElementById("email");
	var entered_by=document.getElementById("entered_by");
	var phone_number=document.getElementById("phone_number");
	var project_type=document.getElementById("project_type");
	var dataMap= {
			'description': description,
			'address': address,
			'consultant_name': consultant_name,
			'date': date,
			'email': email,
			'entered_by': entered_by,
			'phone_number': phone_number,
			'project_type': project_type
	    }
	// dataMap.set is not working
//	var dataMap=new Map();
//	for(i=0;i<enquiryTableFields.length;i++){
//		var fieldName=enquiryTableFields[i];
//		//alert("fieldName: "+fieldName);
//		var fieldValue=document.getElementById(fieldName).value;
//		//alert("fieldValue: "+fieldValue);
//		dataMap.set(fieldName,fieldValue);
//	}
	//alert(dataMap);
	var firebaseTableRef = firebase.database().ref(firebaseTableName+"/"+"date_wise");
	var rowId=firebaseTableRef.push().getKey();
	//alert("rowId: "+rowId);
	var dateString=getDate();
	var rowIdWithDate=dateString+"_"+rowId;
	var firebaseTableToCreate=firebase.database().ref(firebaseTableName+"/"+"date_wise"+"/"+rowIdWithDate);
//	firebaseTableToCreate.set({
//		'description': description,
//		'address': address,
//		'consultant_name': consultant_name,
//		'date': date,
//		'email': email,
//		'entered_by': entered_by,
//		'phone_number': phone_number,
//		'project_type': project_type
//		});
	firebaseTableToCreate.set({
		'description': description});	
	//alert("rowId: "+rowId);
	var firebaseStatusTableRef=firebase.database().ref(firebaseTableName+"_status"+"/"+rowIdWithDate);
	firebaseStatusTableRef.set("open");	
	alert("Data Submitted");
	
}
/**
 * Inventory: Create New Product which is an AGGREGATE of 1 or MORE RAW MATERIALS
 * @param firebaseTableName
 * @returns
 */
function addEndProductAndComposition(firebaseTableName){
	console.log("addEndProductAndComposition:start");
	var product_id=document.getElementById("product_id").value;
	var item_name=document.getElementById("item_name").value;
	var item_qty=document.getElementById("item_qty").value;
	var firebaseTableRef = firebase.database().ref(firebaseTableName+"/"+product_id+"/"+item_name);
	console.log("firebaseTableRef: "+firebaseTableRef);
	firebaseTableRef.set(item_qty);
	alert("Data Submitted");
	console.log("addEndProductAndComposition:end");
}

function loadAllEnquiries(){
	var phoneEnquiryTable = firebase.database().ref("phone_enquiry");
	console.log("phoneEnquiryTable:"+phoneEnquiryTable);
	//ref.set("Test");
	// First get all the rows for the table
	phoneEnquiryTable.on('child_added', function(data) {
		console.log("key:"+data.key);
		//document.write("key:"+data.key);
		var table = document.getElementById("all_forms");
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
		var individualForms = firebase.database().ref("phone_enquiry"+"/"+row.id);
		console.log("individualForms:"+individualForms);
		individualForms.on('child_added', function(data) {
				console.log("key:"+data.key);
				//document.write("key:"+data.key);
				var phoneEnquiryCell = row.insertCell(-1);
				phoneEnquiryCell.innerHTML = data.val();
			});			
	});	
}

function addProductSale(firebaseTableName){
	console.log("addProductSale:start");
	var product_id=document.getElementById("product_id").value;
	var date=document.getElementById("date").value;
	var out=document.getElementById("out").value;
	var notes=document.getElementById("notes").value;
	var uniqueKeyWithDate=getUniqueKeyWithDate(firebaseTableName+"/"+"date_wise");
	//console.log("uniqueKeyWithDate:"+uniqueKeyWithDate);
	// Date Wise Transactions
	var firebaseTableRef = firebase.database().ref(firebaseTableName+"/"+"date_wise"+"/"+uniqueKeyWithDate+"/"+product_id);
	//console.log("firebaseTableRef: "+firebaseTableRef);
	//alert(firebaseTableRef);
	var dateWiseMap= {
		'date': date,
		'notes': notes,
		'out': out,
		'in': 0
    }
	firebaseTableRef.set(dateWiseMap);
	
	// Update item_transactions to reduce the stock
	// Add to item_transactions also so that stock will show this
	var firebaseTableRef = firebase.database().ref("item_transactions"+"/"+"date_wise"+"/"+uniqueKeyWithDate+"/"+product_id);
	//console.log("firebaseTableRef: "+firebaseTableRef);
	//alert(firebaseTableRef);	
	firebaseTableRef.set(dateWiseMap);	
	

	
	// Item Wise Transactions
	var firebaseTableRef = firebase.database().ref(firebaseTableName+"/"+"item_wise"+"/"+product_id+"/"+uniqueKeyWithDate);
	//console.log("firebaseTableRef: "+firebaseTableRef);
	var productWiseMap= {
		'date': date,
		'notes': notes,
		'out': out,
		'in': 0
    }
	firebaseTableRef.set(productWiseMap);
	
	/*
	 * We should not be reducing the stock based on SALES, it should be based on MANUFACTURING 
	 */
	
	/*
	var productCompositionRef = firebase.database().ref("product_composition"+"/"+product_id);
	// For every product, we have to add the itemQty sold as product_sold*itemQty in product_composition table
	console.log("productCompositionRef: "+productCompositionRef);
	productCompositionRef.on('child_added', function(data) {
		var item=data.key;
		console.log("item:"+item);
		var itemQty=data.val();	
		console.log("itemQty:"+itemQty);
		// Date Wise Entries
		var itemStockTransactionsDateWise = firebase.database().ref("item_transactions"+"/"+"date_wise"+"/"+uniqueKeyWithDate+"/"+item);
		console.log("itemStockTransactionsDateWise:"+itemStockTransactionsDateWise);
		var itemTransactionsMap= {
		'date': date,
		'notes': notes,
		'in': 0,
		'out': out*itemQty
		}
		itemStockTransactionsDateWise.set(itemTransactionsMap);
		
		// Item Wise Entries
		var itemStockTransactionsItemWise = firebase.database().ref("item_transactions"+"/"+"item_wise"+"/"+item+"/"+uniqueKeyWithDate);
		console.log("itemStockTransactionsItemWise:"+itemStockTransactionsItemWise);
		// Remove item here
		var itemTransactionsMap= {
		'date': date,
		'notes': notes,
		'in': 0,
		'out': out*itemQty
		}
		itemStockTransactionsItemWise.set(itemTransactionsMap);
	});	
	*/
	alert("Data Submitted");
	console.log("addProductSale:end");
}

function addManufacturingJournal(firebaseTableName){
	console.log("addManufacturingJournal:start");
	var product_id=document.getElementById("product_id").value;
	var date=document.getElementById("date").value;
	var incoming=document.getElementById("in").value;
	var out=incoming;
	var notes=document.getElementById("notes").value;
	var uniqueKeyWithDate=getUniqueKeyWithDate(firebaseTableName+"/"+"date_wise");
	//console.log("uniqueKeyWithDate:"+uniqueKeyWithDate);
	var dateWiseMap= {
			'date': date,
			'notes': notes,
			'out': 0,
			'in': incoming
	    }	
	// Add to item_transactions also so that stock will show this-DATE WISE
	var itemTransactionsRef = firebase.database().ref("item_transactions"+"/"+"date_wise"+"/"+uniqueKeyWithDate+"/"+product_id);
	//console.log("itemTransactionsRef: "+itemTransactionsRef);
	//alert(itemTransactionsRef);
	itemTransactionsRef.set(dateWiseMap);
	
	// Item Wise Transactions
	var itemWiseTransactionRef = firebase.database().ref(firebaseTableName+"/"+"item_wise"+"/"+product_id+"/"+uniqueKeyWithDate);
	//console.log("itemWiseTransactionRef: "+itemWiseTransactionRef);
	//alert(itemWiseTransactionRef);
	itemWiseTransactionRef.set(dateWiseMap);
	
	var productCompositionRef = firebase.database().ref("product_composition"+"/"+product_id);
	// For every product, we have to add the itemQty sold as product_sold*itemQty in product_composition table
	//console.log("productCompositionRef: "+productCompositionRef);
	productCompositionRef.on('child_added', function(data) {
		var item=data.key;
		console.log("item:"+item);
		var itemQty=data.val();	
		//console.log("itemQty:"+itemQty);
		// Date Wise Entries
		var itemStockTransactionsDateWise = firebase.database().ref("item_transactions"+"/"+"date_wise"+"/"+uniqueKeyWithDate+"/"+item);
		//	console.log("itemStockTransactionsDateWise:"+itemStockTransactionsDateWise);
		var itemTransactionsMap= {
		'date': date,
		'notes': notes,
		'in': 0,
		'out': out*itemQty
		}
		itemStockTransactionsDateWise.set(itemTransactionsMap);
		
		// Item Wise Entries
		var itemStockTransactionsItemWise = firebase.database().ref("item_transactions"+"/"+"item_wise"+"/"+item+"/"+uniqueKeyWithDate);
		//console.log("itemStockTransactionsItemWise:"+itemStockTransactionsItemWise);
		// Remove item here
		var itemTransactionsMap= {
		'date': date,
		'notes': notes,
		'in': "",
		'out': out*itemQty
		}
		itemStockTransactionsItemWise.set(itemTransactionsMap);
	});	
	alert("Data Submitted");
	console.log("addManufacturingJournal:end");
}

function addItemStock(firebaseTableName){
	console.log("addItemStock:start");
	var item_name=document.getElementById("item_name").value;
	var date=document.getElementById("item_date").value;
	var incoming=document.getElementById("incoming").value;
	var notes=document.getElementById("item_notes").value;
	var uniqueKeyWithDate=getUniqueKeyWithDate(firebaseTableName+"/"+"date_wise");
	console.log("uniqueKeyWithDate:"+uniqueKeyWithDate);
	// Date Wise Transactions
	var firebaseTableRef = firebase.database().ref(firebaseTableName+"/"+"date_wise"+"/"+uniqueKeyWithDate+"/"+item_name);
	console.log("firebaseTableRef: "+firebaseTableRef);
	//alert(firebaseTableRef);
	var dateWiseMap= {
		'date': date,
		'notes': notes,
		'in': incoming,
		'out': ""
    }
	firebaseTableRef.set(dateWiseMap);
	//updateBalance(item_name,incoming,0);
	alert("Data Submitted");
	console.log("addItemStock:end");
}

/**
 * TBD for Value Engineers
 * Task: Change showBalance to showRawMaterialBalance
 * @param htmlTableName
 * @returns
 */
function showRawMaterialBalance(htmlTableName){
	console.log("showBalance:start");
	var firebaseTableRef = firebase.database().ref("raw_materials");
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

/*
 * This needs to be called while LOADING the page itself. The balance should be fetched from items_transactions_balance directly
 */
function populateBalanceForAllMaterials(){
	console.log("populateBalanceForAllMaterials:start");
	// First update RAW MATERIALS
	var firebaseTableRef = firebase.database().ref("raw_materials");
	//console.log("firebaseTableRef: "+firebaseTableRef);
	try{
		firebaseTableRef.on('child_added', function(data) {
			var key=data.key;
			//console.log("itemName: "+itemName);
			getBalanceFromDateWiseTransactions("item_transactions/date_wise",key);
		});	
	}catch(err){
		console.log("inside error [NaN] or something else");
	}	
	
	// Update Products
	var firebaseTableRef = firebase.database().ref("product_composition");
	//console.log("firebaseTableRef: "+firebaseTableRef);
	try{
		firebaseTableRef.on('child_added', function(data) {
			var productName=data.key;
			//console.log("productName: "+productName);
			//alert(productName);
			getBalanceFromDateWiseTransactions("item_transactions/date_wise",productName);
		});	
	}catch(err){
		console.log("inside error [NaN] or something else");
	}		
	console.log("populateBalanceForAllMaterials:end");
}

/**
 * Show ASSEMBLED products and the RAW MATERIALS involved
 * @param firebaseTableName
 * @param htmlTableName
 * @returns
 */
function showProductsAndComposition(firebaseTableName,htmlTableName){
	// timestamp/item_id/item_attribute/value
	if(isSuccessful){
		var productsTableRef = firebase.database().ref(firebaseTableName);
		console.log("firebaseTableName:"+firebaseTableName);
		var htmlTable = document.getElementById(htmlTableName);
		// -1 is simply a workaround to insert rows after the header
		productsTableRef.on('child_added', function(data) {
			var productName=data.key;
			console.log("productNameRow.id:"+productName);
			// productName is the timestamp
			//var productNameCell = productNameRow.insertCell(-1);
			//productNameCell.innerHTML = productName;
			
			var individualItemsRef = firebase.database().ref(firebaseTableName+"/"+productName).orderByKey();
				individualItemsRef.on('child_added', function(data) {
				// Add new row
				var productNameRow = htmlTable.insertRow(-1);
				// For every row, add the product Name, Item Name, Qty
				var productNameCell = productNameRow.insertCell(-1);
				productNameCell.innerHTML = productName;
				var itemName=data.key;
				//alert(itemName);
				// This key is the itemName
				console.log("itemName:"+itemName);
				var itemNameCell = productNameRow.insertCell(-1);
				itemNameCell.innerHTML=itemName;	
				var itemValue=data.val();
				// This key is the itemName
				console.log("itemValue:"+itemValue);
				var itemValueCell = productNameRow.insertCell(-1);
				itemValueCell.innerHTML=itemValue;
			});	
		});	
	}else{
		alert("Login first");
	}
}

function getTimeInMillis(){
	var date = new Date();
	var timeInMillis = date.getTime();
	return timeInMillis;
}

function getDate(){
	var date = new Date();
	var month=date.getMonth();
	// month has to be incremented by 1
	month=month+1;
	var dateZeroToThirtyOne=date.getDate();
	var year=date.getFullYear();
	//alert(year);
	var dateInFormat=dateZeroToThirtyOne+"-"+month+"-"+year;
	return dateInFormat;
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

function getDateForScript(dateAsString){
	// incoming date will be dd-mm-yyyy
	// incoming date format will be yyyy-mm-dd
	var dateParts = dateAsString.split("-");
	// years, months, days
	try {
		var changedFormat = dateParts[2]+"-"+(dateParts[1])+"-"+dateParts[0]; // month is 0-based
		var date=new Date(Date.parse(changedFormat));
	}catch(err) {
		alert("Invalid Date Format");
	}	
	
	return date;
}

function getDateFromRowIdWithDate(rowIdAsString){
	// Format 2-8-2017_-KtquSJSSbtjDS5H7GOR
	var rowIdArray = rowIdAsString.split("_");
	var datePart=rowIdArray[0];
	if(rowIdArray.length>0){
		datePart=rowIdArray[0];
	}else{
		// Do Nothing
		console.log("Doing Nothing");
	}
	
	//alert("datePart: "+datePart);
	var dateAsString = getDate(datePart); // month is 0-based
//	alert("changed format: "+dateAsString);
	return dateAsString;
}

function compareDates(dateAAsString,dateBAsString){
	var dateA=getDate(dateAAsString);
	//alert(dateA);
	var dateB=getDate(dateBAsString);
	//alert(dateB);
	//alert("dateA==dateB? "+(dateA.getDate()==dateB.getDate()));
}	

function addRawMaterials(firebaseTableName){
	console.log("addRawMaterials:start");
	var raw_material_item_group=document.getElementById("raw_material_item_group").value;
	var raw_material_name=document.getElementById("raw_material_name").value;
	//var raw_material_notes=document.getElementById("raw_material_notes").value;
	var itemsTableRef= firebase.database().ref(firebaseTableName+"/"+raw_material_name);
	console.log("itemsTableRef: "+itemsTableRef);
	itemsTableRef.set(raw_material_item_group);
	alert("Item Added");
	console.log("addRawMaterials:end");
}

function addItemGroup(firebaseTableName){
	console.log("addRawMaterials:start");
	var item_group_name=document.getElementById("item_group_name").value;
	var itemsGroupTableRef= firebase.database().ref(firebaseTableName+"/"+item_group_name);
	//console.log("itemsGroupTableRef: "+itemsGroupTableRef);
	itemsGroupTableRef.set(item_group_name);
	alert("Item Added");
	console.log("addRawMaterials:end");
}


function getJson(firebaseTableName){
	var individualItemsRef = firebase.database().ref(firebaseTableName);
	individualItemsRef.on('child_added', function(data) {
	// Add new row
	console.log(JSON.stringify(data.val()));
	//alert(JSON.stringify(data.val()));
	});	
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