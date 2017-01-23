var util = require('../util/util');
var mysqlElse = require('../config/db').mysqlElse;
var mysql = require('../helper/mysqlHelper');
class BaseModel{

    //构造函数
	constructor(tableName) {
		this.tableName = mysqlElse.prefix + util.changeHumpToUnderline(tableName);
    }

    //根据id获取一条数据
    getOneById(id,cb = '',field = '*',order = ''){
    	var sqlInfo = this.getOriginalSql({id:id},field,order,'1');
    	return mysql.query(sqlInfo.sql,sqlInfo.seat,cb);
    }

    //根据条件获取一条数据
    getOneByCondition(map={},cb = '',field = '*',order = ''){
    	var sqlInfo = this.getOriginalSql(map,field,order,'1');
    	return mysql.query(sqlInfo.sql,sqlInfo.seat,cb);
    }

    //根据条件和获取数据
    getAllByCondition(map={},cb = '',field = '', order = '', limit = '',group = ''){
        var sqlInfo = this.getOriginalSql(map,field,order,limit,group);
        return mysql.query(sqlInfo.sql,sqlInfo.seat,cb);
    }

    //得到数量
    getCountByCondition(map={},cb = ''){
        var sqlInfo = this.getOriginalSql(map,"count(*) as count",'','1');
        return mysql.query(sqlInfo.sql,sqlInfo.seat,cb);
    }

    //插入数据 insertId: 1 返回的插入id
    insert(data, cb = ''){
        var sqlInfo = this.getInsertSql(data);
        return mysql.query(sqlInfo.sql,sqlInfo.seat,cb);
    }

    //更新数据   affectedRows: 1 影响的条数
    update(map,data,cb = ''){
        var sqlInfo = this.getUpdateSql(data,map);
        return mysql.query(sqlInfo.sql,sqlInfo.seat,cb);
    }

    // 删除数据  affectedRows: 1 影响的条数
    delete(map,cb = ''){
        var sqlInfo = this.getDeleteSql(map);
        return mysql.query(sqlInfo.sql,sqlInfo.seat,cb);
    }

    //得到删除的sql
    getDeleteSql(map){
        if (util.isEmptyString(this.tableName)) {
            console.log('ERROR:NO TABLENAME');
            return false;
        }
        var sql = 'DELETE FROM ' + this.tableName;
        var seat = [];
        var whereObjectValue = this.getWhereObjectValue(sql,seat,map);
        return {
            sql:whereObjectValue.sql,
            seat:whereObjectValue.seat
        };
    }

    //得到更新的sql
    getUpdateSql(data,map){
        if (util.isEmptyString(this.tableName)) {
            console.log('ERROR:NO TABLENAME');
            return false;
        }
        var sql = 'UPDATE ' + this.tableName + ' SET ';
        if(!util.isObject(data) || util.isEmptyObject(data)){
            console.log('ERROR:NO UPDATE VALUES');
            return false;
        }
        var seat = [];
        var setInfo = [];
        for(var dk in data){
            setInfo.push('`' + dk + '` = ?');
            seat.push(data[dk]);
        }
        sql += setInfo.join(' , '); // 拼接set值
        var whereObjectValue = this.getWhereObjectValue(sql,seat,map);
        return {
            sql:whereObjectValue.sql,
            seat:whereObjectValue.seat
        };
    }

    //得到插入的sql,暂时不支持批量插入
    getInsertSql(data){
        if (util.isEmptyString(this.tableName)) {
            console.log('ERROR:NO TABLENAME');
            return false;
        }
        var sql = 'INSERT INTO ' + this.tableName;
        var keyInfo = {};
        if(util.isObject(data)){
            keyInfo = data;
        }else if(util.isArray(data)){
            keyInfo = util.isEmptyArray(data[0]) ? {} : data[0];
        }
        if(util.isEmptyObject(keyInfo)){
            console.log('ERROR');
            return false;
        }
        var keyValue = [];
        var seatValue = [];
        var seat = [];
        for(var key in keyInfo){
            keyValue.push(key);
            seatValue.push('?');
            seat.push(keyInfo[key])
        }
        sql = sql + ' (' + keyValue.join(',') + ') VALUES (' +  seatValue.join(',') + ')';

        return {
            sql:sql,
            seat:seat
        };
    }
    // 得到sql信息
    getOriginalSql(map = {} , field = '', order ='', limit = '', group = ''){
    	if (util.isEmptyString(this.tableName)) {
            console.log('ERROR:NO TABLENAME');
            return false;
        }
        var where = '1=1 ';
        var seat = [];
        if(!util.isEmptyObject(map)){
        	for (var key in map) { 
        		where += ' AND ' + '`' + key + '`' + ' ';
        		if(util.isArray(map[key])){
        			where += map[key][0] + ' (' + map[key][1] +')';
        		}else {
                    // console.log(String(map[key]));
                    seat.push(map[key]);
        			where += ' = ?' ;//+ (util.isString(map[key]) ? String(map[key]) : map[key]);
        		}
			}
        }

        if(!util.isEmptyString(order)){
        	order = ' ORDER BY ' + order;
        }

        if(!util.isEmptyString(limit)){
        	limit = ' LIMIT ' + limit;
        }

        if(!util.isEmptyString(group)){
        	group = ' GROUP BY ' + group;
        }

        if(util.isEmptyString(field)){
        	field = '*';
        }

        var sql = 'SELECT ' + field + ' FROM ' + this.tableName + ' WHERE ' + where + group  + order + limit;
        var SqlInfo = {
            sql:sql,
            seat:seat
        };

        return SqlInfo;
    }

    getWhereObjectValue(sql,seat,map){
        if(!util.isEmptyObject(map)){
            var where = [];
            for(var mk in map){
                where.push('`' + mk + '` = ?'); 
                seat.push(map[mk]);
            }
            if(!util.isEmptyArray(where)){
                sql += ' WHERE  ' + where.join(' AND '); // 拼接where条件
            }
        }
        return {
            sql:sql,
            seat:seat
        }
    }



}

module.exports = BaseModel;
