// 在这里列出所有可以上Tabbar的页面，根据Web需要修改此变量。
var pages = {
	'home':		{'id':0, 'name':'首页',		'closable':false},
	'team':		{'id':1, 'name':'成员',		'closable':true},
	'page1':	{'id':2, 'name':'页面1',	'closable':true},
	'page2':	{'id':3, 'name':'页面2',	'closable':true},
	'page3':	{'id':4, 'name':'页面3',	'closable':true},
	'page4':	{'id':5, 'name':'页面4',	'closable':true},
	'member':	{'id':6, 'name':'成员信息',	'closable':true},
	'search':	{'id':1, 'name':'搜索结果',	'closable':true}
}

/*
 * 适应workbench框架的超链接点击事件响应函数
 * 使用方法：
 * <a href="javascrit:;" page="home" url="/home" onclick="tb_href(this)">首页</a>
 * <a href="javascrit:;" page="home" url="/home" data="{'keywords':'workbench'}" onclick="tb_href(this)">搜索</a>
 */
function tb_href(item) {
	var page_name = $(item).attr('page');
	var page = null;
	for (var key in pages) {
		if (key==page_name) {	
			page = pages[key];
			break;
		}
	}
	if (!page) {
		return false;
	}

	var url = $(item).attr('url');
	var data = $(item).attr('data');
	var tabItem = {'id':page.id,'name':page.name,'url':url,'closable':page.closable, 'data':''};
	if(!data) {
		tabItem = {'id':page.id,'name':page.name,'url':url,'closable':page.closable, 'data':data};
	}
	closableTab.addTab(tabItem);
	return false;
};

/*
 * 使用bootstrap模态框弹出workbench的提示信息
 * 在index.html页面有一个预置的隐藏模态框
 */
function wb_prompt(html) {
	var $dialog = $('div#_wb_prompt');	
	if ($dialog.length>0) {
		$body = $dialog.find('div.modal-body:first');
		if ($body.length>0) {
			$body.html(html);
			$dialog.modal('show');
		}
	}
};

$(document).ready(function(){
	// search搜索
	$('input#search').keypress(function(e){
		if (e.keyCode == "13") {
			// 添加搜索Tab
			var keywords = $(this).val();
			keywords = $.trim(keywords);
			var uri = "/search";
			if (keywords.length>0) {
				var item = {'id':pages.search.id, 'name':pages.search.name,'url':uri,'closable':pages.search.closable, 'data':{'keywords':keywords}};
				closableTab.addTab(item);
				$(this).val('');
			}
		}
	});

	// 增加首页Tab
	var item = {'id':pages.home.id,'name':pages.home.name,'url':'/home','closable':pages.home.closable, 'data':''};
	closableTab.addTab(item);
});
