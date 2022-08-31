function constructSheetDataV2_(target: manySheetDataEntries): manySheetDatas {
    let allSheetData: manySheetDatas = {};
    let keys: string[] = ["Constructed SheetData objects for:"];
    for (let key in target) {
        let entry: sheetDataEntry = target[key];

        let rawSheetData = new RawSheetData(entry);
        let sheetData = new SheetData(rawSheetData);
        keys.push(key);
        allSheetData[key] = sheetData;
    }

    return allSheetData;
}

function appendArrayToObjWithKeyset_(keySet: string[], targetObj, value:kiDataEntry) {
    let targetValue = value[keySet[0]]
    if (keySet.length == 1) {
        if (!targetObj.hasOwnProperty(targetValue)) {
            targetObj[targetValue] = []
            // Theoretically I could stick the Aggregation functions in here...
        }
        targetObj[targetValue].push(value);
    } else {
        if (!targetObj.hasOwnProperty(targetValue)) {
            targetObj[targetValue] = {}
        }
        // targetObj[targetValue].assign()
        keySet.shift()
        
        appendArrayToObjWithKeyset_(keySet, targetObj[targetValue], value)
    }
    // console.log(keySet) // this creates a TON of spam...

    
    
}


function aggregateData_(depthLevels: number /*Length of the keysToAggregate object */, inputObject: {}, dataPassthrough: kiDataEntry[], keysToAggregate: string[], keysToKeep: string[], shardKey: string, newKeys: string[]): aggDataReturn {
    let outData: kiDataEntry[] = dataPassthrough;
    // inputObject.getIndex;
    if (depthLevels == 0) { // this should get me to the level of kiDataEntry[], I *think*.
        let subEntry = {};
        //@ts-ignore - I don't know how to properly define a recursive thing- by the time you get to this execution branch it should be guaranteed to be an array of objects.
        for (let key of inputObject) {
            // aggregation code
            // for (let entry of inputObject[key]) {
            for (let aggKey of keysToAggregate) {
                let targetKeyString = key[aggKey];
                if (subEntry.hasOwnProperty(shardKey) && subEntry[shardKey] != "") {
                    targetKeyString += subEntry[shardKey];
                }
                if (!subEntry.hasOwnProperty(targetKeyString)) {
                    subEntry[targetKeyString] = 0;
                    keysToKeep.push(targetKeyString)
                }
                subEntry[targetKeyString] += 1;
            }
        }
        for (let keeper of keysToKeep) {
            subEntry[keeper] = inputObject[0][keeper];
        }
        outData.push(subEntry);
    } else {
        for (let key in inputObject) {
            aggregateData_(depthLevels - 1, inputObject[key]/* This lets me target one layer into the inputObject every time. */, dataPassthrough, keysToAggregate, keysToKeep, shardKey,keysToKeep);
        }
    }
    return { data: outData, newKeys: newKeys };
}


