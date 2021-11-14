
import json

from flask import Blueprint, request, url_for
from flask_login import login_user, logout_user, current_user, login_required
from werkzeug.utils import redirect
from .models import User
from . import db
from werkzeug.security import generate_password_hash, check_password_hash

auth = Blueprint('auth', __name__)


@auth.route('/signup', methods=['POST'])
def signup():
    signupdata = json.loads(request.form['signup_data'])
    print(signupdata)
    new_user = User(email=signupdata['email'],
                    username=signupdata['name'],
                    password=generate_password_hash(signupdata['password'], method='sha256'))

    user = User.query.filter_by(email=signupdata['email']).first()
    if user:
        return json.dumps({"success": 0})
    else:
        try:
            db.session.add(new_user)
            db.session.commit()
            login_user(new_user, remember=True)

            print(current_user)
            return json.dumps({"success": 1})
        except:
            return json.dumps({"success": 0})


@auth.route('/login', methods=['POST'])
def login():

    logindata = json.loads(request.form['login_data'])
    print(logindata)
    user = User.query.filter_by(email=logindata['email']).first()
    if user:
        if check_password_hash(user.password, logindata['password']):
            login_user(user, remember=True)
            print(current_user)
            return json.dumps({"success": 1})
        else:
            return json.dumps({"success": 0})
    else:
        return json.dumps({"success": 0})


@auth.route('/logout', methods=['GET', 'POST'])
@login_required
def logout():
    logout_user()
    return redirect(url_for('views.home_page'))
