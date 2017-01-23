var mysql = require('../helper/mysqlHelper');
var util = require('../util/util');
var BaseModel = require('./BaseModel');


class Category extends BaseModel{

    constructor(tableName) {
    	super(tableName || Category.name);
    }
}

module.exports = Category;