function testKiSplitter() {
    loadConfigs();
    let allSheetData: manySheetDatas = constructSheetDataV2_(sheetDataConfig);
    let debugFlow: SheetData = allSheetData.debugStream;
    let debugLogData: SheetData = allSheetData.debugLT;
    // let outData: kiDataEntry[] = [];

    let lastRow = debugFlow.getValues().length; // stored so we can delete old data upon completion.  (Should require a config option to do that tho)
    let debugData = new kiDataClass(debugFlow.getData());

    debugData.addGranulatedTime("timeStarted", "hourBucket", timeGranularities.hour);
    let inData = debugData.end;

    let keysToKeep = ["timeStarted", "commit_sha", "triggerType", "github_branch_ref"];
    let keysToLumpBy = ["github_branch_ref", "commit_sha", "triggerType", "hourBucket"];
    let keysToAggregate = ["baseFunction"];
    let shardKey = "shardInstanceID";

    debugData.aggregateByKeys(keysToLumpBy, keysToKeep, keysToAggregate, shardKey)
    debugLogData.addKeysFromArray(debugData.keys)

    debugLogData.insertData(debugData.end);
    
    // Step Last:  Delete old entries.
    // debugFlow.clearRows(lastRow)
    console.log("Completed without crashing!  That's nice.")
    
}
function splitByDateTester() {
    loadConfigs();
    let allSheetData: manySheetDatas = constructSheetDataV2_(sheetDataConfig);
    let debugFlow: SheetData = allSheetData.debugStream
    let debugLogData: SheetData = allSheetData.debugLT
    let outData : kiDataEntry[] = []
    
    let debugData = new kiDataClass(debugFlow.getData())
    let lastRow = debugFlow.getValues().length // stored so we can delete old data upon completion.  (Should require a config option to do that tho)
    
    debugData.addGranulatedTime("timeStarted", "hourBucket", timeGranularities.hour)
    let inData = debugData.end
    
    let keysToKeep = ["timeStarted", "commit_sha", "triggerType",	"github_branch_ref"]
    let keysToLumpBy = ["github_branch_ref", "commit_sha", "triggerType", "hourBucket"]
    let keysToAggregate = ["baseFunction"]
    let shardKey = "shardInstanceID"

    // console.log(debugData.end)

    let groupedData = {}
    // Step One: Get the data into an aggregatable form: This is essentially a sorting operation.
    // returns a structure like this:
    /*
        {
            timeStarted1: {
                github_branch_ref1: {commit_sha1:{triggerType1:{hourBucket1:[kiDataEntries]},
                github_branch_ref2: {commit_sha2:{triggerType1:{hourBucket2:[kiDataEntries]},
                                                {triggerType2:{hourBucket3:[kiDataEntries]}
        }



    */
    
    for (let entry of inData) {
        appendArrayToObjWithKeyset_([...keysToLumpBy], groupedData, entry) // Had to use a spread operator to make a copy of the keysToLumpBy object.
    }
    // Step Two: Take the grouped up data and aggregate it.  WHEEE

    // BTW: this is absolutely the most ridiculous thing I've written in a while, and is probably not super duper robust?  Legit
    console.log(groupedData)
    let allKeysToKeep = [...keysToAggregate, ...keysToLumpBy, ...keysToKeep]
    let newKeys:string[] = []
    let aggDataOut = aggregateData_(keysToLumpBy.length, groupedData, [], keysToAggregate, allKeysToKeep,shardKey,newKeys)
    let aggData = aggDataOut.data
    // console.log(aggData)

    // Step Three: Take the aggregated data and add keys to everything that doesn't exist already.

    console.log(aggDataOut.newKeys)
    if (newKeys == aggDataOut.newKeys) {
        console.error("mutated newKeys object!")
    }
    
    debugLogData.addKeysFromArray(aggDataOut.newKeys)


    debugLogData.insertData(outData)
    console.log("Completed without crashing!  That's nice.")
}

function testBattery() {
    loadConfigs()
    let startTime = new Date();
    console.log("Starting All Tests");
    let tests = {
        tmm: updateTMMReport,
        techSquad: updateTechSquadReport,
        serviceRep: updateServiceRepReport,
        // newHeader: testNewHeader,
        updateData: updateLocalDataStore,
        updateFBpie: createFBpieChart,
        updateBapPie: createBapChart,
    };
    for (let entry in tests) {
        let test = tests[entry];
        console.log("beginning test for", entry);
        test();
    }
    let endTime = new Date();
    console.log("tests finished, took ", endTime.getTime() - startTime.getTime(), " milliseconds");
}

function updateLocalDataStore() {
    loadConfigs()
    let allSheetData = constructSheetDataV2_(sheetDataConfig);
    // let remoteSheetData = constructSheetDataV2(sheetData);
    // let dataSource = remoteSheetData.remoteData;
    let data = allSheetData.remoteData.getData();

    allSheetData.localData.addKeys(allSheetData.remoteData);
    let kicData = new kiDataClass(data);
    kicData.calculatePercentage("rca", "rc", CONFIG.kiData.new_key_names.retentionRate);
    kicData.createSumOfKeys(CONFIG.kiData.fb_referral_keys, CONFIG.kiData.new_key_names.fb_referral_sum);


    allSheetData.localData.setData(kicData.removeDuplicates().end);

}


function testSyncDataFlowCols() {
    loadConfigs()
    let allSheetData: manySheetDatas = constructSheetDataV2_(sheetDataConfig);
    allSheetData.localData.addKeys(allSheetData.form);


}


/**
 *  updates the TMM report
 *
 */
