from flask import Blueprint, render_template, request, jsonify
import requests
import polyline
import json

views = Blueprint('views', __name__)


@views.route("/", methods=['GET', 'POST'])
def home_page():
    return render_template('map_osm.html')


@views.route('/latlonpost', methods=['POST'])
def get_post_latlon_data():
    jsdata = json.loads(request.form['latlon_data'])

    start_lat, start_lon = jsdata['start']['lat'], jsdata['start']['lng']
    finish_lat, finish_lon = jsdata['finish']['lat'], jsdata['finish']['lng']
    # path calculated using: http://project-osrm.org/
    # /route/v1/{profile}/{coordinates}?alternatives={true|false|number}&steps={true|false}
    # &geometries={polyline|polyline6|geojson}&overview={full|simplified|false}&annotations={true|false}
    osrm_url = 'http://router.project-osrm.org/route/v1/foot/' + \
        f'{start_lon},{start_lat};{finish_lon},{finish_lat}'+'?overview=simplified'
    osrm_return = requests.post(osrm_url)

    if osrm_return.ok:
        osrm_json = osrm_return.json()

        osrm_json['routes'][0]['geometry'] = polyline.decode(
            osrm_json['routes'][0]['geometry'])

        return json.dumps(osrm_json['routes'][0])
    else:
        return 'ERROR - Unable to calculate the route'
