import request from '@/utils/request'
/**
 * 新增编辑弹窗
 */

export function addEditLayer(title, area, url, isFull, func) {
	var that = this;
	var index = layui.layer.open({
		title: title,
		type: 2,
		area: area,  
		content: url,
		success: function(layero, index) {},
		end: function() {  
			func();
		}
	})
	if (isFull) {
		layui.layer.full(index);
	}
}

/**
		 * 删除元素-删除单个元素-批量删除元素
		 */
export function deleteDataHandle(that,obj) {
	that.$confirm('此操作将永久删除相关数据！是否继续?', '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning',
		center: true
	}).then((e) => {
		console.log('cpmmon.deleteDataHandle.then:',e)
		that.deleteData(obj);
	}).catch((e) => {
		console.log('cpmmon.deleteDataHandle.e:',e)
		that.$message({ 
			type: 'info',
			message: '已取消删除'
		});
	});
}