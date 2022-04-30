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
    // dunno if this will work or not yet, but we'll see!
    // syncDataFlowCols_(allSheetData.form, allSheetData.data)

    return allSheetData;
}

function testBattery() {
    let startTime = new Date();
    console.log("Starting All Tests");
    let tests = {
        tmm: updateTMMReport,
        techSquad: updateTechSquadReport,
        serviceRep: updateServiceRepReport,
        newHeader: testNewHeader,
        updateData: updateLocalDataStore,
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
    let localSheetData = constructSheetDataV2(sheetDataConfig.local);
    let remoteSheetData = constructSheetDataV2(sheetDataConfig.remote);
    // let dataSource = remoteSheetData.remoteData;
    let data = remoteSheetData.remoteData.getData();

    localSheetData.data.addKeys(remoteSheetData.remoteData);

    // dataSource.addKeys(localSheetData.data)
    // syncDataFlowCols_(dataSource, localSheetData.data)

    let kicData = new kiDataClass(data);

    localSheetData.data.setData(kicData.removeDuplicates().end);

}


function testSyncDataFlowCols() {
    let allSheetData2: manySheetDatas = constructSheetDataV2(sheetDataConfig.local);
    allSheetData2.data.addKeys(allSheetData2.form);
    // syncDataFlowCols_(allSheetData2.form,allSheetData2.data)

    let kiData = allSheetData2.form.getData();
    console.log("testing adding new keys");
    allSheetData2.data.insertData(kiData);
    console.log("GO check the datasheet");
}

function testNewHeader() {
    // step one: target the right sheet:
    let targetSheet: sheetDataEntry = sheetDataConfig.local.headerTest;
    // step two: open the spreadsheet long enough to delete the target.
    let targetID = "";
    if (targetSheet.sheetId == null || targetSheet.sheetId == undefined) {
        targetID = SpreadsheetApp.getActiveSpreadsheet().getId();
    } else {
        targetID = targetSheet.sheetId;
    }
    let spreadsheet = SpreadsheetApp.openById(targetID);
    let sheet = spreadsheet.getSheetByName(targetSheet.tabName);
    if (sheet != null) {
        spreadsheet.deleteSheet(sheet);
    }
    /* this was a really annoying one to track down: essentially because I was deleting the sheet, and spreadsheetApp 
    hadn't committed the changes to the server yet (because I/O is time-expensive), there were some really weird bugs.
    EVERY TIME the code ran, I got a ``Service Spreadsheets timed out while accessing document with [ID]`` error.

    Super frustrating, cost me like an entire hour.
    */
    SpreadsheetApp.flush();

    // step three: create a rawSheetData class.
    let rawSheetData = new RawSheetData(targetSheet);
    let headerTestSheet = new SheetData(rawSheetData);

    populateExtraColumnData_(headerTestSheet);
    headerTestSheet.setHeaders(headerTestSheet.getHeaders());
    // at this point, it should be done!
    console.log("go check the header on sheet ", targetSheet.tabName);
}

/**
 *  updates the TMM report
 *
 */
function updateTMMReport() {
    // let localSheetData = constructSheetDataV2(sheetDataConfig.local);
    let remoteSheetData = constructSheetDataV2(sheetDataConfig.remote);
    // sheetDataConfig.remote.
    let dataSheet = remoteSheetData.remoteData;

    let data = dataSheet.getData();
    let kicData = new kiDataClass(data);
    let tmmReport = remoteSheetData.tmmReport;
    kicData.calculatePercentage("rca", "rc", CONFIG.kiData.new_key_names.retentionRate);
    kicData.createSumOfKeys(INTERNAL_CONFIG.kiData.fb_referral_keys, INTERNAL_CONFIG.kiData.new_key_names.fb_referral_sum);
    let tmmReportData = kicData.removeDuplicates().getThisWeeksData().addShortLang().calculateCombinedName().end;
    // this gets rid of any and all data that might be left behind- in practice, this clears the sheet when there are no responses for the current week.
    // tmmReport.clearContent()
    tmmReport.setData(tmmReportData);
}

function updateTechSquadReport() {
    let localSheetData = constructSheetDataV2(sheetDataConfig.local);
    let remoteSheetData = constructSheetDataV2(sheetDataConfig.remote);

    let dataSheet = localSheetData.data;

    let data = dataSheet.getData();
    let kicData = new kiDataClass(data);
    let techReport = remoteSheetData.techSquad;


    let startDate = new Date("2022-01-20"); // TODO: I forgot what day we actually started calculating these
    kicData.createSumOfKeys(INTERNAL_CONFIG.kiData.fb_referral_keys, INTERNAL_CONFIG.kiData.new_key_names.fb_referral_sum);

    let refData = kicData.removeDuplicates().removeBeforeDate(startDate).calculateCombinedName().end;

    techReport.setData(refData);
}


function updateServiceRepReport() {
    let localSheetData = constructSheetDataV2(sheetDataConfig.local);
    let remoteSheetData = constructSheetDataV2(sheetDataConfig.remote);

    let dataSheet = localSheetData.data;

    let data = dataSheet.getData();
    let kicData = new kiDataClass(data);
    let serviceReport = remoteSheetData.serviceRep;

    let startDate = new Date("2022-01-20");
    let serviceData = kicData.removeDuplicates().removeBeforeDate(startDate).calculateCombinedName().end;

    serviceReport.setData(serviceData);
}


