/* 
 * closableTab：可关闭的Tabbar，基于bootstrap的tab控件，tab.js或bootstrap.min.js
 * 初始借鉴网上的例子，实际使用发现某些bug，后重写更改。
 */
var closableTab = {
	activedTabId: -1,
	tabItems: [],

	// 添加Tab页
	addTab:function(tabItem){	//tabItem: {id, name, url, closable}	
		closableTab.activedTabId = tabItem.id;	//addTab当前页为激活页
		var isNewTab = true;
		$.each(closableTab.tabItems, function(index, item){
			if (tabItem.id == item.id){
				// Tab已存在
				item.name = tabItem.name;
				item.url = tabItem.url;
				item.closable = tabItem.closable;
				isNewTab = false;
				return false;	//跳出循环
			}
		});

		var tabId = 'tab_seed_' + tabItem.id;
		var containerId = 'tab_container_' + tabItem.id;
		var $container = $('#'+containerId);
		$("li[id^=tab_seed_]").removeClass("active");
		$("div[id^=tab_container_]").removeClass("active");
				
		if (isNewTab) {
			closableTab.tabItems.push(tabItem);
			var on_click = '(function(){closableTab.activedTabId='+tabItem.id+';})()';
			var li_tab = '<li role="presentation" class="" id="'+tabId+'">'
			li_tab = li_tab + '<a href="#'+containerId+'" aria-controls="'+containerId+'" role="tab" data-toggle="tab" onclick="'+on_click+'">'
			li_tab = li_tab + tabItem.name;
			if(tabItem.closable){
				li_tab = li_tab + '&nbsp;<i class="glyphicon glyphicon-remove small" tabclose="'+tabId+'" onclick="closableTab.closeTab(this)"></i></a></li>';
			} else {
				li_tab = li_tab + '</a></li>';
			}
	 		var tabpanel = '<div role="tabpanel" class="tab-pane" id="'+containerId+'"></div>';
			$('ul.padbar-tabbar').append(li_tab);
			$('div.tab-content').append(tabpanel);
			// 异步加载网页
			$.ajax({
				type:'GET',
				url:tabItem.url,
				dataType:'text',
				data:{},
				async:true,
				success:function(result) {
					$('#'+containerId).html(result);
				},
				error:function(XMLHttpRequest, textStatus, errorThrown) {
					var html = '<p>错误代码：'+ XMLHttpRequest.status+'</p>';
					html = html + '<p>错误信息：'+XMLHttpRequest.statusText+'</p>';
					$container.html(html);
				}
			});
		} else {
			// 更新Tab name
			var $tab = $('#'+tabId);
			var on_click = '(function(){closableTab.activedTabId='+tabItem.id+';})()';
			var content = '<a href="#'+containerId+'" aria-controls="'+containerId+'" role="tab" data-toggle="tab" onclick="'+on_click+'">'
			content = content+tabItem.name;
			if(tabItem.closable){
				content = content + '&nbsp;<i class="glyphicon glyphicon-remove small" tabclose="'+tabId+'" onclick="closableTab.closeTab(this)"></i></a></li> ';
			} else {
				content = content + '</a></li>';
			}
			$tab.html(content);	
			closableTab.refreshTab();
		}
		
		$("#"+tabId).addClass("active");
		$("#"+containerId).addClass("active");
		console.log('addtab:')
		console.log(closableTab.activedTabId);
		console.log(closableTab.tabItems);
	},
	
	// 关闭Tab
	closeTab:function(item){
		var tabId = $(item).attr('tabclose');
		var Id = parseInt(tabId.substring(9));
		var containerId = "tab_container_"+Id;
    	var $tab = $('#'+tabId);
    	var $container = $('#'+containerId);
 
		// 先在数组中移除对应的TabItem
		var arrIndex = -1;
		$.each(closableTab.tabItems, function(index, item){
			if(item.id==Id) {
				arrIndex = index;
				return false;
			}
		});
		closableTab.tabItems.splice(arrIndex, 1);
		
		var lastItem = closableTab.tabItems.slice(-1)[0];
		if (closableTab.activedTabId != lastItem.id) {
			// 移除当前激活页的active class
			var $activeTab = $('#tab_seed_'+closableTab.activedTabId);
			var $activeContainer = $('#tab_container_'+closableTab.activedTabId);
			$activeTab.removeClass('active');
			$activeContainer.removeClass('active');	
			
			// 如果当前激活页不是数组中的最后一项，则将其设置为激活页
			var $lastTab = $('#tab_seed_'+lastItem.id);
			var $lastContainer = $('#tab_container_'+lastItem.id);
			$lastTab.addClass('active');
			$lastContainer.addClass('active');	
			closableTab.activedTabId = lastItem.id;
		}
		$tab.remove();
		$container.remove();
		console.log('closeTab:')
		console.log(closableTab.activedTabId);
		console.log(closableTab.tabItems);
	},
	
	// 刷新当前页面
	// 在某些Tab页会提交表单，如果在服务端重定向，则退出框架页面了。
	// 为避免此情况，服务端应当在处理客户端表单提交后返回json或xml等类型的数据，
	// 客户端可以使用ajax提交表单，解析服务端返回消息。
	// 某些表单的提交可能会导致当前页面的内容发生变化，为及时刷新数据，提供refreshTab方法，将数据及时刷新呈现出来。
	// 客户端可以在调用refreshTab时提供callback回调，用于显示服务端返回的消息，如提示用户表单处理成功或失败。
	// 如不提供callback函数，则默认callback是一个空函数。
	refreshTab:function(callback){
		var containerId = "tab_container_"+closableTab.activedTabId;
		var $container = $('#'+containerId);
		$.each(closableTab.tabItems, function(index, tabItem){
			if(tabItem.id==closableTab.activedTabId) {
				//$container.html('正在加载...');
				// ajax异步刷新当前页面
				$.ajax({
					type:'GET',
					url:tabItem.url,
					dataType:'text',
					data:{},
					async:true,
					success:function(result) {
						$container.html(result);
						if(!callback) {
							callback = (function(){});
						}
						callback();
					},
					error:function(XMLHttpRequest, textStatus, errorThrown) {
						var html = '<p>错误代码：'+XMLHttpRequest.status+'</p>';
						html = html + '<p>'+'错误信息：'+XMLHttpRequest.statusText+'</p>';
						$container.html(html);
					}
				});	
			}
		});
	}
};

