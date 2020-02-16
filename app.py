from flask import render_template
import flask
import pickle
import pandas as pd
import numpy as np
import json
from jinja2 import Template




app = flask.Flask(__name__, template_folder='templates')



############  Routes ###############

@app.route('/')
def index():
    with open("templates/home.html", 'r') as p:
       return p.read()



if __name__ == '__main__':
    app.run(port=5000, debug=True)
