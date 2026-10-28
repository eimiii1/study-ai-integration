from groq import Groq
from dotenv import load_dotenv
import os

load_dotenv()

client = Groq(api_key=os.environ.get('GROQ_API_KEY'))

completion = client.chat.completions.create(
    model=os.environ.get('GROQ_MODEL', 'llama-3.1-8b-instant'),
    messages=[{'role': 'user', 'content': 'Send an example JSON object.'}],
    response_format={'type': 'json_object'},
)

print(completion.choices[0].message.content)
