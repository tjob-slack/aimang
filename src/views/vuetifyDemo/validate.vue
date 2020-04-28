// <!--js控制不了时就写在行内控制-->
<template>
    

<el-form-item class="el-select-class" label="教师姓名" 
    :rules="[{ required: true, message: '教师姓名不能为空'}]" >
    <el-select v-model="newClassForm.UserId" placeholder="请选择教师姓名">
        <el-option v-for="item in selectTeachers" 
            :key="item.UserId" 
            :label="item.RealName" 
            :value="item.UserId"
        >
        </el-option>
    </el-select>
</el-form-item>
</template>
//教师验证
newClassFormRules: {
	UserId: [{
		required: true,
		message: '请输入教师姓名',
		trigger: 'change'
	}]
}
//更新：发现之前是错误的，没研究透彻：
//    type:Number/String/Array/Function/Booleans 
//    ,trigger:'blur,change';  
popForm: {
	Citys： ''
},
popFormRules: {
	Name: [{
		required: true,
		message: '请输入机构名称',
		trigger: 'blur,change'
	}, {
		min: 1,
		max: 15,
		message: '长度在 1到15个字',
		trigger: 'blur'
	}],
	Citys: [{
		type: 'array,string',
		required: true,
		message: '请选择地区',
		trigger: 'change'
	}],
	PhoneNumber: [{
		required: true,
		validator: updatePhone,
		trigger: "blur"
	}]
};
var updatePhone = (rule, value, callback) => {
	let editForm = this.editForm;
	if(!value) {
		return callback(new Error("手机号不能为空"));
	};
	setTimeout(() => { 
		watch~if(!Number(value)) {
			callback(new Error("请输入数字值"));
		} else {
			if(value.length !== 11) {
				callback(new Error("手机号是11位"));
			} else {
				this.$http.get("/rc_teahcer/checkxxxx",{
					params:{
						PhoneNumber: value,
						Id: editForm.Id
					}
				}).then(res => {
					if(
						res.data == true) {callback();
					} else {
						callback(new Error("该用户已存在!"));
					}
				});
		}}}, 1000);};
			
//如果还一直验证不通过,需要数据类型转换:数字转字符串