function updateTMMReport() {
    loadConfigs()
    // let localSheetData = constructSheetDataV2(sheetDataConfig.local);
    let allSheetData = constructSheetDataV2_(sheetDataConfig);
    // sheetDataConfig.remote.
    let kicData = new kiDataClass( allSheetData.localData.getData())

    // let data = dataSheet.getData();
    // let kicData = new kiDataClass(data);
    let tmmReport = allSheetData.tmmReport;
    kicData.calculatePercentage("rca", "rc", CONFIG.kiData.new_key_names.retentionRate);
    kicData.createSumOfKeys(CONFIG.kiData.fb_referral_keys, CONFIG.kiData.new_key_names.fb_referral_sum);
    let tmmReportData = kicData.removeDuplicates().getThisWeeksData().addShortLang().calculateCombinedName().end;
    // this gets rid of any and all data that might be left behind- in practice, this clears the sheet when there are no responses for the current week.
    // tmmReport.clearContent()
    tmmReport.setData(tmmReportData);
}

function updateTechSquadReport() {
    // loadConfig()
    loadConfigs()
    let allSheetData = constructSheetDataV2_(sheetDataConfig);
    
    let dataSheet = allSheetData.localData;

    let data = dataSheet.getData();
    let kicData = new kiDataClass(data);
    let techReport = allSheetData.techSquad;


    let startDate = new Date("2022-01-20"); // TODO: I forgot what day we actually started calculating these
    kicData.createSumOfKeys(CONFIG.kiData.fb_referral_keys, CONFIG.kiData.new_key_names.fb_referral_sum);

    let refData = kicData.removeDuplicates().removeBeforeDate(startDate).calculateCombinedName().end;

    techReport.setData(refData);
}

function createFBpieChart() {

    loadConfigs();
    let allSheetData = constructSheetDataV2_(sheetDataConfig);

    let dataSheet = allSheetData.localData;

    let data = dataSheet.getData();
    let kicData = new kiDataClass(data);
    let fbBreakdown = allSheetData.facebookBreakdown;


    let startDate = new Date("2022-01-20"); // TODO: I forgot what day we actually started calculating these
    kicData.createSumOfKeys(CONFIG.kiData.fb_referral_keys, CONFIG.kiData.new_key_names.fb_referral_sum);

    let keysToKeep = ["areaName","areaEmail","isDuplicate","areaID","combinedNames","facebookRefs","kiDate"]
    let breakdownKeyName = "facebookRefs"
    let refData = kicData.removeDuplicates().calculateCombinedName().breakdownAnalysis(keysToKeep, CONFIG.kiData.fb_referral_keys, breakdownKeyName).end;

    fbBreakdown.setData(refData);
}

function createBapChart() {
    
    loadConfigs();
    let allSheetData = constructSheetDataV2_(sheetDataConfig);

    let dataSheet = allSheetData.localData;

    let data = dataSheet.getData();
    let kicData = new kiDataClass(data);
    let fbBreakdown = allSheetData.baptismBreakdown;


    let startDate = new Date("2022-01-20"); // TODO: I forgot what day we actually started calculating these
    // kicData.createSumOfKeys(CONFIG.kiData.fb_referral_keys, CONFIG.kiData.new_key_names.fb_referral_sum);

    let keysToKeep = ["areaName", "areaEmail", "isDuplicate", "areaID", "combinedNames", "kiDate"];
    let breakdownKeyName = "baptisms";
    let refData = kicData.removeDuplicates().calculateCombinedName().breakdownAnalysis(keysToKeep, CONFIG.kiData.baptism_source_keys, breakdownKeyName).end;

    fbBreakdown.setData(refData);
}


function updateServiceRepReport() {
    loadConfigs()
    let allSheetData = constructSheetDataV2_(sheetDataConfig);
    // let remoteSheetData = constructSheetDataV2(sheetDataConfig.remote);

    let dataSheet = allSheetData.localData;

    let data = dataSheet.getData();
    let kicData = new kiDataClass(data);
    let serviceReport = allSheetData.serviceRep;

    let startDate = new Date("2022-01-20");
    let serviceData = kicData.removeDuplicates().removeBeforeDate(startDate).calculateCombinedName().end;

    serviceReport.setData(serviceData);
}



