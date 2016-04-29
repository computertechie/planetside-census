/**
 * Created by Pepper on 11/4/2015.
 */

var config = require('./config/default');
var cQuery = require('./lib/CensusQuery.js');
var jQuery = require('./lib/JoinQuery.js');

var PS2Census = function (options) {
    if (options) {
        for (option in config) {
            if (!options[option])
                options[option] = config[option];
        }
    }
    else
        options = config;

    cQuery.prototype.options = options;
};

PS2Census.prototype.CensusQuery = cQuery;
PS2Census.prototype.JoinQuery = jQuery;

module.exports = PS2Census;