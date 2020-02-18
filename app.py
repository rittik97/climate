from flask import render_template
import flask
import pickle
import pandas as pd
import numpy as np
import json
from jinja2 import Template
import os
#os.getcwd()
#os.chdir('/Users/rittikghosh/Documents/Python/climate/')
from werkzeug import secure_filename
import cv2 as cv2
#from PIL import Image
from tensorflow.keras.models import load_model

app = flask.Flask(__name__, template_folder='templates')

app.config['UPLOAD_FOLDER'] = '/Users/rittikghosh/Documents/Python/climate'


############  Routes ###############

@app.route('/')
def index():
    with open("templates/home.html", 'r') as p:
       return p.read()

@app.route('/uploader', methods = ['GET', 'POST'])
def upload_file():
   if flask.request.method == 'POST':
      f = flask.request.files['file']
      img=(np.fromstring(f.read(), np.uint8))
      img = cv2.imdecode(img, cv2.IMREAD_UNCHANGED)
      f.save(os.path.join(app.config['UPLOAD_FOLDER'],secure_filename(f.filename)))
      img = cv2.resize(img, (64, 64), interpolation = cv2.INTER_AREA)
      #cv2.imwrite('/Users/rittikghosh/Documents/Python/climate/test.png',img)
      #img=cv2.imread('test.png', cv2.IMREAD_UNCHANGED)
      #img.shape
      model=load_model('model-best.h5')
      img=img.reshape(1, 64,64,3)

      return str(model.predict_on_batch(img))

if __name__ == '__main__':
    app.run(port=5000, debug=True)
