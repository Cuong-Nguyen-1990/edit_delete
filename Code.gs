

function doGet(request) {
  return HtmlService.createTemplateFromFile('Index').evaluate();
}


/* DEFINE GLOBAL VARIABLES, CHANGE THESE VARIABLES TO MATCH WITH YOUR SHEET */
function globalVariables(){ 
  var varArray = {
    spreadsheetId   : '1bO3C_Nl4T6-Mm6ATA7I5K3a68NoAMBKyHUv_q-FjWDE', 
    dataRange        : 'Data!A2:S',                                   
    idRange         : 'Data!A2:A',                                  
    lastCol         : 'S',                                            
    insertRange     : 'Data!A1:S1',                                   
    sheetID         : '160485312'                                           
  };debugger;
  return varArray;
}

/*
# PROCESSING FORM ---------------------------------------------------------------------------------
*/

/* PROCESS FORM */  //Execute if form passes an ID and if is an existing ID
function processForm(formObject){  
  if(formObject.RecId && checkID(formObject.RecId)){updateData(getFormValues(formObject),globalVariables().spreadsheetId,getRangeByID(formObject.RecId)); // Update Data
  }else{appendData(getFormValues(formObject),globalVariables().spreadsheetId,globalVariables().insertRange); //Append Form Data   //Execute if form does not pass an ID
  }
  //return getLastTenRows();//Return last 10 rows
}

/* GET FORM VALUES AS AN ARRAY */
function getFormValues(formObject){
/* ADD OR REMOVE VARIABLES ACCORDING TO YOUR FORM*/
  if(formObject.RecId && checkID(formObject.RecId)){
    var values = [[formObject.RecId.toString(),
                  formObject.checking_date,
                  formObject.owner_hit,
                  formObject.driver_id,
                  formObject.vehicle_type,
                  formObject.driver_name,
                  formObject.vehicle_no,
                  formObject.Violation_Quality,
                  formObject.Violation_Fraud,
                  formObject.penalty,
                  formObject.Suspend_Ban_day,
                  formObject.Active_Before,
                  formObject.Unsuspend_day,
                  formObject.innocent,
                  formObject.date_innocent,
                  formObject.Input_violation,
                  formObject.Sub_email_ticket,
                  formObject.Explanation,
                  formObject.source_innocent]];
  }else{
    var values = [[new Date().getTime().toString(),//https://webapps.stackexchange.com/a/51012/244121
                  formObject.checking_date,                              
                  formObject.owner_hit,
                  formObject.driver_id,
                  formObject.vehicle_type,
                  formObject.driver_name,
                  formObject.vehicle_no,
                  formObject.Violation_Quality,
                  formObject.Violation_Fraud,
                  formObject.penalty,
                  formObject.Suspend_Ban_day,
                  formObject.Active_Before,
                  formObject.Unsuspend_day,
                  formObject.innocent,
                  formObject.date_innocent,
                  formObject.Input_violation,
                  formObject.Sub_email_ticket,
                  formObject.Explanation,
                  formObject.source_innocent]];
  }
  return values;
}

/*
## CURD FUNCTIONS ----------------------------------------------------------------------------------------
*/

/* CREATE/ APPEND DATA */
function appendData(values, spreadsheetId,range){
  var valueRange = Sheets.newRowData();
  valueRange.values = values;
  var appendRequest = Sheets.newAppendCellsRequest();
  appendRequest.sheetID = spreadsheetId;
  appendRequest.rows = valueRange;
  var results = Sheets.Spreadsheets.Values.append(valueRange, spreadsheetId, range,{valueInputOption: "RAW"});
}

/* READ DATA */
function readData(spreadsheetId,range){
  var result = Sheets.Spreadsheets.Values.get(spreadsheetId, range);
  return result.values;
}

/* UPDATE DATA */
function updateData(values,spreadsheetId,range){
  var valueRange = Sheets.newValueRange();
  valueRange.values = values;
  var result = Sheets.Spreadsheets.Values.update(valueRange, spreadsheetId, range, {
  valueInputOption: "RAW"});
}

/*DELETE DATA*/
function deleteData(ID){ 
  var startIndex = getRowIndexByID(ID);
  var deleteRange = {
                      "sheetId"     : globalVariables().sheetID,
                      "dimension"   : "ROWS",
                      "startIndex"  : startIndex,
                      "endIndex"    : startIndex+1
                    }
  
  var deleteRequest= [{"deleteDimension":{"range":deleteRange}}];debugger;
  Sheets.Spreadsheets.batchUpdate({"requests": deleteRequest}, globalVariables().spreadsheetId);

 // return getLastTenRows();//Return last 10 rows
}

/* 
## HELPER FUNCTIONS FOR CRUD OPERATIONS --------------------------------------------------------------
*/ 

/* CHECK FOR EXISTING ID, RETURN BOOLEAN */
function checkID(ID){
  var idList = readData(globalVariables().spreadsheetId,globalVariables().idRange,).reduce(function(a,b){return a.concat(b);});
  return idList.includes(ID);
}

/* GET DATA RANGE A1 NOTATION FOR GIVEN ID */
function getRangeByID(id){
  if(id){
    var idList = readData(globalVariables().spreadsheetId,globalVariables().idRange);
    for(var i=0;i<idList.length;i++){
      if(id==idList[i][0]){
        return 'Data!A'+(i+2)+':'+globalVariables().lastCol+(i+2);
      }
    }
  }
}

/* GET RECORD BY ID */
function getRecordById(id){
  if(id && checkID(id)){
    var result = readData(globalVariables().spreadsheetId,getRangeByID(id));
    return result;
  }
}

/* GET ROW NUMBER FOR GIVEN ID */
function getRowIndexByID(id){
  if(id){
    var idList = readData(globalVariables().spreadsheetId,globalVariables().idRange);
    for(var i=0;i<idList.length;i++){
      if(id==idList[i][0]){
        var rowIndex = parseInt(i+1);
        return rowIndex;
      }
    }
  }
}

// /*GET LAST 10 RECORDS */
function getLastTenRows(){
  var lastRow = readData(globalVariables().spreadsheetId,globalVariables().dataRange).length+1;
  if(lastRow<=11){
    var range = globalVariables().dataRange;
  }else{
    var range = 'Data!A'+(lastRow-9)+':'+globalVariables().lastCol;
  }
  var lastTenRows = readData(globalVariables().spreadsheetId,range);
  return lastTenRows;
}

/* GET ALL RECORDS */
function getAllData(){
  var data = readData(globalVariables().spreadsheetId,globalVariables().dataRange);
  return data;
}

/*
## OTHER HELPERS FUNCTIONS ------------------------------------------------------------------------
*/

/*GET DROPDOWN LIST */
function getDropdownList(range){
  var list = readData(globalVariables().spreadsheetId,range);
  return list;
}


/* INCLUDE HTML PARTS, EG. JAVASCRIPT, CSS, OTHER HTML FILES */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .getContent();
}
