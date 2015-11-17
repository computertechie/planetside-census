/**
 * Created by Pepper on 11/4/2015.
 */

var defaultConfig = require('./config/default');
var config = require('config');
var cQuery = require('./lib/CensusQuery.js');
var jQuery = require('./lib/JoinQuery.js');

var PS2Census = function(options){
    config.util.extendDeep(defaultConfig, options);
    config.util.setModuleDefaults('census', defaultConfig);
};

PS2Census.prototype.CensusQuery = cQuery;
PS2Census.prototype.JoinQuery = jQuery;

module.exports = PS2Census;