/**
 * Utils like Time, Date, String etc 
 */

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

function getDateForScript(dateAsString){
	// incoming date will be dd-mm-yyyy
	var dateParts = dateAsString.split("-");
	// years, months, days
	try {
		var changedFormat = dateParts[2]+"-"+(dateParts[1])+"-"+dateParts[0]; // month is 0-based
		var date=new Date(Date.parse(changedFormat));
		//console.log("date: "+date);
		//alert("date: "+date);
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
		console.log("datePart: "+datePart);
	}else{
		// Do Nothing
		console.log("Doing Nothing");
	}	
	return datePart;
}


function compareDates(dateAAsString,dateBAsString){
	var dateA=getDate(dateAAsString);
	//alert(dateA);
	var dateB=getDate(dateBAsString);
	//alert(dateB);
	//alert("dateA==dateB? "+(dateA.getDate()==dateB.getDate()));
}	


/**
 * 
 * @param dateAsString
 * @returns
 */
function getDateForGanttJs(dateAsString){
	// incoming date will be dd-mm-yyyy
	// Gantts JS requires mm/dd/yyyy
	var dateParts = dateAsString.split("-");
	var ganttDateFormat = dateParts[1]+"/"+dateParts[0]+"/"+dateParts[2]; // month is 0-based
	//console.log("ganttDateFormat: "+ganttDateFormat);
	return ganttDateFormat;
}

/**
 * This is used in REPORTS to show items falling within START DATE and END DATE
 * @param dateStringToCheck
 * @param startDateString
 * @param endDateString
 * @returns
 */
function isDateWithinRange(dateStringToCheck,startDateString,endDateString){
	var dateToCheck=getDateForScript(dateStringToCheck);
	//console.log("dateToCheck: "+dateToCheck);
	var startDate=getDateForScript(startDateString);
	//console.log("startDate: "+startDate);
	var endDate=getDateForScript(endDateString);
	//console.log("endDate: "+endDate);
	if(dateToCheck>=startDate && dateToCheck<=endDate){
		return true;
	}else{
		return false;
	}
}