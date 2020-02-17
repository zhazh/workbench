/* 
 * closableTab：可关闭的Tabbar，基于bootstrap的tab控件，tab.js或bootstrap.min.js
 * 
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
	
$(document).ready(function(){
	// 增加首页Tab
	var item = {'id':0,'name':'首页','url':'/home','closable':false};
	closableTab.addTab(item);
	
	// sidebar 选中菜单项紫色边框效果
	/*
	$('ul.sidebar-nav>li>a').click(function(){
		$(this).parent().siblings(".active").removeClass('active');
		$(this).parent().addClass('active');
	});
	*/
	
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