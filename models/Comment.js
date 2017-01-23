var mysql = require('../helper/mysqlHelper');
var util = require('../util/util');
var BaseModel = require('./BaseModel');


class Comment extends BaseModel{

    constructor(tableName) {
    	super(tableName || Comment.name);
    }
}

module.exports = Comment;
