# -*- coding: utf-8 -*-
from workchapp import app
from flask import render_template

# 首页
@app.route('/', methods=['GET','POST'])
def index():
	return render_template('index.html')

# 用户首页
@app.route('/home', methods=['GET','POST'])
def home():
	return render_template('home.html')
	
# 团队1
@app.route('/team_1', methods=['GET','POST'])
def team_1():
	return render_template('team_1.html')

# 团队2
@app.route('/team_2', methods=['GET','POST'])
def team_2():
	return render_template('team_2.html')
