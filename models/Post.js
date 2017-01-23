var mysql = require('../helper/mysqlHelper');
var util = require('../util/util');
var BaseModel = require('./BaseModel');


class Post extends BaseModel{

    constructor(tableName) {
    	super(tableName || Post.name);
    }
}

module.exports = Post;
