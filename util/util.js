
module.exports = {
	// 继承
    extend: function(target, source, flag) {
        for(var key in source) {
            if(source.hasOwnProperty(key))
                flag ?
                    (target[key] = source[key]) :
                    (target[key] === void 0 && (target[key] = source[key]));
        }
        return target;
    },

    //打印
    p:function(data){
    	console.log(data);
    },

    //驼峰法转下划线
    changeHumpToUnderline:function(str){
  		str = str.replace(/([A-Z])/g,"_$1").toLowerCase();
    	return str.replace(/(^_*)|(_*$)/g, "");
    },

    //判断对象是不是空
	isEmptyObject:function(e) {
		var t;
		for (t in e)
			return !1;
		return !0
	},

	//判断数组是否为空
	isEmptyArray:function(arr) {
		return (this.isArray(arr) && arr.length) > 0 ? false : true;
	},

	//判断是否为空字符串
	isEmptyString: function(str){
		if(this.isString(str)){
			return str.replace(/(^s*)|(s*$)/g, '').length == 0 ? true : false;
		}else {
			return true;
		}
	},

	//判断是否为数组
	isArray: function(object){
    	return (typeof object ==='object') && Array == object.constructor;
	},

	//判断是否为字符串
	isString: function(str){ 
		return (typeof str == 'string') && String == str.constructor; 
	},

	//判断是否为数字
	isNumber: function(obj){
		return (typeof obj == 'number') && Number == obj.constructor; 
	},

	//判断是否为函数
	isFunction: function(obj){ 
		return (typeof obj == 'function') && Function == obj.constructor; 
	},

	//判断是否为对象
	isObject: function(obj){ 
		return (typeof obj == 'object') && Object == obj.constructor; 
	},

	//判断是否为时间
	isDate: function(obj){ 
		return (typeof obj == 'object') && Date == obj.constructor; 
	},

	//TODO:
	addQuotes: function(str){
		if(this.isString(str)){
			str = '';
		}
		return str;
	},

	//获取当前的时间戳
	getNowTimeStamp:function(isdel = 'y' ,times = ''){
		if('y' == isdel){
			return Math.ceil(new Date() / 1000);
		}else {
			return new Date() * 1;
		}
	}




}

