from flask import Blueprint, render_template, request, jsonify
from flask_login import current_user
import requests
import polyline
import json

views = Blueprint('views', __name__)


@views.route("/", methods=['GET', 'POST'])
def home_page():
    print(current_user)
    return render_template('map_osm.html', user=current_user)


@views.route('/latlonpost', methods=['POST'])
def get_post_latlon_data():
    jsdata = json.loads(request.form['latlon_data'])

    start_lat, start_lon = jsdata['start']['lat'], jsdata['start']['lng']
    finish_lat, finish_lon = jsdata['finish']['lat'], jsdata['finish']['lng']

    API_KEY = '90c65c290d8e3e02'  # journey planer API cyclestreets.net

    # https://www.cyclestreets.net/api/v1/journey/#jpRequired
    cycle_url = f'https://www.cyclestreets.net/api/journey.json?key={API_KEY}&reporterrors=1&segments=0&itinerarypoints={start_lon},{start_lat}|{finish_lon},{finish_lat}&plan=balanced'

    cycle_return = requests.post(cycle_url)

    if cycle_return.ok:
        osrm_json = cycle_return.json()

        cords = osrm_json['marker']['@attributes']['coordinates']
        cords = [tuple(float(j) for j in i[::-1])
                 for i in [i.split(',') for i in cords.split(' ')]]
        return json.dumps({'geometry': cords})
    else:
        return 'ERROR - Unable to calculate the route'
