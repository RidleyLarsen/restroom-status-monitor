from flask import Flask, render_template, jsonify

import RPi.GPIO as GPIO

app = Flask(__name__)

GPIO.setmode(GPIO.BCM)


@app.route('/')
def hello():
    GPIO.setup(4, GPIO.IN)
    womens_occupied = not (GPIO.input(4))
    GPIO.setup(22, GPIO.IN)
    mens_occupied = not (GPIO.input(22))

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
    GPIO.setup(4, GPIO.IN)
    GPIO.setup(22, GPIO.IN)
    dic['womens_occupied'] = not (GPIO.input(4))
    dic['mens_occupied'] = not (GPIO.input(22))
    return jsonify(**dic)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80, debug=True)
