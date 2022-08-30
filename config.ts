interface config {
    sheetTargets: manyKeyPairs;
    kiData: kiDataConfig;
}
// DIDITGOTHROUGH
interface manyKeyPairs {
    [index: string]: string;
}

interface kiDataConfig {
    "fb_referral_keys": string[],
    "baptism_source_keys": string[],
    "new_key_names": manyKeyPairs,
}

var sheetCoreConfig: sheetCoreConfigInfo = {
    cacheEnabled: true,
    cacheExpiration: 1800,
    cacheKey: "HEY THERE IT ME"
};

const OVERRIDE_SECRET_DATA = {
    // stick things in here to override config values.
};

function loadConfigs() {
    CONFIG = getConfig();
    sheetDataConfig = loadSheetConfig();
}

let INTERNAL_CONFIG: config = {
    sheetTargets: {
        localData: SpreadsheetApp.getActiveSpreadsheet().getId(),
        serviceRep: "Hey, this should get set by secrets",
        tmmReport: "Hey, this should get set by secrets",
        techSquad: "Hey, this should get set by secrets",
        remoteData: "Hey, this should get set by secrets",
        remoteDebugStream: "Hey, this should get set by secrets",
        remoteDebugLong: "Hey, this should also get set by secrets."


    },
    kiData: {
        fb_referral_keys: [
            "fb-ref-ysa",
            "fb-ref-asl",
            "fb-ref-service",
            "fb-ref-laredo-spa",
            "fb-ref-laredo-eng",
            "fb-ref-rgv-spa",
            "fb-ref-rgv-eng",
            "fb-ref-corpus",
            "fb-ref-personal",
            "fb-ref-st-eng",
            "fb-ref-st-spa"
        ],
        baptism_source_keys: [
            "bap-self-ref",
            "bap-street",
            "bap-ward-activity-or-event",
            "bap-ref-recent-convert",
            "bap-ref-part-member",
            "bap-ref-other-member",
            "bap-ref-teaching-pool",
            "bap-ref-other-non-member",
            "bap-fb-mission",
            "bap-fb-personal",
            "bap-family-history",
            "bap-taught-prev",
        ],

        new_key_names: {
            fb_referral_sum: "fb-ref-sum",
            retentionRate: "rrPercent",
        },

    },
};

//@ts-expect-error using external libraries is a little weird because it's not a classically-defined package...
var _ = lodash.load();

function getConfig(): config {
    let pre_config = _.cloneDeep(INTERNAL_CONFIG);
    let mod1 = _.cloneDeep(GITHUB_SECRET_DATA);
    let mod2 = _.cloneDeep(OVERRIDE_SECRET_DATA);
    let config = _.merge(pre_config, mod1, mod2);
    console.log(config);
    return config;
}

let CONFIG: config = getConfig();

// function loadConfig() {
//     let CONFIG: config = _.merge(INTERNAL_CONFIG, GITHUB_SECRET_DATA)
//     // let sheetDataConfig = sheetDataConfig
//     sheetDataConfig = sheetDataConfig
// }

let sheetDataConfig: manySheetDataEntries = loadSheetConfig();

