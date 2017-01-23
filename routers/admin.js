

var Category = require('../models/Category.js');
var User = require('../models/User.js');
var Post = require('../models/Post.js');
var util = require('../util/util');

var express = require('express');
var router = express.Router();

router.use(function(req, res, next) {
    if (!req.userInfo.is_admin) {
        //如果当前用户是非管理员
        res.send('咦，只有管理员才可以进入后台管理');
        return;
    }
    next();
});

/**
 * 首页
 */
router.get('/', function(req, res, next) {
    res.render('admin/index', {
        userInfo: req.userInfo
    });
});

/*
* 用户管理
* */
router.get('/user', function(req, res) {

    var page = Number(req.query.page || 1);
    var limit = 20;
    var totalPages = 0;


    var UserModel =new User();
    
    UserModel.getCountByCondition().then(count=>{
        var countNum = count[0].count;
        if(countNum > 0 ){
            totalPages = Math.ceil(countNum / limit);
            page = Math.min( page, totalPages );
            page = Math.max( page, 1 );
        }
        return {
            page:page,
            totalPages:totalPages,
            count:countNum
        }
    }).then(pageInfo=>{
        UserModel.getAllByCondition({},'','','',(pageInfo.page - 1) * limit + ',' +  limit).then(data=>{
            res.render('admin/user_index', {
                userInfo: req.userInfo,
                users: data,
                count: pageInfo.count,
                pages: pageInfo.totalPages,
                limit: limit,
                page: pageInfo.page
            });
        })
    });
});

/*
* 分类首页
* */
router.get('/category', function(req, res) {

    var page = Number(req.query.page || 1);
    var limit = 20;
    var totalPages = 0;

    var categoryModel =new Category();
    
    categoryModel.getCountByCondition().then(count=>{
        var countNum = count[0].count;
        if(countNum > 0 ){
            totalPages = Math.ceil(countNum / limit);
            page = Math.min( page, totalPages );
            page = Math.max( page, 1 );
        }
        return {
            page:page,
            totalPages:totalPages,
            count:countNum
        }
    }).then(pageInfo=>{
        categoryModel.getAllByCondition({},'','','',(pageInfo.page - 1) * limit + ',' +  limit).then(data=>{
            res.render('admin/category_index', {
                userInfo: req.userInfo,
                categories: data,
                count: pageInfo.count,
                pages: pageInfo.totalPages,
                limit: limit,
                page: pageInfo.page
            });
        })
    });

});

/*
* 分类的添加
* */
router.get('/category/add', function(req, res) {
    res.render('admin/category_add', {
        userInfo: req.userInfo
    });
});

/*
* 分类的保存
* */
router.post('/category/add', function(req, res) {

    var name = req.body.name || '';

    if (name == '') {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '名称不能为空'
        });
        return;
    }

    //数据库中是否已经存在同名分类名称

    var categoryModel =new Category();
    categoryModel.getCountByCondition({name:name}).then(data=>{
        var count = data[0].count;
            if(count > 0){
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: '分类已经存在了'
            });
        }else{
            categoryModel.insert({name:name}).then(data=>{
                res.render('admin/success', {
                    userInfo: req.userInfo,
                    message: 'ID号为:【' + data.insertId + '】的分类保存成功',
                    url: '/admin/category'
                });
            });
        }
    });

});

/*
* 分类修改
* */
router.get('/category/edit', function(req, res) {

    //获取要修改的分类的信息，并且用表单的形式展现出来
    var id = req.query.id || 0;

    //获取要修改的分类信息
    var categoryModel =new Category();
    categoryModel.getOneById(id).then(data=>{
        if(!data[0]){
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: '分类信息不存在!'
            });
        }else {
            res.render('admin/category_edit', {
                userInfo: req.userInfo,
                category: data[0]
            });
        }
    });

});

/*
* 分类的修改保存
* */
router.post('/category/edit', function(req, res) {

    //获取要修改的分类的信息，并且用表单的形式展现出来
    var id = req.query.id || '';
    //获取post提交过来的名称
    var name = req.body.name || '';

    //获取要修改的分类信息
    var categoryModel =new Category();
    categoryModel.getOneById(id).then(data=>{
        if(!data[0]){
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: '分类信息不存在!'
            });
        }else {
            var category = data[0];
            if (name == category.name) {
                res.render('admin/success', {
                    userInfo: req.userInfo,
                    message: '修改成功',
                    url: '/admin/category'
                });
            } else {
                categoryModel.getCountByCondition({name:name}).then(data=>{
                    var count = data[0].count;
                    if(count > 0){
                        res.render('admin/error', {
                            userInfo: req.userInfo,
                            message: '分类已经存在了'
                        });
                    }else{
                        categoryModel.update({id:id},{name:name}).then(data=>{
                            res.render('admin/success', {
                                userInfo: req.userInfo,
                                message: '修改成功',
                                url: '/admin/category'
                            });
                        });
                    }
                });
            }

        }
    });

});

