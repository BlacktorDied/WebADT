# Lab 2 - Django Login Form
This folder contains a Django project with a login application. Below is a brief overview of the structure and contents of the Lab_2 folder.

## Structure
```
Lab_2/
├── db.sqlite3
├── login/
│   ├── __init__.py
│   ├── __pycache__/
│   ├── admin.py
│   ├── apps.py
│   ├── forms.py
│   ├── migrations/
│   ├── models.py
│   ├── tests.py
│   ├── urls.py
│   └── views.py
├── manage.py
└── mysite/
    ├── __init__.py
    ├── __pycache__/
    ├── asgi.py
    ├── settings.py
    ├── urls.py
    └── wsgi.py
```

### Contents
`db.sqlite3`

This is the SQLite database file used by the Django project.

---

`login/`

This directory contains the login application for the Django project.

  - `__init__.py`: Initializes the login application.
  - `admin.py`: Configuration for the Django admin interface.
  - `apps.py`: Configuration for the login application.
  - `forms.py`: Contains forms used in the login application.
  - `migrations/`: Directory for database migrations.
  - `models.py`: Contains the data models for the login application.
  - `tests.py`: Contains tests for the login application.
  - `urls.py`: URL routing for the login application.
  - `views.py`: Contains views for the login application.

---

`manage.py` 

A command-line utility that lets you interact with the Django project.

---

`mysite/`

This directory contains the main Django project settings and configuration.

- `__init__.py`: Initializes the Django project.
- `asgi.py`: ASGI configuration for the Django project.
- `settings.py`: Contains settings and configuration for the Django project.
- `urls.py`: URL routing for the Django project.
- `wsgi.py`: WSGI configuration for the Django project.

## How to Run
1. Install Dependencies: Ensure you have Django installed. You can install it using pip:
```
pip install django
```

2. Apply Migrations: Apply the database migrations:
```
python manage.py migrate
```

3. Run the Server: Start the Django development server:
```
python manage.py runserver
```

4. Access the Application: Open your web browser and go to http://127.0.0.1:8000/.

## Additional Information
- Admin Interface: Access the Django admin interface at http://127.0.0.1:8000/admin/.
- Login Application: Access the login application at http://127.0.0.1:8000/login/.
