# -*- coding: utf-8 -*-
from jinja2 import Markup
from enum import Enum, unique

@unique
class Page(Enum):
	'''
		Home:		首页
		Search:		搜索结果
		Team1:		团队A
		Team2:		团队B
	'''
	Home = 0
	Search = 1
	Team1 = 2
	Team2 = 3

	@property
	def desc(self):
		m = self.__class__.__doc__.split()
		idx = m.index('%s:'%self.name)
		return m[idx+1]

class Tabbar(object):
	@classmethod
	def href(cls, name, page, url, css='', closeable=True, **kwargs):
		'''生成可用于workbench Tabbar页面的链接.
			Args:
				name:		超链接显示的名称，即：<a>@name</a>
				page:		Page类的实例，如Page.Home
				url:		链接地址，如:/home，也支持url_for()函数生成的链接
				css:		超链接的css类，即<a href="#" class="@css">
				closeable:	该Tab页面能否关闭
				kwargs:		其它参数，如：role="button"等。
		'''
		tabid = page.value
		tabname = page.desc
		js_closeable = 'true' if closeable else 'false'
		script = '(function(){closableTab.addTab({\'id\':%d, \'name\':\'%s\', \'url\':\'%s\',\'closable\':%s});})()'%(tabid, tabname, url, js_closeable)
		options = ''
		for k,v in kwargs.items():
			options = options + '%s="%s" '%(k, v)
		html = '<a href="javascript:void(0)" class="%s" %s onclick="%s">'%(css, options, script)
		html = html + str(name)
		html = html + '</a>'
		return Markup(html)		
