# -*- coding: utf-8 -*-

from flask import Flask,request
from flask_cors import CORS, cross_origin
import json

app = Flask(__name__)
cors = CORS(app, resources={r"*": {"origins": "*"}})

@app.route('/signcode/')
def signcode():
    mock = {
        '4220943203': {"data":'钱杰','department':'软件部','phone':'15050313565'},
        '4220293955': {"data":'王润远','department':'软件部','phone':'10101010101'},
        '1072784819': {"data":'xxx','department':'软件部','phone':'10101010101'}
    }
    code = request.args.get('code')
    result = {
        'success': False,
        'data': ''
    }
    if not code:
        result['data'] = '错误的卡号!'
        return json.dumps(result)
    
    user = mock.get(code)

    if not user:
        result['data'] = '未找到此卡号用户信息!'
        return json.dumps(result)
    
    return json.dumps({
        'success': True,
        'data': user
    })

app.run()