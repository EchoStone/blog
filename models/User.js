var mysql = require('../helper/mysqlHelper');
var util = require('../util/util');
var BaseModel = require('./BaseModel');


class User extends BaseModel{

    constructor(tableName) {
    	super(tableName || User.name);
    }
}

module.exports = User;
