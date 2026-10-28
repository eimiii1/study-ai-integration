# Setup Guide

## Prerequisites

- Python 3.12.14
- MySQL
- Node.js
- pip

## Backend

1. Navigate to the `/server` folder
2. Create a virtual environment
    
    ```bash
    python -m venv venv
    ```
    
3. Activate the virtual environment
    
    ```bash
    # macOS / Linux
    source venv/bin/activate
    
    # Windows
    venv/Scripts/Activate.ps1   # PowerShell
    venv/Scripts/activate       # cmd
    ```
    
4. Install dependencies. A `requirements.txt` file with all required dependencies is included.
    
    ```bash
    pip install -r requirements.txt
    ```
    
5. Set up your environment variables. Create a `.env` file in `/server` with:
    
    ```bash
    DATABASE_URL=mysql+pymysql://USERNAME:PASSWORD@localhost/DATABASE_NAME
    SECRET_KEY=your-secret-key
    JWT_SECRET_KEY=your-jwt-secret-key
    GROQ_API_KEY=your-groq-api-key
    ```
    
6. Run the backend
    
    ```bash
    python app.py
    ```
    

## Frontend

1. Navigate to the `/client` folder
2. Install dependencies
    
    ```bash
    npm install
    ```
    
3. Run the dev server
    
    ```bash
    # npm
    npm run dev
    
    # pnpm
    pnpm dev
    
    # yarn
    yarn dev
    ```