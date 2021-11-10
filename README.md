# WorkGenius Web Developer test exercise

## Exercise

> _In a nutshell a simple many-to-many relationship modeling with some primitive CRUD and UI_

### Context

We have a web application where our admins can see/review/manage users.

### Challenge

Our customer-success department is missing functionality to group users based on their skills.

### User story

- As CS-manager, I want to **attach skills to users**, so I can easily **filter the list of users by skill**.

### Acceptance criteria (happy flow)

1. I choose a user
2. I attach skill "javascript" to the user
3. I filter the list of users by skill "javascript"
4. I see result 1 row with the user from 2nd step

## Setup & run project

### Backend

> _Assumption is that you working under ubuntu and have set up python3.8_

```shell
cd backend

# Install virtual environment
python3.8 -m venv .venv
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run
flask run --reload
```

### Frontend

> _Assumption is that you already installed Node 12+_

```shell
cd frontend

# Install dependencies
npm install

# Run
npm start
```

## Share results

A github link (ex: you can fork current repo) with accomplished exercise expected to be sent via email to ivan@workgenius.com

> if github link is not an option for you, a zip archive of the project can be sent

Good luck ;) 
