from flask import Flask, render_template

import RPi.GPIO as GPIO

app = Flask(__name__)

GPIO.setmode(GPIO.BCM)

@app.route('/')
def hello():
    templateData = {}
    templateData['title'] = "PoopMaster 9000"
    GPIO.setup(4, GPIO.IN)
    templateData['toilet_1'] = not (GPIO.input(4))
    GPIO.setup(17, GPIO.IN)
    templateData['toilet_2'] = not (GPIO.input(17))
    return render_template('main.html', **templateData)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80, debug=True)
