from faker import Faker
from flask import Flask, request
from flask_cors import CORS

from models import db, User, UserSchema, UsersResponse, Skill, SkillsResponse, UserSkillRel

fake = Faker()

def prepopulate_skills(app):
    initial_skills = ['JavaScript', 'Android', 'Python']
    with app.app_context():
        for skill in initial_skills:
            db.session.add(Skill(name=skill))
            db.session.commit()


def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    db.init_app(app)
    with app.app_context():
        db.drop_all()
        db.create_all()

    prepopulate_skills(app)

    return app


app = create_app()

CORS(app)

@app.route('/users', methods=['POST'])
def create_users_batch():
    with app.app_context():
        for _ in range(10):
            db.session.add(User(name=fake.name()))
        db.session.commit()
    return 'Users created', 201


@app.route('/users', methods=['DELETE'])
def delete_all_users():
    with app.app_context():
        User.query.delete()
        db.session.commit()
    return 'Users deleted'


@app.route('/users', methods=['GET'])
def get_users():
    with app.app_context():
        results = User.query.all()
    return UsersResponse(items=results).json()


@app.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    with app.app_context():
        user = User.query.get(user_id)
    return UserSchema(id=user.id, name=user.name).json()


@app.route('/users/<int:user_id>/skills', methods=['GET'])
def get_user_skills(user_id):
    with app.app_context():
        user = User.query.get(user_id)
        results = user.skills
    return SkillsResponse(items=results).json()


@app.route('/users/<int:user_id>/skills', methods=['POST'])
def set_user_skills(user_id):
    request_dict = request.json
    skills_ids = request_dict['skillsIds']
    with app.app_context():
        user = User.query.get(user_id)
        skills_to_set = db.session.query(Skill).filter(Skill.id.in_(skills_ids)).all()
        user.skills = skills_to_set
        db.session.add(user)
        db.session.commit()
    return 'Skills set'


@app.route('/users/with_any_of_skills', methods=['POST'])
def get_users_with_any_of_skills():
    request_dict = request.json
    skills_ids = request_dict['skillsIds']
    with app.app_context():
        results = db.session.query(User).join(UserSkillRel).filter(UserSkillRel.skill_id.in_(skills_ids)).all()
    return UsersResponse(items=results).json()


@app.route('/users/with_all_skills', methods=['POST'])
def get_users_with_all_skills():
    request_dict = request.json
    skills_ids = request_dict['skillsIds']
    skills_ids_set = set(skills_ids)
    with app.app_context():
        users = db.session.query(User).all()
        results = []
        for user in users:
            user_skills_ids_set = set(skill.id for skill in user.skills)
            if skills_ids_set <= user_skills_ids_set:
                results.append(user)
    return UsersResponse(items=results).json()


@app.route('/skills', methods=['GET'])
def get_skills():
    with app.app_context():
        results = Skill.query.all()
    return SkillsResponse(items=results).json()


@app.route('/skills', methods=['POST'])
def create_skill():
    new_skill = request.json
    new_skill_name = new_skill['name']
    with app.app_context():
        skill_with_name_found = Skill.query.filter(Skill.name == new_skill_name).first() is not None
        if skill_with_name_found:
            return f'Skill "{new_skill_name}" already exists', 400
        db.session.add(Skill(name=new_skill_name))
        db.session.commit()
    return 'Skill created', 201


@app.route('/skills/<int:skill_id>', methods=['DELETE'])
def delete_skill(skill_id):
    with app.app_context():
        Skill.query.filter(Skill.id == skill_id).delete()
        db.session.commit()
    return f'Skill {skill_id} deleted'


if __name__ == '__main__':
    app.run()