/*
* 分类删除
* */
router.get('/category/delete', function(req, res) {

    //获取要删除的分类的id
    var id = req.query.id || '';
    var categoryModel =new Category();

    var isdel = req.query.isdel || '';
    if('y' == isdel){
        categoryModel.delete({id:id}).then(data=>{
            res.render('admin/success', {
                userInfo: req.userInfo,
                message: '删除成功',
                url: '/admin/category'
            });
        });
    }else {
        res.render('admin/success', {
                userInfo: req.userInfo,
                message: '删除成功--假的',
                url: '/admin/category'
        });
    }
});

/*
* 内容首页
* */
router.get('/content', function(req, res) {

    var page = Number(req.query.page || 1);
    var limit = 20;
    var totalPages = 0;

    var postModel =new Post();
    
    postModel.getCountByCondition().then(count=>{
        var countNum = count[0].count;
        if(countNum > 0 ){
            totalPages = Math.ceil(countNum / limit);
            page = Math.min( page, totalPages );
            page = Math.max( page, 1 );
        }
        return {
            page:page,
            totalPages:totalPages,
            count:countNum
        }
    }).then(pageInfo=>{
        postModel.getAllByCondition({},'','','',(pageInfo.page - 1) * limit + ',' +  limit).then(data=>{
            res.render('admin/content_index', {
                userInfo: req.userInfo,
                contents: data,
                count: pageInfo.count,
                pages: pageInfo.totalPages,
                limit: limit,
                page: pageInfo.page
            });
        })
    });
});

/*
 * 内容添加页面
 * */
router.get('/content/add', function(req, res) {
    var categoryModel =new Category();
    categoryModel.getAllByCondition().then(data=>{
        res.render('admin/content_add', {
            userInfo: req.userInfo,
            categories: data
        })
    });
});

/*
* 内容保存
* */
router.post('/content/add', function(req, res) {


    if ( req.body.category == '' ) {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '内容分类不能为空'
        })
        return;
    }

    if ( req.body.title == '' ) {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '内容标题不能为空'
        })
        return;
    }
    //保存数据到数据库
    (new Post()).insert({
        c_id: req.body.category,
        title: req.body.title,
        user_id: req.userInfo.id.toString(),
        description: req.body.description,
        content: req.body.content,
        created_at:util.getNowTimeStamp('n'),
        updated_at:util.getNowTimeStamp('n')
    }).then(rs=>{
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '内容保存成功',
            url: '/admin/content'
        })
    });

});

/*
* 修改内容
* */
router.get('/content/edit', function(req, res) {
    var id = req.query.id || '';

    var categories = [];


    var categoryModel =new Category();
    categoryModel.getAllByCondition().then(data=>{
        return data;
    }).then(data=>{
        (new Post()).getOneById(id).then(rs=>{
            if(!rs[0]){
                res.render('admin/error', {
                    userInfo: req.userInfo,
                    message: '指定内容不存在'
                });
            }else{
                res.render('admin/content_edit', {
                    userInfo: req.userInfo,
                    categories: data,
                    content: rs[0]
                });
            }
        });
    });
});

/*
 * 保存修改内容
 * */
router.post('/content/edit', function(req, res) {
    var id = req.query.id || '';

    if ( req.body.category == '' ) {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '内容分类不能为空'
        })
        return;
    }

    if ( req.body.title == '' ) {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '内容标题不能为空'
        })
        return;
    }

    (new Post()).update({id:id},{
        c_id: req.body.category,
        title: req.body.title,
        user_id: req.userInfo.id.toString(),
        description: req.body.description,
        content: req.body.content,
        updated_at:util.getNowTimeStamp('n')
    }).then(rs=>{
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '内容保存成功',
            url: '/admin/content/edit?id=' + id
        });
    });
});

/*
* 内容删除
* */
router.get('/content/delete', function(req, res) {
    var id = req.query.id || '';
     var isdel = req.query.isdel || '';
    if('y' == isdel){
        (new Post()).delete({id:id},da=>{
            res.render('admin/success', {
                userInfo: req.userInfo,
                message: '删除成功',
                url: '/admin/content'
            });
        });
    }else {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '删除成功--假的',
            url: '/admin/content'
        });
    }
});

module.exports = router;