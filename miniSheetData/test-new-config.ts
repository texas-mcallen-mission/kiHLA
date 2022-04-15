// this is a test to see if I can let constructSheetData() coexist with remotes and keep cache working

/*
    local:
    form
    data
    contact
    debug


    remote:
    serviceRep
    tmmReport
    fbReferrals
    remoteData (If I add it, lol)

*/

/*
    This is about as simple as I could make the config while covering all the bases.
    sheetDataEntry is the required things to make a sheetData class
    sheetDataHolder is the way to make a big object of entries.

    columnConfig is how I get the any:number object necessary for configuring column position keys in sheetData.


*/

interface sheetDataEntry {
    initialColumnOrder: columnConfig,
    tabName: string,
    headerRow: number,
    sheetId?: string,
    allowWrite?: boolean,

}

interface sheetDataHolder {
    [index: string]: sheetDataEntry;
}

interface columnConfig {
    [index: string]: number,

}
// {local:sheetDataEntry,remote:sheetDataEntry}


// function lol() {
//     let obj: { any:any } = {}
//     return obj
// }

let sheetDataConfig: { local: sheetDataHolder, remote: sheetDataHolder; } = {
    local: {
        form: {
            tabName: "Form Responses",
            headerRow: 0,
            initialColumnOrder: {
                areaName: 0,
                responsePulled: 1,
                isDuplicate: 2,
                formTimestamp: 3,
                submissionEmail: 4,
                kiDate: 5,
                np: 6,
                sa: 7,
                bd: 8,
                bc: 9,
                rca: 10,
                rc: 11,
                serviceHrs: 12,
                cki: 13,
            },
        },
        data: {
            tabName: "Data",
            headerRow: 0,
            initialColumnOrder: {
                areaName: 0,
                log: 1,
                areaEmail: 2,
                isDuplicate: 3,
                formTimestamp: 4, //form data
                areaID: 5,
                kiDate: 6, //form data

                np: 7, //form data
                sa: 8, //form data
                bd: 9, //form data
                bc: 10, //form data
                rca: 11, //form data
                rc: 12, //form data
                serviceHrs: 14, //form data

                name1: 15,
                position1: 16,
                isTrainer1: 17,
                name2: 18,
                position2: 19,
                isTrainer2: 20,
                name3: 21,
                position3: 22,
                isTrainer3: 23, // hello, update!

                cki: 13, //form data
                // super confused
                districtLeader: 24,
                zoneLeader1: 25,
                zoneLeader2: 26,
                zoneLeader3: 27,
                stl1: 28,
                stl2: 29,
                stl3: 30,
                stlt1: 31,
                stlt2: 32,
                stlt3: 33,
                assistant1: 34,
                assistant2: 35,
                assistant3: 36,

                district: 37,
                zone: 38,
                unitString: 39,
                hasMultipleUnits: 40,
                languageString: 41,
                isSeniorCouple: 42,
                isSisterArea: 43,
                hasVehicle: 44,
                vehicleMiles: 45,
                vinLast8: 46,
                aptAddress: 47,

                "bap-self-ref": 48,
                "bap-street": 49,
                "bap-ward-activity-or-event": 50,
                "bap-ref-recent-convert": 51,
                "bap-ref-part-member": 52,
                "bap-ref-other-member": 53,
                "bap-ref-teaching-pool": 54,
                "bap-ref-other-non-member": 55,
                "bap-fb-mission": 56,
                "bap-fb-personal": 57,
                "bap-family-history": 58,
                "bap-taught-prev": 59,
                "fb-role": 60,
                "fb-ref-ysa": 61,
                "fb-ref-asl": 62,
                "fb-ref-service": 63,
                "fb-ref-laredo-spa": 64,
                "fb-ref-laredo-eng": 65,
                "fb-ref-rgv-spa": 66,
                "fb-ref-rgv-eng": 67,
                "fb-ref-corpus": 68,
            },
        },
        contact: {
            tabName: "Contact Data",
            headerRow: 0,
            initialColumnOrder: {
                dateContactGenerated: 0,
                areaEmail: 1,
                areaName: 2,
                name1: 3,
                position1: 4,
                isTrainer1: 5,
                name2: 6,
                position2: 7,
                isTrainer2: 8,
                name3: 9,
                position3: 10,
                isTrainer3: 11,
                district: 12,
                zone: 13,
                unitString: 14,
                hasMultipleUnits: 15,
                languageString: 16,
                isSeniorCouple: 17,
                isSisterArea: 18,
                hasVehicle: 19,
                vehicleMiles: 20,
                vinLast8: 21,
                aptAddress: 22,
            },
        },
        // word: { // this was a test to see if the typescript thing was strict enough / properly working
        //     configuredWrongWarnMeAboutIt: {
        //         loololo:"BEANS"
        //     },
        //     tabName:"chickenNugget"
        // },
        debug: {
            tabName: "DEBUG SHEET",
            headerRow: 0,
            initialColumnOrder: {
                functionName: 0,
                baseFunction: 1,
                triggerType: 2,
                timeStarted: 3,
                timeEnded: 4,
                commit_sha: 5,
                action_event_name: 6,
                github_actor: 7,
                job_id: 8,
                github_repository: 9,
                github_branch_ref: 10,
                executionCounter: 11,
                cycleEndMillis: 12,
                duration: 13,
                cycleStartMillis: 14,
                failures: 15

            },
        },
    },
    remote: {
        serviceRep: {
            tabName: "",
            headerRow: 2,
            sheetId: CONFIG.dataFlow.sheetTargets.serviceRep
            initialColumnOrder: {
                areaName: 0,
                areaID: 1,
                district: 2,
                zone: 3,
                combinedNames: 4,
                kiDate: 5,
                serviceHrs: 6,
            },
        },
        tmmReport: {
            tabName: "TMM Report Printable",
            headerRow: 9,
            sheetId: CONFIG.dataFlow.sheetTargets.tmmReport
            initialColumnOrder: {
                areaName: 0,
                district: 1,
                zone: 2,
                np: 3,
                sa: 4,
                bd: 5,
                bc: 6,
                rrPercent: 7,
                serviceHrs: 8,
                cki: 9,
                hasVehicle: 10,
                truncLang: 11,
                combinedNames: 12,
            },
        },
        fbReferrals: {
            tabName: "techSquad Data",
            headerRow: 1,
            sheetId: CONFIG.dataFlow.sheetTargets.fbReferrals,
            initialColumnOrder: {
                areaName: 0,
                areaID: 1,
                district: 2,
                zone: 3,
                combinedNames: 4,
                kiDate: 5,
                "fb-role": 6,
                "fb-ref-ysa": 7,
                "fb-ref-asl": 8,
                "fb-ref-service": 9,
                "fb-ref-laredo-spa": 10,
                "fb-ref-laredo-eng": 11,
                "fb-ref-rgv-spa": 12,
                "fb-ref-rgv-eng": 13,
                "fb-ref-corpus": 14,
            },
        },
        remoteData: {
            tabName: "Data",
            headerRow: 1,
            sheetId: CONFIG.dataFlow.sheetTargets.data,
            allowWrite: false,
            initialColumnOrder: {
                areaName: 0,
                log: 1,
                areaEmail: 2,
                isDuplicate: 3,
                formTimestamp: 4, //form data
                areaID: 5,
                kiDate: 6, //form data

                np: 7, //form data
                sa: 8, //form data
                bd: 9, //form data
                bc: 10, //form data
                rca: 11, //form data
                rc: 12, //form data
                cki: 13, //form data
                serviceHrs: 14, //form data

                name1: 15,
                position1: 16,
                isTrainer1: 17,
                name2: 18,
                position2: 19,
                isTrainer2: 20,
                name3: 21,
                position3: 22,
                isTrainer3: 23, // hello, update!

                // super confused
                districtLeader: 24,
                zoneLeader1: 25,
                zoneLeader2: 26,
                zoneLeader3: 27,
                stl1: 28,
                stl2: 29,
                stl3: 30,
                stlt1: 31,
                stlt2: 32,
                stlt3: 33,
                assistant1: 34,
                assistant2: 35,
                assistant3: 36,

                district: 37,
                zone: 38,
                unitString: 39,
                hasMultipleUnits: 40,
                languageString: 41,
                isSeniorCouple: 42,
                isSisterArea: 43,
                hasVehicle: 44,
                vehicleMiles: 45,
                vinLast8: 46,
                aptAddress: 47,
                // "formNotes": 48,    //form data
                //...additional form data (ex. baptism sources)
                "bap-self-ref": 48,
                "bap-street": 49,
                "bap-ward-activity-or-event": 50,
                "bap-ref-recent-convert": 51,
                "bap-ref-part-member": 52,
                "bap-ref-other-member": 53,
                "bap-ref-teaching-pool": 54,
                "bap-ref-other-non-member": 55,
                "bap-fb-mission": 56,
                "bap-fb-personal": 57,
                "bap-family-history": 58,
                "bap-taught-prev": 59,
                "fb-role": 60,
                "fb-ref-ysa": 61,
                "fb-ref-asl": 62,
                "fb-ref-service": 63,
                "fb-ref-laredo-spa": 64,
                "fb-ref-laredo-eng": 65,
                "fb-ref-rgv-spa": 66,
                "fb-ref-rgv-eng": 67,
                "fb-ref-corpus": 68,

            },
        },
    }



};


function testStringify() {
    let test = JSON.stringify(sheetDataConfig);
    console.log(test);

    let test2 = JSON.stringify(sheetDataConfig.local);
    console.log(test2);
    // I think I can turn this bad boi into a cached sheetData again if I try hard enough
}

function testNewHeader{
    let targetSheet = INTERNAL_CONFIG.dataFlow.sheetTargets.headerTest;
    let tabName = "headerTest";
    let headerTest = {
        tabName: "techSquad Data",
        headerRow: 1,
        sheetId: CONFIG.dataFlow.sheetTargets.fbReferrals,
        initialColumnOrder: {
            test1: 0,
            "thisShouldBeOnTheHeader": 1
        },
    }
    // open the spreadsheet long enough to delete the sheet to make sure that things work
    let spreadsheet = SpreadsheetApp.openById(headerTest.sheetId)
    let sheet = spreadsheet.openByName(headerTest.tabName)
    if (sheet != null) {
        spreadsheet.deleteSheet(sheet)
    }
    
    let rawSheetData = new RawSheetData(headerTest.tabName, headerTest.headerRow, headerTest.initialColumnOrder)
    let headerTest = new SheetData(rawSheetData)

    console.log(headerTest.initialColumnOrder)

}