// 在这里列出所有可以上Tabbar的页面，根据Web需要修改此变量。
var pages = {
	'home':  {'id':0, 'name': '首页',  'closable':false},
	'team':  {'id':1, 'name': '成员',  'closable':true},
	'page1': {'id':2, 'name': '页面1', 'closable':true},
	'page2': {'id':3, 'name': '页面2', 'closable':true},
	'page3': {'id':4, 'name': '页面3', 'closable':true},
	'page4': {'id':5, 'name': '页面4', 'closable':true},
	'member':{'id':6, 'name': '成员信息', 'closable':true}
}

// <a href="javascrit:void(0);" page="home" url="/home" onclick="tb_href(this)">首页</a>
function tb_href(item) {
	var page_name = $(item).attr('page');
	var page = null;
	for (var key in pages) {
		if (key==page_name) {	
			page = pages[key]
			break;
		}
	}
	if (!page) {
		return false;
	}

	var url = $(item).attr('url');
	var item = {'id':page.id,'name':page.name,'url':url,'closable':page.closable};
	console.log(item);
	closableTab.addTab(item);
	return false;
};
	
$(document).ready(function(){

	// 增加首页Tab
	var item = {'id':pages.home.id,'name':pages.home.name,'url':'/home','closable':pages.home.closable};
	closableTab.addTab(item);
		
	// sidebar 选中菜单项紫色边框效果
	$('ul.sidebar-nav>li a').click(function(){
		$(this).parents('li').siblings(".active").removeClass('active');
		$(this).parents('li').addClass('active');
	});
	
	// sidebar 菜单栏collpase效果，基于jquery slideUp/slideToggle方法
	$('ul.sidebar-nav a.ind').click(function(){
		$(this).parent().siblings().children('ul').slideUp();
		$(this).parent().siblings().children('a').removeClass('down');

		var id = $(this).attr('href').substring(1);
		if ($('#'+id).is(":visible")) {
			$(this).removeClass('down');
		} else {
			$(this).addClass('down');
		}
		$('#'+id).slideToggle();
		return false;
	});	
});
