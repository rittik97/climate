from flask import render_template
import flask
#import pickle
#import pandas as pd
import numpy as np
import json
from jinja2 import Template
import os
#os.getcwd()
#os.chdir('/Users/rittikghosh/Documents/Python/climate/')
from werkzeug import secure_filename
import cv2 as cv2
from PIL import Image
from tensorflow.keras.models import load_model

app = flask.Flask(__name__, template_folder='templates')

app.config['UPLOAD_FOLDER'] = '/Users/rittikghosh/Documents/Python/climate'


############  Routes ###############
@app.route('/Svalbard')
def Svalbard():
    with open("templates/svalbard.html", 'r') as p:
       return p.read()

@app.route('/Rwanda')
def rwanda():
    with open("templates/rwanda.html", 'r') as p:
       return p.read()

@app.route('/classifier')
def classifier():
    with open("templates/classifier.html", 'r') as p:
       return p.read()

@app.route('/')
def sunderbans():
    with open("templates/sunderbans.html", 'r') as p:
       return p.read()

@app.route('/classify', methods=['POST'])
def trial():
        args= (flask.request.form)
        url=args['data']
        img_name=url.split('images/')[1]
        #img_name='PermanentCrop_514.jpg'
        path='static/images/'+img_name
        img = Image.open(path)
        img=np.asarray(img, dtype='float32')
        img=img.reshape(1,64,64,3)
        model=load_model('model_best_2.h5')
        pred=model.predict_classes(img)[0]
        print(pred)
        if pred==4:
                return 'Predicted: Built-up Land'
        return 'Predicted: Vegetation'
@app.route('/uploader', methods = ['GET', 'POST'])
def upload_file():
   if flask.request.method == 'POST':
      f = flask.request.files['file']

      #img=(np.fromstring(f.read(), dtype='int32'))
      #f=flask.request
      img = np.fromstring(f.read(), np.uint8)

      img = cv2.imdecode(img, cv2.IMREAD_UNCHANGED)
      img = Image.fromarray(img.astype("uint8"))
      print(img)
      f.save(os.path.join(app.config['UPLOAD_FOLDER'],secure_filename(f.filename)))
      #img = cv2.resize(img, (64, 64), interpolation = cv2.INTER_AREA)
      #cv2.imwrite('/Users/rittikghosh/Documents/Python/climate/test.png',img)
      #img=cv2.imread('Forest_338.jpg', cv2.IMREAD_UNCHANGED)
      img=np.asarray(img, dtype='float32')
      model=load_model('model-best.h5')
      img=img.reshape(1, 64,64,3)

      return str(model.predict_classes(img))

if __name__ == '__main__':
    app.run(port=5000, debug=True)
