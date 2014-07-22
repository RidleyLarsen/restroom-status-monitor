from flask import Flask, render_template, jsonify

import RPi.GPIO as GPIO

app = Flask(__name__)

GPIO.setmode(GPIO.BCM)


@app.route('/')
def hello():
    templateData = {}
    templateData['title'] = "ToiletPi"
    GPIO.setup(4, GPIO.IN)
    templateData['womens_occupied'] = not (GPIO.input(4))
    GPIO.setup(22, GPIO.IN)
    templateData['mens_occupied'] = not (GPIO.input(22))
    return render_template('main.html', **templateData)


@app.route('/status')
def get_status():
    dic = {}
    GPIO.setup(4, GPIO.IN)
    GPIO.setup(22, GPIO.IN)
    dic['womens_occupied'] = not (GPIO.input(4))
    dic['mens_occupied'] = not (GPIO.input(22))
    return jsonify(**dic)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80, debug=True)