function loadSheetConfig(): manySheetDataEntries {
    console.log("SheetConfig ran!");
    CONFIG = _.merge(INTERNAL_CONFIG, _.cloneDeep(GITHUB_SECRET_DATA), OVERRIDE_SECRET_DATA);

    let sheetDataConfig: manySheetDataEntries = {
        facebookBreakdown: {
            tabName: "facebookPie",
            headerRow: 0,
            allowWrite: true,
            includeSoftcodedColumns: false,
            initialColumnOrder: {
                areaName: 0,
                areaEmail: 1,
                isDuplicate: 2,
                areaID: 3,
                combinedNames: 4,
                facebookRefs: 5,
                breakdownKey: 6,
                kiDate: 7,
            }

        },
        baptismBreakdown: {
            tabName: "bapPie",
            headerRow: 0,
            allowWrite: true,
            includeSoftcodedColumns: false,
            initialColumnOrder: {
                areaName: 0,
                areaEmail: 1,
                isDuplicate: 2,
                areaID: 3,
                combinedNames: 4,
                baptisms: 5,
                breakdownKey: 6,
                kiDate: 7,
            }

        },
        debugStream: {
            tabName: "DEBUG SHEET",
            headerRow: 0,
            includeSoftcodedColumns: false,
            allowWrite: true,
            keyNamesToIgnore: [],
            sheetId: CONFIG.sheetTargets.remoteDebugStream,
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
                failures: 15,
                errors: 16,
                shardID: 17,
                shardInstanceID: 18,
                debugLogData: 19,
            },
        },
        debugLT: {
            tabName: "Debug-Condensed",
            headerRow: 0,
            includeSoftcodedColumns: true,
            allowWrite: true,
            keyNamesToIgnore: [],
            sheetId: CONFIG.sheetTargets.remoteDebugLong,
            initialColumnOrder: {
                "baseFunction":0,
                "github_branch_ref": 1,
                "commit_sha": 2,
                "triggerType": 3,
                "hourBucket": 4,
                // "baseFunction": 5,

            },
        },
        localData: {
            tabName: "Data",
            headerRow: 0,
            // sheetId: SpreadsheetApp.getActiveSpreadsheet().getId(),
            includeSoftcodedColumns: true,
            allowWrite: true,
            keyNamesToIgnore: ["responsePulled", "submissionEmail"],
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
                "fb-ref-rgv-eng": 61,
                "fb-ref-rgv-spa": 62,
                "fb-ref-laredo-eng": 63,
                "fb-ref-laredo-spa": 64,
                "fb-ref-ysa": 65,
                "fb-ref-asl": 66,
                "fb-ref-service": 67,
                "fb-ref-corpus": 68,
                "fb-ref-personal": 69,
                'feedback-general': 70,
                'feedback-improvement': 71,
                'feedback-analysis': 72,
                'fb-ref-st-eng': 73,
                'fb-ref-st-spa': 74,


            },
        },
        localForms: {
            tabName: "Form Responses",
            headerRow: 0,
            // sheetId: SpreadsheetApp.getActiveSpreadsheet().getId(),
            includeSoftcodedColumns: true,
            allowWrite: false,
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
                "bap-self-ref": 14,
                "bap-street": 15,
                "bap-ward-activity-or-event": 16,
                "bap-ref-recent-convert": 17,
                "bap-ref-part-member": 18,
                "bap-ref-other-member": 19,
                "bap-ref-teaching-pool": 20,
                "bap-ref-other-non-member": 21,
                "bap-fb-mission": 22,
                "bap-fb-personal": 23,
                "bap-family-history": 24,
                "bap-taught-prev": 25,
                "fb-role": 26,
                "fb-ref-rgv-eng": 27,
                "fb-ref-rgv-spa": 28,
                "fb-ref-laredo-eng": 29,
                "fb-ref-laredo-spa": 30,
                "fb-ref-ysa": 31,
                "fb-ref-asl": 32,
                "fb-ref-service": 33,
                "fb-ref-corpus": 34,
                "fb-ref-personal": 35,
                "feedback-general": 36, // had to hardcode these because I added more questions afterwards.
                "feedback-improvement": 37,
                "feedback-analysis": 38,
                "fb-ref-st-eng": 39,
                "fb-ref-st-spa": 40,
            }
        },
        serviceRep: {
            tabName: "serviceRep-data",
            headerRow: 2,
            includeSoftcodedColumns: false,
            sheetId: CONFIG.sheetTargets.serviceRep,
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
            includeSoftcodedColumns: false,
            sheetId: CONFIG.sheetTargets.tmmReport,
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
                "fb-ref-sum": 10,
                hasVehicle: 11,
                truncLang: 12,
                combinedNames: 13,
            },
        },
        techSquad: {
            tabName: "FB Referral Data",
            headerRow: 1,
            includeSoftcodedColumns: false,
            sheetId: CONFIG.sheetTargets.techSquad,
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
                "fb-ref-personal": 15,
                "fb-ref-st-eng": 16,
                "fb-ref-st-spa": 17,
                "fb-ref-sum": 18,
                isDuplicate: 19,
            },
        },
        remoteData: {
            tabName: "Data",
            headerRow: 0,
            sheetId: CONFIG.sheetTargets.remoteData,
            includeSoftcodedColumns: true,
            allowWrite: false,
            keyNamesToIgnore: ["responsePulled", "submissionEmail"],
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
                "fb-ref-rgv-eng": 61,
                "fb-ref-rgv-spa": 62,
                "fb-ref-laredo-eng": 63,
                "fb-ref-laredo-spa": 64,
                "fb-ref-ysa": 65,
                "fb-ref-asl": 66,
                "fb-ref-service": 67,
                "fb-ref-corpus": 68,
                "fb-ref-personal": 69,
                'feedback-general': 70,
                'feedback-improvement': 71,
                'feedback-analysis': 72,
                'fb-ref-st-eng': 73,
                'fb-ref-st-spa': 74,

            },
        },
        remoteForms: {
            tabName: "Form Responses",
            headerRow: 0,
            sheetId: CONFIG.sheetTargets.remoteData,
            includeSoftcodedColumns: true,
            allowWrite: false,
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
                "bap-self-ref": 14,
                "bap-street": 15,
                "bap-ward-activity-or-event": 16,
                "bap-ref-recent-convert": 17,
                "bap-ref-part-member": 18,
                "bap-ref-other-member": 19,
                "bap-ref-teaching-pool": 20,
                "bap-ref-other-non-member": 21,
                "bap-fb-mission": 22,
                "bap-fb-personal": 23,
                "bap-family-history": 24,
                "bap-taught-prev": 25,
                "fb-role": 26,
                "fb-ref-rgv-eng": 27,
                "fb-ref-rgv-spa": 28,
                "fb-ref-laredo-eng": 29,
                "fb-ref-laredo-spa": 30,
                "fb-ref-ysa": 31,
                "fb-ref-asl": 32,
                "fb-ref-service": 33,
                "fb-ref-corpus": 34,
                "fb-ref-personal": 35,
                "feedback-general": 36, // had to hardcode these because I added more questions afterwards.
                "feedback-improvement": 37,
                "feedback-analysis": 38,
                "fb-ref-st-eng": 39,
                "fb-ref-st-spa": 40
            }
        },
    };
    return sheetDataConfig;
}
