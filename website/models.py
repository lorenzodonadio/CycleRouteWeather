from . import db  # import database from __init__
from flask_login import UserMixin
from sqlalchemy.sql import func


class User(db.Model, UserMixin):
    """
    ------- fields ---------
    Needed

    username: String(150)
    email : String(150) unique=True
    password = String(150)

    auto generated:

    user_id : auto generated int primary_key=True)

    relationships

    routes: 'Route'
    """
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150))
    email = db.Column(db.String(150), unique=True)
    password = db.Column(db.String(150))
    routes = db.relationship('Route')


class Route(db.Model):

    """
    ------- fields ---------

    Needed

    data: String(10000) Json data for the route
    auto generated:
    date : DateTime(timezone=True).now()

    -------------

    foreignkey
    user_id: 'user.user_id'
    """

    id = db.Column(db.Integer, primary_key=True)
    data = db.Column(db.String(10000))
    date = db.Column(db.DateTime(timezone=True), default=func.now())
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
