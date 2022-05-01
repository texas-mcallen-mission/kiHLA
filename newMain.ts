function constructSheetDataV2(target: manySheetDataEntries): manySheetDatas {
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
        updateFBpie:createFBpieChart,
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
    let allSheetData = constructSheetDataV2(sheetDataConfig);
    // let remoteSheetData = constructSheetDataV2(sheetData);
    // let dataSource = remoteSheetData.remoteData;
    let data = allSheetData.remoteData.getData();

    allSheetData.localData.addKeys(allSheetData.remoteData);

    
    let kicData = new kiDataClass(data);

    allSheetData.localData.setData(kicData.removeDuplicates().end);

}


function testSyncDataFlowCols() {
    loadConfigs()
    let allSheetData: manySheetDatas = constructSheetDataV2(sheetDataConfig);
    allSheetData.localData.addKeys(allSheetData.form);


}


/**
 *  updates the TMM report
 *
 */
function updateTMMReport() {
    loadConfigs()
    // let localSheetData = constructSheetDataV2(sheetDataConfig.local);
    let allSheetData = constructSheetDataV2(sheetDataConfig);
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
    let allSheetData = constructSheetDataV2(sheetDataConfig);
    
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
    let allSheetData = constructSheetDataV2(sheetDataConfig);

    let dataSheet = allSheetData.localData;

    let data = dataSheet.getData();
    let kicData = new kiDataClass(data);
    let fbBreakdown = allSheetData.facebookBreakdown;


    let startDate = new Date("2022-01-20"); // TODO: I forgot what day we actually started calculating these
    kicData.createSumOfKeys(CONFIG.kiData.fb_referral_keys, CONFIG.kiData.new_key_names.fb_referral_sum);

    let keysToKeep = ["areaName","areaEmail","isDuplicate","areaID","facebookRefs"]
    let breakdownKeyName = "facebookRefs"
    let refData = kicData.removeDuplicates().removeBeforeDate(startDate).calculateCombinedName().breakdownAnalysis(keysToKeep, CONFIG.kiData.fb_referral_keys, breakdownKeyName).end;

    fbBreakdown.setData(refData);
}


function updateServiceRepReport() {
    loadConfigs()
    let allSheetData = constructSheetDataV2(sheetDataConfig);
    // let remoteSheetData = constructSheetDataV2(sheetDataConfig.remote);

    let dataSheet = allSheetData.localData;

    let data = dataSheet.getData();
    let kicData = new kiDataClass(data);
    let serviceReport = allSheetData.serviceRep;

    let startDate = new Date("2022-01-20");
    let serviceData = kicData.removeDuplicates().removeBeforeDate(startDate).calculateCombinedName().end;

    serviceReport.setData(serviceData);
}



