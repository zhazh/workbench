# -*- coding: utf-8 -*-
from workchapp import app
from flask import render_template

# 首页
@app.route('/', methods=['GET','POST'])
def index():
	return render_template('index.html')

# 用户首页
@app.route('/home', methods=['GET'])
def home():
	return render_template('home.html')

# 团队
@app.route('/team', methods=['GET'])
def team():
	users = []
	for i in range(16):
		user = None
		if i%2 == 0:
			user = {'no':1000+i, 'name':'韩梅梅%d'%i, 'sex':'女', 'age':25, 'nation':'汉', 'birth_city':'安徽铜陵', 'take_date':'2010.9.4'}
		else:
			user = {'no':1000+i, 'name':'李雷%d'%i,   'sex':'男', 'age':27, 'nation':'汉', 'birth_city':'安徽铜陵', 'take_date':'2012.9.4'}
		users.append(user)
	return render_template('team.html', users=users)

# 成员信息详情
@app.route('/member/<int:user_id>', methods=['GET'])
def member(user_id):
	user = {}
	if user_id % 2 == 0:
		user = {'no':user_id, 'name':'韩梅梅%d'%(user_id-1000), 'sex':'女', 'age':25, 'nation':'汉', 'birth_city':'安徽铜陵', 'take_date':'2010.9.4'}
	else:
		user = {'no':user_id, 'name':'李雷%d'%(user_id-1000),   'sex':'男', 'age':27, 'nation':'汉', 'birth_city':'安徽铜陵', 'take_date':'2012.9.4'}
	return render_template('member.html', user=user)

# Page测试用例	
@app.route('/page/<int:page_id>', methods=['GET'])
def page(page_id):
	return render_template('page.html', page_id=page_id)

