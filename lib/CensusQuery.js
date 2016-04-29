/**
 * Created by Pepper on 11/3/2015.
 */
var Request = require('request');
var Promise = require('bluebird');

var CensusQuery = function () {
    this.startIndex = 0;
    this.limitNum = 0;
    this.distinctField = "";
    this.shownFields = [];
    this.hiddenFields = [];
    this.hasFields = [];
    this.whereFields = [];
    this.sortFields = [];
    this.joinQueries = [];

    this.resolveQueryString = function () {
        var query = "?";
        var querySegments = [];
        if (this.startIndex > 0) {
            querySegments.push("c:start=" + this.startIndex);
        }

        if (this.limitNum > 0) {
            querySegments.push("c:limit=" + this.limitNum);
        }

        if (this.shownFields.length) {
            querySegments.push("c:show=" + this.shownFields.join());
        }

        if (this.hiddenFields.length) {
            querySegments.push("c:hidden=" + this.hiddenFields.join());
        }

        if (this.hasFields.length) {
            querySegments.push("c:has=" + this.hasFields.join());
        }

        if (this.distinctField) {
            querySegments.push("c:distinct=" + this.distinctField);
        }

        if (this.whereFields.length) {
            var length = this.whereFields.length;
            for (var i = 0; i < length; i++) {
                querySegments.push(this.whereFields[i].field + "=" + this.whereFields[i].value);
            }
        }

        if (this.sortFields.length) {
            length = this.sortFields.length;
            var sorts = [];
            for (i = 0; i < length; i++) {
                sorts.push(sortFields[i].field + ":" + sortFields[i].direction);
            }
            querySegments.push("c:sort=" + sorts.join());
        }

        if (this.joinQueries.length) {
            length = this.joinQueries.length;
            var resolvedJoinQueries = [];
            for (i = 0; i < length; i++) {
                resolvedJoinQueries.push(this.joinQueries[i].resolve());
            }
            querySegments.push("c:join=" + resolvedJoinQueries.join());
        }

        return query + querySegments.join("&");
    }
};

CensusQuery.prototype.where = function (field, value) {
    this.whereFields.push({field: field, value: value});
    return this;
};

CensusQuery.prototype.show = function (fields) {
    this.shownFields = this.shownFields.concat(fields);
    return this;
};

CensusQuery.prototype.hide = function (fields) {
    this.hiddenFields = this.hiddenFields.concat(fields);
    return this;
};

CensusQuery.prototype.sort = function (field, direction) {
    this.sortFields.push({field: field, direction: direction});
    return this;
};

CensusQuery.prototype.has = function (field) {
    this.hasFields.push(field);
    return this;
};

CensusQuery.prototype.limit = function (limit) {
    this.limitNum = limit;
    return this;
};

CensusQuery.prototype.start = function (index) {
    this.startIndex = index;
    return this;
};

CensusQuery.prototype.join = function (query) {
    this.joinQueries.push(query);
    return this;
};

CensusQuery.prototype.distinct = function (field) {
    this.distinctField = field;
    return this;
};

CensusQuery.prototype.get = function (collection, callback) {
    var segments = [this.options.endpoint, this.options.service_id, "get", this.options.game, collection + this.resolveQueryString()];
    return new Promise(function (resolve, reject) {
        Request({
            url: segments.join('/'),
            json: true
        }, function (error, message, response) {
            if(error) return reject(error);
            resolve(response);
        });
    })
};

CensusQuery.prototype.count = function (collection, callback) {
    var segments = [options.get('census.endpoint'), options.get('census.service_id'), "count", options.get('census.game'), collection + this.resolveQueryString()];
    return new Promise(function (resolve, reject) {
        Request({
            url: segments.join('/'),
            json: true
        }, function (error, message, response) {
            if(error) return reject(error);
            resolve(response);
        });
    })
};

module.exports = CensusQuery;