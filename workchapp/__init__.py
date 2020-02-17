# -*- coding: utf-8 -*-

from flask import Flask

__version__ = '1.0'
__author__ = 'zhazh'

app = Flask(__name__)

import workchapp.views
from workchapp.page import Page
from workchapp.page import Tabbar

app.jinja_env.globals['Page'] = Page
app.jinja_env.globals['Tabbar'] = Tabbar


