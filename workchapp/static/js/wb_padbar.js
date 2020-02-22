/*
 * closableTab：动态生成的可关闭Tab页的Tabbar控件。
 *			基于bootstrap的tab控件，前置引入：bootstrap.min.js
 */
var closableTab = {
	activedTabId: -1,
	tabItems: [],

	/* 
	 * Tabbar中增加Tab页
	 * 如果是新增加Tab页面则加载页面，并在Tabbar中增加Tab页
	 * 如果是已存在的Tab页面，则刷新该页面，并将此页面设置为active
	 * Args:
	 * 		tabItem是一个dic数据，格式为:
	 *				{id, name, url, closable, data}
	 *				 id:		数值，每个Tab页的唯一标识。
	 *				 name:		字符串，Tabbar上显示的Tab页名称。
	 *				 url:		字符串，Tab页的地址。
	 *				 closable:	布尔值，该Tab页是否可关闭，可关闭为true，反之false。
	 *				 data:		字符串或key/value类型，发送给服务器的字符串或键值队。
	 */
	addTab:function(tabItem) {
		closableTab.activedTabId = tabItem.id;	//addTab当前页为激活页
		var isNewTab = true;
		$.each(closableTab.tabItems, function(index, item){
			if (tabItem.id == item.id){
				// Tab已存在，则更新该Tab的name、url、closable、data信息。
				item.name = tabItem.name;
				item.url = tabItem.url;
				item.closable = tabItem.closable;
				item.data = tabItem.data;
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
			// 新增加页面，在Tabbar中的增加Tab页显示，并获取页面。
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
			$('div.padbar-tabbar-content').append(tabpanel);
			// 加载网页
			$.get(tabItem.url, tabItem.data, function(data){
				$('#'+containerId).html(data);
			});
		} else {
			// 更新Tabbar中的Tab页name、closable等属性显示，并刷新当前页面。
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
	},
	
	/* 
	 * 关闭Tab页面
	 * 响应关闭按钮的点击事件，用户无需手工调用。
	 * Args:
	 *		item:	关闭按钮的this对象
	 */
	closeTab:function(item) {
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
	},
	
	/*
	 * 刷新当前active页面。
	 * Args:
	 *		callback:	回调函数，页面刷新成功后调用此函数，默认为空函数。
	 * 备注：
	 * 		在框架中提交表单是一件麻烦事，所有的页面是动态载入的，服务端处理表单数据后，返回html则会跳出框架。
	 *		为避免此情况，在框架中，服务端应当以json或xml返回表单处理结果，有的表单会更新当前页面数据，此时可
	 *		以手工调用refreshTab刷新页面将服务器端已处理的信息实时显示出来，并提供callback回调显示服务器处理结
	 *		果。
	 */
	refreshTab:function(callback){
		var containerId = "tab_container_"+closableTab.activedTabId;
		var $container = $('#'+containerId);
		$.each(closableTab.tabItems, function(index, tabItem){
			if(tabItem.id==closableTab.activedTabId) {
				//$container.html('正在加载...');
				// 加载网页
				$.get(tabItem.url, tabItem.data, function(data){
					$container.html(data);
					if(!callback) {
						callback = (function(){});
					}
					callback();
				});
			}
		});
	}
};
