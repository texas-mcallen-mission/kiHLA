//@ts-check
/*
KIC-config
General and debugging configuration parameters
*/

let INTERNAL_CONFIG = {
    // docIds
    docIds_kicFormId: "This, along with the ones below, should probably be set in env secrets", //The Document ID of the Key Indicators for Conversion Report Google Form (where missionaries submit their KICs every Sunday).    gcopy:'1CbCGdXXjPmQmpLKJAaER0cSYSGrb3ES3y2XGpr3czEw'    live:'1Zc-3omEIjAeQrmUxyG8YFk4PdnPf37XiFy3PRK2cP8g'



    // general

    // dataFlow

    dataFlow: {
        forceAreaIdReloadOnUpdateDataSheet: false,

        areaId_cacheExpirationLimit: 1800, //Maximum time in seconds before the cache gets reset

        areaId_cacheKey: "butterflies and clouds", //ID to use when storing areaIDs in the cache

        allSheetData_cacheEnabled: false, //Cache allSheetData, the object returned by constructSheetData()

        allSheetData_cacheExpirationLimit: 1800, //Maximum time in seconds before the cache gets reset

        allSheetData_cacheKey: "puppies and flowers", //ID to use when storing allSheetData in the cache

        missionOrgData_cacheEnabled: false, //[unimplemented] Cache missionOrgData, the object returned by getMissionOrgData()

        maxRowToMarkDuplicates: 500, //If set to -1, the full sheet will be checked (which takes a long time!). If set to 0, duplicates will not be marked.

        log_importContacts: false,
        log_dataMerge: true,
        log_responsePulled: false,
        log_duplicates: false,
        skipMarkingPulled: false, //Stops marking Form Responses as having been pulled into the data sheet

        skipMarkingDuplicates: false, //TODO Re-implement?

        freezeContactData: false,

        formColumnsToExcludeFromDataSheet: ["responsePulled", "submissionEmail"],

        sheetTargets: {
            form: "SECRETS SHOULD STICK AN ID HERE",
            data: "SECRETS SHOULD STICK AN ID HERE",
            contact: SpreadsheetApp.getActiveSpreadsheet().getId(),
            debug: SpreadsheetApp.getActiveSpreadsheet().getId(),
            localData: SpreadsheetApp.getActiveSpreadsheet().getId(),
            tmmReport: SpreadsheetApp.getActiveSpreadsheet().getId(),
            
        },

    },

    commonLib: {
        log_access_info: false, // if set to true, logger will tell you whether or not files are accessible
        log_display_info: false, // if set to true, sendDataToDisplay & sendReportToDisplay will display extra debug information
        log_display_info_extended: false, // if set to true, sendDataToDisplay & sendReportToDisplay will display even more debug information
        log_time_taken: true, // if set to true, sendDataToDisplay & sendReportToDisplay will display how much time they took to run.  Pretty useful IMO
    },




};

// this combines the two objects together- the bottom ones overwrite the top ones.
//@ts-ignore
var _ = lodash.load();

function test_lodash() {
    console.log(CONFIG);
    // if you stick something in override_secret_data you'll be able to notice the changes.
}

// stick things here that you want to override your secret data- mostly for testing, or when you don't have access to modify github action secrets.
const OVERRIDE_SECRET_DATA = {
    //   dataFlow: { skipMarkingPulled: true } // easily re-commentable for convenience
};


var CONFIG = _.merge(INTERNAL_CONFIG, GITHUB_SECRET_DATA, OVERRIDE_SECRET_DATA);
