function runSpreadDupes(){
  getLatLong()
  let allArray = []
  let spreadedPoints = spreadDupes().values
  for (let values in spreadedPoints){
    for (let things of spreadedPoints[values]){
      allArray.push(things)
    }
    
  }
  let sheet = spreadDupes().addressSheet
  sendDataToDisplayV3_(spreadDupes().header, allArray, sheet)
}

const MainSheetID = "1cUJ2j-Fl_Ss5ILA5HzNK0yTyQ6185OYsE3nNKyYbhkg"
const AddressSheetName = "unitGeo"
function latLong() {
  
  let addressSheet = SpreadsheetApp.openById(MainSheetID).getSheetByName(AddressSheetName);
  let data = addressSheet.getDataRange().getValues();
  let header = data.shift()
  let values = [];
  for (let entry of data){
    let fullAddress = entry[1];
    let { results: [latLongVal = null] = [] } = Maps.newGeocoder().geocode(fullAddress);
    
    const { geometry: { location: { lat, lng } } = {} } = latLongVal;
    let outEntry = []
    for(let subEntry of entry){
      outEntry.push(subEntry)
    }
    // let entries = [entry[0],entry[1],entry[2],entry[3],entry[4],entry[5],entry[6],entry[7],entry[8],entry[9],entry[10],`${lat}, ${lng}`];
    let outEntrylat = `${lat}`
    let outEntrylng = `${lng}`
    outEntry[11] = [outEntrylat,outEntrylng].toString() //`${lat}, ${lng}` 
    // Logger.log(outEntry[11])
    values.push(outEntry)
  }
  // Logger.log(values);
  return {
    data:values,
    header:header
  }
  
}

function spreadDupes(){
  let addressSheet = SpreadsheetApp.openById(MainSheetID).getSheetByName(AddressSheetName);
  let data = addressSheet.getDataRange().getValues();
  let mainDist = .015
  let fullAddressCol = 1
  
  let header = data.shift();
  let objDupes = {}
  let objNumberWards = {}
  let objBuildingData = {}
  
  for (let entry of data){
    // objDupes[entry[fullAddressCol]] = [];
    // objNumberWards[entry[fullAddressCol]] = [];
    objBuildingData[entry[2]]=[]
  }
  for (let entry of data){
    let allData = []
    allData = entry  
  
    // objDupes[entry[fullAddressCol]].push(entry[11]);
    // objNumberWards[entry[fullAddressCol]] = objDupes[entry[fullAddressCol]].length;
    objBuildingData[entry[2]].push(allData)
  
  }
  for (let value in objBuildingData){
    let count = 0;
    for (let entry of objBuildingData[value]){
      if (objBuildingData[value].length == 1){
        
      }
      else{
        let latlng = entry.pop();
        let latlngArray = latlng.toString().split(",");
        
        let latitude = parseFloat(latlngArray[0]);
        let longitude = parseFloat(latlngArray[1]);
             
        let newLatitude = latitude + (mainDist * Math.sin((360/(objBuildingData[value].length)*(Math.PI/180)* count)))
        let newLongitude = longitude + (mainDist * Math.cos((360/(objBuildingData[value].length)*(Math.PI/180)* count)))
        
        latlngArray = [newLatitude,newLongitude].join(",")
        entry.push(latlngArray)
        
        count++

      }
    
    }
  
  }

return{
  header:header,
  values:objBuildingData,
  addressSheet
}
}



function getLatLong(){

let values = latLong()
let sheet = SpreadsheetApp.openById(MainSheetID).getSheetByName(AddressSheetName);
sendDataToDisplayV3_(values.header,values.data,sheet);

}

function sendDataToDisplayV3_(header, finalData, sheet) {
    // responsible for actually displaying the data.  Clears first to get rid of anything that might be left over.
    sheet.clearContents();
    sheet.appendRow(header);
    Logger.log(finalData.length);
    Logger.log("adding Header");
    Logger.log(header);
    sheet.getRange(1, 1, 1, header.length).setValues([header]);
    Logger.log("added header, adding data");
    if (finalData.length == 0 || typeof finalData == null) {
        Logger.log("no data, skipping");
        return;
    } else {
        sheet.getRange(2, 1, finalData.length, finalData[0].length).setValues(finalData);
        Logger.log("Data added, sorting");
        sheet.getRange(2, 1, finalData.length, header.length).sort([{ column: 1, ascending: true }]);
        // Logger.log("data added")
    }

}
