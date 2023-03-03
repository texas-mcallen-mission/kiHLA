function constructSheetDataV2_(target: manySheetDataEntries): manySheetDatas {
    const allSheetData: manySheetDatas = {};
    const keys: string[] = ["Constructed SheetData objects for:"];
    for (let key in target) {
        const entry: sheetDataEntry = target[key];

        const rawSheetData = new RawSheetData(entry);
        const sheetData = new SheetData(rawSheetData);
        keys.push(key);
        allSheetData[key] = sheetData;
    }

    return allSheetData;
}

function loadExternalDataForTesting(){
    loadConfigs()
    const allSheetData:manySheetDatas = constructSheetDataV2_(sheetDataConfig)
    // Here's a syntax error to test with:
    // test round 2
    const words = "finally done testing!"

}

function splitByMissionaryTesting(){
    // Step 0: Load KI Data, set things up
    loadConfigs()
    const allSheetData: manySheetDatas = constructSheetDataV2_(sheetDataConfig)

    const kiSheetData = allSheetData.localData
    const testKiData = allSheetData.perMissionary

    const kiData = new kiDataClass(kiSheetData.getData())
    
    const kiDataObj = kiData
    const outData:kiDataEntry[] = []
    const targetKeys = ["name1","name2","name3"]
    const newKeyName = "missionary"

    const keysToKeep = testKiData.getKeys()
	
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
    const allSheetData: manySheetDatas = constructSheetDataV2_(sheetDataConfig);
    const debugFlow: SheetData = allSheetData.debugStream;
    const debugLogData: SheetData = allSheetData.debugLT;
    // let outData: kiDataEntry[] = [];
    // Step 1: Get the last row of the data so that we know how far we went.  Then, load the data.
    const lastRow = debugFlow.getValues().length; // stored so we can delete old data upon completion.  (Should require a config option to do that tho)
    const debugData = new kiDataClass(debugFlow.getData());

    // Step 2: Calculate hour buckets to group data with.
    debugData.addGranulatedTime("timeStarted", "hourBucket", timeGranularities.hour);
    const inData = debugData.end;

    // This is essentially configuration for what things we want to aggregate with.
    const keysToKeep = ["timeStarted", "commit_sha", "triggerType", "github_branch_ref"];
    const keysToLumpBy = ["github_branch_ref", "commit_sha", "triggerType", "hourBucket"];
    const keysToAggregate = ["baseFunction"];
    const shardKey = "shardInstanceID";

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
    const startTime = new Date();
    console.log("Starting All Tests");
    const tests = {
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
        const test = tests[entry];
        console.log("beginning test for", entry);
        test();
    }
    const endTime = new Date();
    console.log("tests finished, took ", endTime.getTime() - startTime.getTime(), " milliseconds");
}

function updateLocalDataStore() {
    loadConfigs()
    const allSheetData = constructSheetDataV2_(sheetDataConfig);
    // let remoteSheetData = constructSheetDataV2(sheetData);
    // let dataSource = remoteSheetData.remoteData;
    const data = allSheetData.remoteData.getData();

    allSheetData.localData.addKeys(allSheetData.remoteData);
    const kicData = new kiDataClass(data);
    kicData.calculatePercentage("rca", "rc", CONFIG.kiData.new_key_names.retentionRate);
    kicData.createSumOfKeys(CONFIG.kiData.fb_referral_keys, CONFIG.kiData.new_key_names.fb_referral_sum);


    allSheetData.localData.setData(kicData.removeDuplicates().end);

}


function testSyncDataFlowCols() {
    loadConfigs()
    const allSheetData: manySheetDatas = constructSheetDataV2_(sheetDataConfig);
    allSheetData.localData.addKeys(allSheetData.form);


}


/**
 *  updates the TMM report
 *
 */
