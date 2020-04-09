Vue.mixin({
	data: function() {
		return {
			tableHeight: 400,
			currentPageIndex: 1,
			currentPageSize: 20,
			pageSizeArr: [10,20,30,50],
			count: 0
		}
	},
	beforeMount() {
		this.initPageSize();
	},
	mounted() {
		window.onresize = () => { 
			return (() => {
				location.reload();
			})()
		};
	},
	methods: {  
		initPageSize() {
			var appH = document.getElementById("app").clientHeight; // app高度
			
			var pageTitleH = 0;
			if (document.getElementById("pageTitle")) {
				pageTitleH = document.getElementById("pageTitle").clientHeight;
			}
			
			var operatorFormH = 0;
			if (document.getElementById("operatorForm")) {
				operatorFormH = document.getElementById("operatorForm").clientHeight;
			}
			
			var operatorContainerH = 0;
			if (document.getElementById("operatorContainer")) {
				operatorContainerH = document.getElementById("operatorContainer").clientHeight;
			}
			var tablePaginationH = 0;  
			if (document.getElementById("tablePagination")) { 
				tablePaginationH = document.getElementById("tablePagination").clientHeight; // 数据表格操作列
			}
			this.tableHeight = appH - pageTitleH - operatorFormH - operatorContainerH - tablePaginationH - 10;
		},   
		/**
		 * 分页，监听分页的pageSize
		 */
		handleSizeChange(val) {  
			this.currentPageSize = val;
			this.searchData();
		},
		/**
		 * 分页，监听分页的currentPage
		 */
		handleCurrentChange(val) {
			this.currentPageIndex = val;
			this.searchData();
		},
		/**  
		 *  修改上下架
		 */
		changeSwitch(data) {
			this.changeSwitchHandle(data);
		},
		/**
		 * 删除元素-删除单个元素-批量删除元素
		 */
		deleteDataHandle(ids) {
			let that = this;
			this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
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
		},
		/**
		 * 批量删除
		 */  
		batchDeleteDataHandle() {
			var that = this;
			var selectedIds = that.$refs.multipleTable.selection.map(function (ele) {
				return ele.id;
			});
			if (selectedIds.length == 0) {
				that.$message.error('请选择需要删除的数据!');
				return; 
			}
			this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',    
				center: true
			}).then(function (value) {
				that.deleteData(selectedIds.join(','));
			}).catch(function (reason) {
				debugger;
				this.$message({
					type: 'info',
					message: '已取消删除'
				})
			});
		},
		/**
		 * 获取路由参数
		 */
		getQueryString(name) {
			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
			var r = window.location.search.substr(1).match(reg);
			if (r != null) {
				return decodeURIComponent(r[2]);
			}
			return '';
		},
		/**
		 * 新增编辑弹窗
		 */
		addEditLayer(title, area, url, isFull, func) {
			var that = this;
			var index = layui.layer.open({
				title: title,
				type: 2,
				area: area,  
				content: url,
				success: function(layero, index) {},
				end: function() {
					debugger;
					func();
				}
			});
			debugger;
			if (isFull) {
				layui.layer.full(index);
			}
		},
		/**
		 * delete请求
		 */
		requestDelete(url, data, func) {
			let that = this;
			this.loadingShow();
			$.ajax({
				url: url,
				type: 'DELETE', 
				data: data,
				success: function(data) {
					if (data.success) {
						if (typeof func != "undefined") {
							func(data)
						}						
						that.$message.success("恭喜你，提交成功！");
					} else {
						that.$message.error("Http请求异常！");
					}
					that.closeLoading();
				},
				fail: function(data) {
					that.$message.error("Http请求异常！");
					that.closeLoading();
				}
			});
		},
		/**
		 * pos请求
		 */
		requestPost(url, formData, func) {
			let that = this;
			this.loadingShow();	 
			$.ajax({
				url : url,
				contentType: "application/x-www-form-urlencoded; charset=utf-8",
				type : 'POST',
				data : formData,
				contentType : false,  
				processData : false, 
				success : function(data) {
					if (data.success) { 
						that.$message.success("恭喜你，提交成功！");
						if (typeof func != "undefined") {
							func(data)
						}
					} else {
						that.$message.error("Http请求异常！");
					}
					that.closeLoading();
				},
				fail() {
					that.$message.error("Http请求异常！");
					that.closeLoading();
				}
			});
		},
		/**
		 * GET请求
		 */
		requestGet(url, data, func) {
			let that = this;
			this.loadingShow();			
			$.ajax({
				url: url,
				type: 'GET',
				data: data,
				success: function(data) {
					if (data.success) { 
						if (typeof func != "undefined") {
							func(data)
						}
					} else {
						that.$message.error("Http请求异常！");
					}  
					that.closeLoading();
				},
				fail() {
					that.$message.success("Http请求异常！");
					that.closeLoading();
				}
			});
		},
		// loading
		loadingShow() {
			this.superLoading = this.$loading({
				lock: true,
				text: '数据提交中，请等待！',
				spinner: 'el-icon-loading',
				background: 'rgba(0, 0, 0, 0.3)'
			});
		},
		// 关闭loading
		closeLoading() {
			let that = this;
			setTimeout(function () { 
				that.superLoading.close();
			}, 1000)
		},
		// 关闭弹窗
		layerClose() {
			var index = parent.layer.getFrameIndex(window.name);
			parent.layer.close(index);
		}
	}
})
