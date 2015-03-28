import logging
from logging.handlers import RotatingFileHandler
from flask import Flask, render_template, jsonify

__version__ = '2.0.0'

DEBUG = False
DEBUG_MENS = True
DEBUG_WOMENS = False

app = Flask(__name__)

if not DEBUG:
    import RPi.GPIO as GPIO
    GPIO.setmode(GPIO.BCM)


@app.route('/')
def hello():
    if not DEBUG:
        GPIO.setup(4, GPIO.IN)
        womens_occupied = not (GPIO.input(4))
        GPIO.setup(22, GPIO.IN)
        mens_occupied = not (GPIO.input(22))
    else:
        mens_occupied = DEBUG_MENS
        womens_occupied = DEBUG_WOMENS

    if mens_occupied:
        if womens_occupied:
            favicon = 'both_occupied'
        else:
            favicon = 'men_occupied_women_empty'
    else:
        if womens_occupied:
            favicon = 'men_empty_women_occupied'
        else:
            favicon = 'both_empty'

    templateData = {
        'favicon': favicon,
        'title': 'ToiletPi',
        'womens_occupied': womens_occupied,
        'mens_occupied': mens_occupied,
    }

    return render_template('main.html', **templateData)


@app.route('/status')
def get_status():
    dic = {}
    if not DEBUG:
        GPIO.setup(4, GPIO.IN)
        GPIO.setup(22, GPIO.IN)
        dic['womens_occupied'] = not (GPIO.input(4))
        dic['mens_occupied'] = not (GPIO.input(22))
    else:
        dic['womens_occupied'] = DEBUG_WOMENS
        dic['mens_occupied'] = DEBUG_MENS
    return jsonify(**dic)

if __name__ == '__main__':
    port = 8001
    handler = RotatingFileHandler('/home/pi/app.log', maxBytes=10000, backupCount=1)
    handler.setLevel(logging.INFO)
    app.logger.addHandler(handler)
    if DEBUG:
        port = 8001
    app.run(host='0.0.0.0', port=port, debug=True)
