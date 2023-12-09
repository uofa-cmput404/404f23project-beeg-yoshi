CMPUT404-project-socialdistribution
===================================

- [Project requirements](https://github.com/uofa-cmput404/project-socialdistribution/blob/master/project.org) 
- [Our Team Wiki](https://github.com/uofa-cmput404/404f23project-beeg-yoshi/wiki)

Setup & Intialization
=====================

Setup Guide:

* Create and activate virtual environment:
  * ```virtualenv venv --python=python3```
  * ```source venv/bin/activate```
* Install dependencies:
  * ```cd backend/```
  * ```pip install -r requirements.txt```


How to run the server:

* In the directory ```backend/```:
  * ```python3 manage.py runserver```
    * This command starts the webserver on the current machine with the URL ```http://127.0.0.1:8000/``` or ```http://localhost:8000```
    * Default port is 8000
  * To stop the server, input ```Control-C```


How to access the server:

* Open any web browser and enter the URL ```http://127.0.0.1:8000/``` or ```http://localhost:8000```

API Documentation
=================

How to access API Documentation:

* Ensure the server is running (See [Setup & Initialization](https://github.com/uofa-cmput404/404f23project-beeg-yoshi/blob/Documentation/README.md#setup--intialization) for more details)
* Go to the URL ```http://127.0.0.1:8000/docs/```

Contributors
============

Authors:
    
* Nathan Wong (ncw1@ualberta.ca)
* Josh Vuong (jtvuong@ualberta.ca)
* Lauren Herman (lherman@ualberta.ca)
* Michael Harbidge (harbidge@ualberta.ca)
* Youwei Peng (youwei@alberta.ca)

User stories

** User Stories
  other 41 stories are completed except 2 below
   - As a server admin, I want to share public images with users
     on other servers.
   - As an author, posts I make can be in CommonMark