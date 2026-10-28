import os 
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY')
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY')
    GROQ_API_KEY = os.environ.get('GROQ_API_KEY')
    # Not every model Groq lists is actually enabled on every account, so this
    # is overridable without touching code. Try llama-3.1-8b-instant or
    # openai/gpt-oss-120b if the default 404s for you — see
    # https://console.groq.com/docs/models for what your key can actually use.
    GROQ_MODEL = os.environ.get('GROQ_MODEL', 'openai/gpt-oss-20b')
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')
    SQLALCHEMY_TRACK_MODIFICATIONS = False 

    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)