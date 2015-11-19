/**
 * Created by Pepper on 11/3/2015.
 */

var JoinQuery = function (collection) {
    this.collection = collection;
    this.on = "";
    this.to = "";
    this.list = false;
    this.inject_at = "";
    this.outer = true;
    this.visibleFields = [];
    this.hiddenFields = [];
    this.filterTerms = [];
    this.subqueries = [];

    this.resolve = function () {
        var segments = [];
        segments.push("type:"+this.collection);

        if (this.on)
            segments.push("on:" + this.on);
        if (this.to)
            segments.push("to:" + this.to);
        if (this.list)
            segments.push("list:1");
        if (this.inject_at)
            segments.push("inject_at:" + this.inject_at);
        if (!this.outer)
            segments.push("outer:0");
        if (this.visibleFields.length)
            segments.push("show:" + this.visibleFields.join("'"));
        if (this.hiddenFields.length)
            segments.push("hide:" + this.hiddenFields.join("'"));
        if (this.filterTerms.length) {
            var terms = [];
            for(var i = 0; i < this.filterTerms.length; i++){
                terms.push(this.filterTerms[i].field+"="+this.filterTerms[i].value);
            }
            segments.push(terms.join("'"));
        }

        var query = segments.join("^");
        if(this.subqueries.length){
            var queries = [];
            for(i = 0; i < this.subqueries.length; i++){
                queries.push(this.subqueries[i].resolve());
            }
            query = query + "("+queries.join(",")+")";
        }

        return query;
    }
};

JoinQuery.prototype.on = function (field) {
    this.on = field;
    return this;
};

JoinQuery.prototype.to = function (field) {
    this.to = field;
    return this;
};

JoinQuery.prototype.at = function (field) {
    this.inject_at = field;
    return this;
};

JoinQuery.prototype.asList = function () {
    this.list = true;
    return this;
};

JoinQuery.prototype.show = function (field) {
    this.visibleFields = this.visibleFields.concat(field);
    return this;
};

JoinQuery.prototype.hide = function (field) {
    this.hiddenFields = this.hiddenFields.concat(field);
    return this;
};

JoinQuery.prototype.innerJoin = function () {
    this.outer = false;
    return this;
};

JoinQuery.prototype.filter = function (field, value) {
    this.filterTerms.push({field: field, value: value});
    return this;
};

JoinQuery.prototype.subQuery = function (query) {
    this.subqueries.push(query);
    return this;
};

module.exports = JoinQuery;