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

function loadExternalDataForTesting(){
    loadConfigs()
    let allSheetData:manySheetDatas = constructSheetDataV2_(sheetDataConfig)
    // Here's a syntax error to test with:
    // test round 2
    let words = "finally done testing!"

}

function splitByMissionaryTesting(){
    // Step 0: Load KI Data, set things up
    loadConfigs()
    let allSheetData: manySheetDatas = constructSheetDataV2_(sheetDataConfig)

    let kiSheetData = allSheetData.localData
    let testKiData = allSheetData.perMissionary

    let kiData = new kiDataClass(kiSheetData.getData())
    
    let kiDataObj = kiData
    let outData:kiDataEntry[] = []
    let targetKeys = ["name1","name2","name3"]
    let newKeyName = "missionary"

    let keysToKeep = testKiData.getKeys()
	
    kiDataObj.breakdownAnalysis(keysToKeep,targetKeys,newKeyName,true)
	

    // for(let entry of kiDataObj){

    //     for(let key of targetKeys){
    //         let newEntry = {...entry}
    //         if(entry[key]!=""){
    //             newEntry[newKeyName] = newEntry[key]
    //             outData.push(newEntry)
    //         }
    //     }
    // }

    // send data to display

    testKiData.setData(kiDataObj.end)
    
}


function testDateConverter() {
    console.log(convertToSheetDate_(new Date()))
}
function aggregateDebugData() {
    // Step 0: Load everything up.
    loadConfigs();
    let allSheetData: manySheetDatas = constructSheetDataV2_(sheetDataConfig);
    let debugFlow: SheetData = allSheetData.debugStream;
    let debugLogData: SheetData = allSheetData.debugLT;
    // let outData: kiDataEntry[] = [];
    // Step 1: Get the last row of the data so that we know how far we went.  Then, load the data.
    let lastRow = debugFlow.getValues().length; // stored so we can delete old data upon completion.  (Should require a config option to do that tho)
    let debugData = new kiDataClass(debugFlow.getData());

    // Step 2: Calculate hour buckets to group data with.
    debugData.addGranulatedTime("timeStarted", "hourBucket", timeGranularities.hour);
    let inData = debugData.end;

    // This is essentially configuration for what things we want to aggregate with.
    let keysToKeep = ["timeStarted", "commit_sha", "triggerType", "github_branch_ref"];
    let keysToLumpBy = ["github_branch_ref", "commit_sha", "triggerType", "hourBucket"];
    let keysToAggregate = ["baseFunction"];
    let shardKey = "shardInstanceID";

    // Step 3: aggregate the data, then add the new keys to the sheetData object.
    debugData.aggregateByKeys(keysToLumpBy, keysToKeep, keysToAggregate, shardKey)
    debugData.convertToSheetDate("timeStarted", "timeStarted")
    debugData.convertToSheetDate("hourBucket", "hourBucket")
    debugLogData.addKeysFromArray(debugData.newKeys)
    // Step 4: add the data to the sheet.
    debugLogData.insertData(debugData.end);
    
    // Step Last:  Delete old entries.

    debugFlow.destroyRows(lastRow)

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
        cleanDebugLog:aggregateDebugData,
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

    let keysToKeep = ["areaName","areaEmail","isDuplicate","areaID","combinedNames","facebookRefs","kiDate", "zone", "district"]
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

    let keysToKeep = ["areaName", "areaEmail", "isDuplicate", "areaID", "combinedNames", "kiDate", "zone", "district"];
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



