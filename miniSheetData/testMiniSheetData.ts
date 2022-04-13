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


function removeDuplicates(kiData) {
    let output = []
    for (let entry of kiData) {
        if (!entry.isDuplicate) {
            output.push(entry)
        }
    }
    return output
}

function calculateRR_(kiData) {
    // this calculates retention rate (or leaves it blank, if there are zero recent converts)
    // creates a key with the name ``rrPercent`` of type float
}
function calculateCombinedName(kiData) {
    // this is a bit computationally expensive, you'll probably want to run this *after* you run scoping things
    // creates a key with the name ``combinedNames`` of type string
    let output = []
    let newKeyName = "combinedNames"
    let missionaryKeys = {
        m1: {
            name: "name1",
            pos: "position1",
            trainer:"isTrainer1"
        },
        m2: {
            name: "name2",
            pos: "position2",
            trainer: "isTrainer2"
        },
        m3: {
            name: "name3",
            pos: "position3",
            trainer: "isTrainer3"
        }
    }
    for (let entry of kiData) {
        let preOut = ""
        for (let missionary in missionaryKeys) {
            let missProps = missionaryKeys[missionary]
            if (entry[missProps.name] != "") {
                let outString = entry[missProps.name] + " (" + entry[missProps.position] +") "
                preOut += outString
            }
        }
        entry[newKeyName] = preOut
        output.push(entry)
    }
    return output
}

function getThisWeeksData_(kiData) {
    let sundayDate = getSundayOfCurrentWeek();
    let minMillis = sundayDate.getTime();
    let output = [];
    for (let entry of kiData) {
        let kiDate = new Date(entry.kiDate);
        let kiMilliseconds = kiDate.getTime();
        if (kiMilliseconds >= minMillis) {
            output.push(entry);

        }
    }
    console.log("in entries:", kiData.length, " out entries:", output.length);
    return output;
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