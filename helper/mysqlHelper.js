'use strict';
var mysql = require('mysql');
var mysqlConfig = require('../config/db').mysql;
var util = require('../util/util');

var pool  = mysql.createPool(util.extend({}, mysqlConfig));



function query(sql,seat=[],cb) {
    var promise = new Promise((resolve,reject)=>{
        pool.getConnection(function (err, connection) {
            if (err) {
                console.log("无法获取数据库资源==="+err);
            }else {
                connection.query(sql,seat,function (err, rows,fields) {
                    if(err){
                        console.log(err);
                    }else{
                        resolve(handleRows(rows));
                    }
                    connection.release();//释放链接
                });
            }
        });
    });
    if(util.isFunction(cb)){
        promise.then(cb);
    }else{
        return promise;
    }
}


function handleRows(rows){
    var arr = {};
    if(rows){
        if(rows.length < 2){
            // rows = rows[0];
        }
    }
    return rows;
}

exports.query = query;
