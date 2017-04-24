var express = require('express');
var router = express.Router();

var Category = require('../models/Category.js');
var User = require('../models/User.js');
var Post = require('../models/Post.js');
var util = require('../util/util');
var data;



/*
* 处理通用的数据
* */
router.use(function (req, res, next) {
    data = {
        userInfo: req.userInfo,
        userAll:[],
        categories: []
    }
    var categoryModel = new Category();
    categoryModel.getAllByCondition().then(categories=> {
        data.categories = categories;
        var userModel = new User();
        userModel.getAllByCondition().then(users=>{
            data.userAll = users;
            next();
        });
    });
});

/*
* 首页
* */
router.get('/', function(req, res, next) {



    data.category = req.query.category || '';
    data.count = 0;
    data.page = Number(req.query.page || 1);
    data.limit = 10;
    data.pages = 0;
    data.contents = {};

    var where = data.category ? {c_id:data.category} : {};
    var postModel = new Post();
    postModel.getCountByCondition(where).then(count=>{
        data.count = count[0].count;
        data.pages = Math.ceil(data.count / data.limit);
        data.page = Math.min( data.page, data.pages );
        data.page = Math.max( data.page, 1 );
        postModel.getAllByCondition(where,'','','',(data.page-1)*data.limit +',' + data.limit).then(rs=>{
            data.contents = rs;
            res.render('main/index', data);
        });
    });
});

router.get('/view', function (req, res){

    var contentId = req.query.contentid || '';
    var postModel = new Post();
    postModel.getOneById(contentId).then(da=>{
        if(!da[0]){
            data.content = '你是在搞事情嘛？';
        }else{
            data.content = da[0];
            data.content.views = data.content.views + 1;
            postModel.update({id:contentId},{views:data.content.views});
        }
        res.render('main/view', data);
    });

});

module.exports = router;
