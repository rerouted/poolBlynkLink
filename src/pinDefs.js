// ####################################################################################################
// poolController Virtual Pin Mapping
//
// - maps poolController variables to virtual pins within Blynk
// - change virtual pins as needed.  These need to be mapped to the Blynk App UI to display correctly
// ####################################################################################################

module.exports = Object.freeze({
    logTerminal: 0,
    iTouchDateTime: 1,
    iTouchAirTemp: 2,
    iTouchPoolTemp: 3,
    iTouchSpaTemp: 4,
    iTouchPoolSetPoint: 5,
    iTouchSpaSetPoint: 6,

    // Intellitouch Circuits
    circuit1: 11,
    circuit2: 12, // Pool Lights
    circuit3: 13, // AUX1
    circuit4: 14, // AUX2
    circuit5: 15, // AUX3
    circuit6: 16,
    circuit7: 17,
    circuit8: 18,
    circuit9: 19,
    circuit10: 20,
    circuit11: 21,
    circuit12: 22,
    circuit13: 23,
    circuit14: 24,
    circuit15: 25,
    circuit16: 26,
    circuit17: 27,
    circuit18: 28,
    circuit19: 29,
    circuit20: 30,

    // Intellibrite Light Modes
    intellibriteMode: 35,

    // Intelliflow Pump(s)
    // Pump #1
    pump: [{
    status: 40,
    watts: 41,
    rpm: 42,
    gpm: 43,
    },
    {// Pump #2
    status: 44,
    watts: 45,
    rpm: 46,
    gpm: 47,
    }],

    // IntelliChlor SCG
    scgSalt: 50,
    scgPercent: 51,
    scgStatus: 52

});