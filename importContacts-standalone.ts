var DEBUG = true  // DEBUG: For the frequent logger statement.
let contactDataSheetName = "Contact Data"

let header = [
    "Date Generated","Area Email",	"Area Name",	
    "Missionary 1", "Position 1","isTrainer1",
    "Missionary 2", "Position 2","isTrainer2",
    "Missionary 3", "Position 3","isTrainer3",	
    "District",	"Zone", "unitString",	"hasMultipleUnits",	"languageString","isSeniorCouple","isSisterArea",
    "hasVehicle","vehicleMiles","vinLast8","aptAddress", ,]

function importContacts()
{ 
  Logger.log("Importing Contact data from Google Contacts...")
  
  let genDate = new Date();

  let sheet = setSheetUp(contactDataSheetName)
  // JUST WHILE DEBUGGING:
  if(DEBUG = true){  //this just clears the sheet so that I don't have to keep scrolling.
    sheet.clearContents();
    sheet.appendRow(header);// Creating Header
  }

  let data = [];

  //pulls in contact data from Google Contacts, and gets everything ready to go.
  let  group  = ContactsApp.getContactGroup('IMOS Roster'); // Fetches group by groupname 
  let  contacts = group.getContacts();                    // Fetches contact list of group 


  for (let  contactPEEP of contacts){

    // I basically built this as a big single function and then broke it up into a bunch of little ones.
    let noteData = parseNotes(contactPEEP.getNotes())  
    let  contactEmailList = contactPEEP.getEmails();
    emailData = emailParser(contactEmailList)
    // Logger.log(emailData)
    // Logger.log(emailData.emailLabelNames)
    let roleData = roleParser(emailData.emailLabelNames,contactEmailList)

    // Missionary Address Puller
    let apartmentAddressObject = contactPEEP.getAddresses()
    let apartmentAddress = ""
    if(apartmentAddressObject.length>=1){
      apartmentAddress = apartmentAddressObject[0].getAddress()
    }
    // End puller

    let languageData = languageParser(noteData.hasMultipleUnits,noteData.unitString)

    

    // append contact data to data array
    // keeps senior missionaries out of the data.  Sorry guys.
    if(noteData.isSeniorCouple == false){
      let row = [new Date(),emailData.emailAddresses[0],noteData.area,
                 emailData.emailDisplayNames[1],roleData.compRoles[1],roleData.isTrainer[1],
                 emailData.emailDisplayNames[2],roleData.compRoles[2],roleData.isTrainer[2],
                 emailData.emailDisplayNames[3],roleData.compRoles[3],roleData.isTrainer[3],
                noteData.district,noteData.zone,noteData.unitString,noteData.hasMultipleUnits,languageData.languages,noteData.isSeniorCouple,noteData.isSisterArea,
                 noteData.hasVehicle,noteData.vehicleMiles,noteData.vinLast8,apartmentAddress];

      data.push(row);
    }
  }
  //Output data to sheet
  sheet.getRange(2,1,data.length,data[0].length).setValues(data);

  Logger.log("Finished importing Contact data.")

} // Written by Elder Robertson, TMM


/**
 * Clears and adds a header row to the Contact Data sheet.
 * Creates the sheet if it doesn't exist.
 */
function setSheetUp(sheetName){
  let  ss = SpreadsheetApp.getActiveSpreadsheet();        //Get currently Active sheet
    // Checks to see if the sheet exists or not.
    let sheet = ss.getSheetByName(sheetName)
    if(!sheet){
      sheet = ss.insertSheet(sheetName)
            sheet.appendRow(header);// Creating Header
    }

  return sheet
}

/**
 * Returns true if Contact Data was not imported recently and needs to be refreshed.
 */
function isContactDataOld() {
  let msOffset = 86400000; //Number of milliseconds in 24 hours
  let nowTime = new Date();
  let genTime = getContactSheet().getRange("A2").getValue();
  let out;

  try {
    out = genTime.getTime() < nowTime.getTime() - msOffset;
  } catch (e) {
    out = true;
  }

  return out;
}

/**
 * 
 */
function getPrettyDate(){
    var saveDate = new Date();
    saveDate.getUTCDate();
    let prettyDate = Utilities.formatDate(saveDate, "GMT+1", "dd/MM/yyyy");
    return prettyDate
}

/**
 * 
 */






