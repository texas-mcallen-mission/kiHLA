function testTheThings(){
    let allSheetData = constructSheetData()

    let localData = allSheetData.localData
    let remoteData = allSheetData.data

    let remoteDataData = remoteData.getData()
    let remoteDataHeaders = remoteData.getHeaders()
    // localData.setHeaders(remoteDataHeaders)  Unfortunately, this doesn't work (yet)
    let thisWeeksData = getThisWeeksData_(remoteDataData)
    localData.setData(thisWeeksData);
}

function getThisWeeksData_(kiData) {
    let minDate = new Date();
    minDate.setDate(minDate.getDate() - minDate.getDay());
    let minMillis = minDate.getMilliseconds();
    let output = [];
    for (let entry of kiData) {
        let kiMilliseconds = entry.kiDate.getMilliseconds();
        if (kiMilliseconds >= minMillis) output.push(entry);
    }
    return output;
}