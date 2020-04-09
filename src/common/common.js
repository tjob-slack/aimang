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
export function deleteDataHandle(ids) {
	let that = this;
	this.$confirm('此操作将永久删除相关数据！是否继续?', '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning',
		center: true
	}).then((e) => {
		that.deleteData(ids);
	}).catch((e) => {
		this.$message({ 
			type: 'info',
			message: '已取消删除'
		});
	});
}