function fixWhileDebugging() {
  importContacts()
}

function roleParser(labelNameObject,listOfEmails) {
  let compRoles = []
  let isTrainer = []
  // Position Strings: First is the tested for value, second is the readable output one.
  let ap = ["(AP)","AP"]
  let zl1 = ["(ZL1)","ZL1"]
  let zl2 = ["(ZL2)","ZL2"]
  let zl3 = ["(ZL3)","ZL3"]
  let stl1 = ["(STL1)","STL1"]
  let stl2 = ["(STL2)","STL2"]
  let stl3 = ["(STL3)","STL3"]
  let dl = ["(DL)","DL"]
  let seniorComp = ["(SC)","SC"]
  let juniorComp = ["(JC)","JC"]
  let seniorCompTrainer = ["(TR)","TR"]
  let zlTrainer = ["(ZLT)","ZLT"]
  let stlTrainer = ["(STLT)","STLT"]	
  let dlTrainer = ["(DT)","DT"]
  let specialAssignment = ["(SA)","SA"]



  // Logger.log([labelNameObject[0],labelNameObject[1],labelNameObject[2],labelNameObject[3]])
  for(let labelIterant=0; labelIterant<listOfEmails.length;labelIterant++){
    let labelString = labelNameObject[labelIterant].toString()
    if(typeof labelNameObject[labelIterant] == "object") {
      Logger.log(["weird edge-case thingy:",labelIterant,listOfEmails[labelIterant],labelNameObject[labelIterant],labelNameObject[labelIterant].toString()])
    }
    let openParenPos = labelString.indexOf("(")
    let closeParenPos = labelString.indexOf(")")
    // let regexSearch = labelString.search(/\(\w*/)
    let roleString = labelString.substring(openParenPos,closeParenPos+1)
    // switch(labelNameObject[labelIterant].substring(labelNameObject[labelIterant].search(/\(\w*/)))
    switch(roleString)
    {
      // AP's
        case ap[0]:
          compRoles[labelIterant] = ap[1]
          isTrainer[labelIterant] = false
        break;
      // ZL
        case zl1[0]:
          compRoles[labelIterant] = zl1[1]
          isTrainer[labelIterant] = false
        break;
          case zl2[0]:
          compRoles[labelIterant] = zl2[1]
          isTrainer[labelIterant] = false
        break;
          case zl3[0]:
          compRoles[labelIterant] = zl3[1]
          isTrainer[labelIterant] = false
        break;
          case zlTrainer[0]:
          compRoles[labelIterant] = zlTrainer[1]
          isTrainer[labelIterant] = true
        break;
      //STL
        case stl1[0]:
          compRoles[labelIterant] = stl1[1]
          isTrainer[labelIterant] = false
        break;
          case stl2[0]:
          compRoles[labelIterant] = stl2[1]
          isTrainer[labelIterant] = false
        break;
          case stl3[0]:
          compRoles[labelIterant] = stl3[1]
          isTrainer[labelIterant] = false
        break;
          case stlTrainer[0]:
          compRoles[labelIterant] = stlTrainer[1]
          isTrainer[labelIterant] = true
        break;

      // District Leader
        case dl[0]:
          compRoles[labelIterant] = dl[1]
          isTrainer[labelIterant] = false
        break;
        case dlTrainer[0]:
          compRoles[labelIterant] = dlTrainer[1]
          isTrainer[labelIterant] = true
        break;
      // Senior Comp
        case seniorComp[0]:
          compRoles[labelIterant] = seniorComp[1]
          isTrainer[labelIterant] = false
        break;
        case seniorCompTrainer[0]:
          compRoles[labelIterant] = seniorCompTrainer[1]
          isTrainer[labelIterant] = true
        break;
      // Junior Comp
        case juniorComp[0]:
          compRoles[labelIterant] = juniorComp[1]
          isTrainer[labelIterant] = false
        break;
      // Special Assignment
        case specialAssignment[0]:
          compRoles[labelIterant] = specialAssignment[1]
          isTrainer[labelIterant] = false
        break;
      }
    }
  return {
    compRoles: compRoles,
    isTrainer: isTrainer
  }
} // Written by Elder Robertson, TMM
function parseNotes(inputString) {
  // PARSER FOR NOTES SECTION DATA
        if(typeof(inputString) != String){
          TypeError("NO NOTES FOR NOTES PARSER TO PARSE.  PLZ HALP, HAVING EXISTENTIAL CRISIS")
        }

        var notesSplit = inputString.split("\n")
        var hasVehicle = inputString.includes("Vehicle")

        var area = notesSplit[0].replace("Area: ","").trim()
        var district = notesSplit[1].replace("District: ","").trim()
        var zone = notesSplit[2].replace("Zone: ", "").trim()
        let  isSeniorCouple = notesSplit[1].includes("Senior")
        var ecclesiasticalUnitString = notesSplit[3]
        var hasMultipleUnits = ecclesiasticalUnitString.includes("Units:") // tests to see if there are multiple ecclesiastical units covered by a companionship.
        var unitString = ""
        if(hasMultipleUnits == true){
          unitString = ecclesiasticalUnitString.replace("Ecclesiastical Units:","").trim()
        } 
        if(hasMultipleUnits == false){
          unitString = ecclesiasticalUnitString.replace("Ecclesiastical Unit:","").trim()
          unitString = unitString.replace("EcclesiasticalUnit:","").trim()
        }

        // This part is in a conditional because it only matters (& WORKS!) if there's a vehicle.
        // Otherwise, the vehicle will get the extra tags and junk, which we don't particularly want to happen.

        var vehicleDesc
        var vehicleMiles
        var vinLast8
        var vehicleCCID
        var finalTags

        if(hasVehicle == true){
          vehicleDesc = notesSplit[5].replace("Vehicle:","").trim()
          vehicleMiles = notesSplit[6].replace("Vehicle Allowance/Mo: ","").replace("Mi","").trim()
          vinLast8 = notesSplit[7].replace("Vehicle VIN Last 8:","").trim()
          vehicleCCID = notesSplit[8].replace("Vehicle","").replace("CCID:","").trim()

        // This has *some* data in it but I'm not using it right now
          finalTags = notesSplit[10]
        } else {
          finalTags = notesSplit[5]
        }

        let isSisterArea = finalTags.includes("Sister");

        return{
          area:area,
          district:district,
          zone:zone,
          hasMultipleUnits:hasMultipleUnits,
          unitString:unitString,
          hasVehicle:hasVehicle,
          vehicleDesc:vehicleDesc,
          vehicleMiles:vehicleMiles,
          vinLast8:vinLast8,
          vehicleCCID:vehicleCCID,
          isSeniorCouple:isSeniorCouple,
          isSisterArea:isSisterArea,
          finalTags:finalTags}
} // Written by Elder Robertson, TMM
function emailParser(emailList) {
  let emailAddresses = []
  let emailDisplayNames = []
  let emailLabelName = []
  // this operates under the assumption that all the emails are in the same order :0
  for(let i=0; i<emailList.length;i++){
    emailAddresses[i] = emailList[i].getAddress()
    emailDisplayNames[i] = emailList[i].getDisplayName()
    emailLabelName[i] = emailList[i].getLabel()
  }
  return{
    emailAddresses:emailAddresses,
    emailDisplayNames:emailDisplayNames,
    emailLabelNames:emailLabelName
  }
}
// IF THIS GOES GLOBAL, THIS WILL HAVE TO CHANGE!!!

function testLanguageParser(){
  let testString = "TEST (Spanish) WORDS,TEST ENGLISH WORDS"
  Logger.log(testString.split(","))
  Logger.log(languageParser(true,testString))
}

function languageParser(multipleUnits,unitString) {

  
  // noteData.UnitString.substring(noteData.UnitString.search(/\(\w*/))
  let defaultLanguage = "English"
  let spanishTestString = "Spanish"
  let spanishOutputString = "Spanish"
  let returnData = []
  if(multipleUnits==false){
    if(unitString.includes(spanishTestString)==true){ // this is going to get changed in the future to get rid of the silly spanish,spanish tags.
      returnData.push(spanishOutputString)
    } else {
      returnData.push(defaultLanguage)
    }
  } else{
    let unitStringSplit = unitString.split(",")

    for(let testString of unitStringSplit){
      if(testString.includes(spanishTestString)==true){
        returnData.push(spanishOutputString)
      } else{
        returnData.push(defaultLanguage)
      }  // 
    }
  }
  return{
    languages:returnData.toString()
  }
}
function phoneParser(phoneData) {
  // for(phoneData.)
}