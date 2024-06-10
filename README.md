# SocialMediaDjangoReact

A social media application built with Django for the backend and React for the frontend.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Setup](#setup)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Introduction

SocialMediaDjangoReact is a social media application that leverages the power of Django for backend development and React for frontend development. This project aims to provide a platform for users to connect, share content, and engage with each other.

## Features

- User Authentication (Signup, Login, Logout)
- User Profiles
- User Follow Feature
- Posts (Create, Read, Update, Delete)
- Comments on posts
- Like functionality for posts and comments
- Realtime Websocket Notifications on new comments & follows & likes
- Responsive design

## Technologies Used

- **Backend**: Django
- **Frontend**: React
- **Database**: SQLite (default, can be configured to use PostgreSQL or MySQL)
- **Others**: Django REST Framework, Axios, Channels

## Setup

### Prerequisites

- Python 3.x
- Node.js and npm
- REDIS

### Backend Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/ardaaltinors/SocialMediaDjangoReact.git
   cd SocialMediaDjangoReact
   ```

2. Create a virtual environment and activate it:

   ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

3. Install the backend dependencies:

   ```bash
   pip install -r requirements.txt
   ```

4. Apply the migrations:

   ```bash
   python manage.py migrate
   ```

5. Start Redis service (for WebSocket notifications):

   ```bash
   brew services start redis #On MacOS
   ```

6. Run the development server:
   ```bash
   python manage.py runserver
   ```

### Frontend Setup

1. Navigate to the `frontend` directory:

   ```bash
   cd frontend
   ```

2. Install the frontend dependencies:

   ```bash
   npm install
   ```

3. Start the React development server:
   ```bash
   npm run dev
   ```

## Usage

Once both the backend and frontend servers are running, you can access the application at `http://localhost:5173` for the frontend and `http://localhost:8000` for the backend API.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature-branch`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push main feature-branch`)
5. Create a pull request

## License

This project is licensed under the MIT License.
