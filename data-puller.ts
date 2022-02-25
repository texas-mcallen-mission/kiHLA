// This uses google's built-in stuff to basically get around how slow importRange() is, should make y'all's lives easier.

function loadFBData_() {
    let inSpreadsheet = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1Z5B24dm1GXgZdqhINczIIE--Z4H2N5roQLZGI6E6Hac/")
    let targetSheetName = "data"

    let targetSheet = inSpreadsheet.getSheetByName(targetSheetName)
    //@ts-ignore
    let unparsedData = targetSheet.getDataRange().getValues()

    // let pre_header = unparsedData.shift() // this gets rid of an extra row you probably don't want to see that's for backend stuff.

    let header = unparsedData.shift()

    return {
      header:header,
      data:unparsedData
    }

}

function removeDupes_(header,data,columnName = "isDuplicate"){
  let position = header.indexOf(columnName)

  let outData = []
  for(let entry of data){
      if (!entry[position]) {
        //@ts-ignore
      outData.push(entry)
      // Logger.log(entry)
    }
  }
  return outData
}

function getKeyIndicatorData() {
  let outSpreadsheet = SpreadsheetApp.getActive()

  let targetSheetName = "data"

  let outSheet = getSheetOrSetUpFromOtherSource(targetSheetName,["",""],outSpreadsheet)

  let kiData = loadFBData_()

  let deduped = removeDupes_(kiData.header,kiData.data,"isDuplicate")

  

  sendReportToDisplayV3_teqskwadmod_(kiData.header,deduped,outSheet)
}


function getSheetOrSetUpFromOtherSource(sheetName,headerData,targetSpreadsheet) {
  let ss; //Get currently Active sheet
  ss = targetSpreadsheet;

  // Checks to see if the sheet exists or not.
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    sheet.appendRow(headerData); // Creating Header
  }
  return sheet;
}

function sendReportToDisplayV3_teqskwadmod_(header, finalData, sheet) {

  // There was something to delete old data but it whacks the calculated column done in Sheets so it has been disabled.  If you have weird problems, un comment these lines.
  // start = 3;//Hard coded row number from where to start deleting

  // howManyToDelete = sheet.getLastRow() - start + 1;//How many rows to delete -
  //     //The blank rows after the last row with content will not be deleted

  // sheet.deleteRows(start, howManyToDelete);
  //   // sheet.clearContents();
    Logger.log("adding Header");
    sheet.getRange(2, 2, 1, header.length).setValues([header]);
    Logger.log("added header, adding data");
    if (finalData == null) {
        Logger.log("no data, skipping");
        return;
    }
    let prepredate = new Date
    sheet.getRange(3, 2, finalData.length, finalData[0].length).setValues(finalData);
    Logger.log("data added, sorting");
    let preDate = new Date
    sheet.getRange(3, 2, finalData.length, header.length).sort([{ column: 5, ascending: true }]);
    let postDate = new Date
    console.log("Adding Data: ",preDate.getMilliseconds() - prepredate.getMilliseconds(), "ms, Sorting Data: ",postDate.getMilliseconds()-preDate.getMilliseconds())
}

