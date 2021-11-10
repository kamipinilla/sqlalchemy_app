from typing import List

from flask_sqlalchemy import SQLAlchemy, orm
from pydantic import BaseModel

db = SQLAlchemy()


class UserSchema(BaseModel):
    id: int
    name: str

    class Config:
        orm_mode = True


class UsersResponse(BaseModel):
    items: List[UserSchema]


class SkillSchema(BaseModel):
    id: int
    name: str

    class Config:
        orm_mode = True


class SkillsResponse(BaseModel):
    items: List[SkillSchema]


class User(db.Model):
    __tablename__ = 'user'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    
    skills = orm.relationship('Skill', secondary='user_skill_rel', back_populates='users')

    def __repr__(self):
        return "<User %r>" % self.name


class Skill(db.Model):
    __tablename__ = 'skill'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)

    users = orm.relationship('User', secondary='user_skill_rel', back_populates='skills')

    def __repr__(self):
        return "<Skill %r>" % self.name


class UserSkillRel(db.Model):
    __tablename__ = 'user_skill_rel'

    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), primary_key=True)
    skill_id = db.Column(db.Integer, db.ForeignKey('skill.id'), primary_key=True)

    def __repr__(self):
        return f'<UserSkillRel {self.user_id} - {self.skill_id}>'
