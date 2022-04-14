function testTheThings(){
    let allSheetData = constructSheetData()

    let localData = allSheetData.localData
    let remoteData = allSheetData.data

    let remoteDataData = remoteData.getData()
    let remoteDataHeaders = remoteData.getHeaders()
    // localData.setHeaders(remoteDataHeaders)  Unfortunately, this doesn't work (yet)
    let thisWeeksData = getThisWeeksData_(remoteDataData)
    let deduped = removeDuplicates(thisWeeksData)
    localData.setData(deduped);
}

function updateTMMReport() {
    let allSheetData = constructSheetData()
    let remoteDataSheet = allSheetData.data

    let remoteData = remoteDataSheet.getData()
    let kicData = new kiDataClass(remoteData)
    let tmmReport = allSheetData.tmmReport

    let tmmReportData = kicData.removeDuplicates().getThisWeeksData().addShortLang().calculateCombinedName().calculateRR().end

    tmmReport.setData(tmmReportData)
}

function updateServiceRepReport() {
    let allSheetData = constructSheetData()
    let remoteDataSheet = allSheetData.data;

    let remoteData = remoteDataSheet.getData();
    let kicData = new kiDataClass(remoteData);
    let serviceReport = allSheetData.serviceRep

    let startDate = new Date("2022-01-20")
    let serviceData = kicData.removeDuplicates().removeBeforeDate(startDate).calculateCombinedName().end

    serviceReport.setData(serviceData)
}
function getSundayOfCurrentWeek() {
    const today = new Date();
    const first = today.getDate() - today.getDay() + 1;
    const last = first + 6;

    const monday = new Date(today.setDate(first));
    console.log(monday); // 👉️ Mon Jan 17 2022

    const sunday = new Date(today.setDate(last - 8));
    console.log(sunday);
    return sunday;
}