function updateTMMReport() {
    loadConfigs()
    // let localSheetData = constructSheetDataV2(sheetDataConfig.local);
    const allSheetData = constructSheetDataV2_(sheetDataConfig);
    // sheetDataConfig.remote.
    const kicData = new kiDataClass( allSheetData.localData.getData())

    // let data = dataSheet.getData();
    // let kicData = new kiDataClass(data);
    const tmmReport = allSheetData.tmmReport;
    kicData.calculatePercentage("rca", "rc", CONFIG.kiData.new_key_names.retentionRate);
    kicData.createSumOfKeys(CONFIG.kiData.fb_referral_keys, CONFIG.kiData.new_key_names.fb_referral_sum);
    const tmmReportData = kicData.removeDuplicates().getThisWeeksData().addShortLang().calculateCombinedName().end;
    // this gets rid of any and all data that might be left behind- in practice, this clears the sheet when there are no responses for the current week.
    // tmmReport.clearContent()
    tmmReport.setData(tmmReportData);
}

function updateTechSquadReport() {
    // loadConfig()
    loadConfigs()
    const allSheetData = constructSheetDataV2_(sheetDataConfig);
    
    const dataSheet = allSheetData.localData;

    const data = dataSheet.getData();
    const kicData = new kiDataClass(data);
    const techReport = allSheetData.techSquad;


    const startDate = new Date("2022-01-20"); // TODO: I forgot what day we actually started calculating these
    kicData.createSumOfKeys(CONFIG.kiData.fb_referral_keys, CONFIG.kiData.new_key_names.fb_referral_sum);

    const refData = kicData.removeDuplicates().removeBeforeDate(startDate).calculateCombinedName().end;

    techReport.setData(refData);
}

function createFBpieChart() {

    loadConfigs();
    const allSheetData = constructSheetDataV2_(sheetDataConfig);

    const dataSheet = allSheetData.localData;

    const data = dataSheet.getData();
    const kicData = new kiDataClass(data);
    const fbBreakDown = allSheetData.facebookBreakdown;


    const startDate = new Date("2022-01-20"); // TODO: I forgot what day we actually started calculating these
    kicData.createSumOfKeys(CONFIG.kiData.fb_referral_keys, CONFIG.kiData.new_key_names.fb_referral_sum);

    const keysToKeep = ["areaName","areaEmail","isDuplicate","areaID","combinedNames","facebookRefs","kiDate", "zone", "district"]
    const breakdownKeyName = "facebookRefs"
    const refData = kicData.removeDuplicates().calculateCombinedName().breakdownAnalysis(keysToKeep, CONFIG.kiData.fb_referral_keys, breakdownKeyName).end;

    fbBreakDown.setData(refData);
}

function createBapChart() {
    
    loadConfigs();
    const allSheetData = constructSheetDataV2_(sheetDataConfig);

    const dataSheet = allSheetData.localData;

    const data = dataSheet.getData();
    const kicData = new kiDataClass(data);
    const fbBreakdown = allSheetData.baptismBreakdown;


    const startDate = new Date("2022-01-20"); // TODO: I forgot what day we actually started calculating these
    // kicData.createSumOfKeys(CONFIG.kiData.fb_referral_keys, CONFIG.kiData.new_key_names.fb_referral_sum);

    const keysToKeep = ["areaName", "areaEmail", "isDuplicate", "areaID", "combinedNames", "kiDate", "zone", "district"];
    const breakdownKeyName = "baptisms";
    const refData = kicData.removeDuplicates().calculateCombinedName().breakdownAnalysis(keysToKeep, CONFIG.kiData.baptism_source_keys, breakdownKeyName).end;

    fbBreakdown.setData(refData);
}


function updateServiceRepReport() {
    loadConfigs()
    const allSheetData = constructSheetDataV2_(sheetDataConfig);
    // let remoteSheetData = constructSheetDataV2(sheetDataConfig.remote);

    const dataSheet = allSheetData.localData;

    const data = dataSheet.getData();
    const kicData = new kiDataClass(data);
    const serviceReport = allSheetData.serviceRep;

    const startDate = new Date("2022-01-20");
    const serviceData = kicData.removeDuplicates().removeBeforeDate(startDate).calculateCombinedName().end;

    serviceReport.setData(serviceData);
}



