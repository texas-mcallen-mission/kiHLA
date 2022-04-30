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
        // newHeader: testNewHeader,
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
    let allSheetData = constructSheetDataV2(sheetData);
    // let remoteSheetData = constructSheetDataV2(sheetData);
    // let dataSource = remoteSheetData.remoteData;
    let data = allSheetData.remoteData.getData();

    allSheetData.data.addKeys(allSheetData.remoteData);

    // dataSource.addKeys(localSheetData.data)
    // syncDataFlowCols_(dataSource, localSheetData.data)

    let kicData = new kiDataClass(data);

    allSheetData.data.setData(kicData.removeDuplicates().end);

}


function testSyncDataFlowCols() {
    let allSheetData: manySheetDatas = constructSheetDataV2(sheetData);
    allSheetData.data.addKeys(allSheetData.form);


}


/**
 *  updates the TMM report
 *
 */
function updateTMMReport() {
    // let localSheetData = constructSheetDataV2(sheetDataConfig.local);
    let remoteSheetData = constructSheetDataV2(sheetData);
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
    let allSheetData = constructSheetDataV2(sheetData);
    
    let dataSheet = allSheetData.data;

    let data = dataSheet.getData();
    let kicData = new kiDataClass(data);
    let techReport = allSheetData.techSquad;


    let startDate = new Date("2022-01-20"); // TODO: I forgot what day we actually started calculating these
    kicData.createSumOfKeys(INTERNAL_CONFIG.kiData.fb_referral_keys, INTERNAL_CONFIG.kiData.new_key_names.fb_referral_sum);

    let refData = kicData.removeDuplicates().removeBeforeDate(startDate).calculateCombinedName().end;

    techReport.setData(refData);
}


function updateServiceRepReport() {
    let allSheetData = constructSheetDataV2(sheetData);
    // let remoteSheetData = constructSheetDataV2(sheetDataConfig.remote);

    let dataSheet = allSheetData.data;

    let data = dataSheet.getData();
    let kicData = new kiDataClass(data);
    let serviceReport = allSheetData.serviceRep;

    let startDate = new Date("2022-01-20");
    let serviceData = kicData.removeDuplicates().removeBeforeDate(startDate).calculateCombinedName().end;

    serviceReport.setData(serviceData);
}



