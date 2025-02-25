from fastapi import FastAPI, Depends, HTTPException, status, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel
from datetime import datetime, timedelta
from typing import Optional
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from dotenv import load_dotenv
import os
load_dotenv()
# MongoDB setup
MONGODB_URL = os.getenv("My_DB_URL")
client = AsyncIOMotorClient(MONGODB_URL)
db = client.quiz_system

# JWT settings
SECRET_KEY = os.getenv("My_secrett_key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Rate limiter
limiter = Limiter(key_func=get_remote_address)
app = FastAPI()
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# User model
class User(BaseModel):
    username: str
    email: Optional[str] = None
    full_name: Optional[str] = None
    disabled: Optional[bool] = None

class UserInDB(User):
    hashed_password: str

# Token model
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

async def get_user(username: str):
    user = await db.users.find_one({"username": username})
    if user:
        return UserInDB(**user)

async def authenticate_user(username: str, password: str):
    user = await get_user(username)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception
    user = await get_user(username=token_data.username)
    if user is None:
        raise credentials_exception
    return user

@app.post("/token", response_model=Token)
@limiter.limit("5/minute")
async def login_for_access_token(request: Request, form_data: OAuth2PasswordRequestForm = Depends()):
    user = await authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/signup")
@limiter.limit("3/minute")
async def signup(request: Request, user: User, password: str):
    existing_user = await get_user(user.username)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered",
        )
    hashed_password = get_password_hash(password)
    user_dict = user.dict()
    user_dict["hashed_password"] = hashed_password
    await db.users.insert_one(user_dict)
    return {"message": "User created successfully"}

@app.get("/users/me/", response_model=User)
@limiter.limit("10/minute")
async def read_users_me(request: Request, current_user: User = Depends(get_current_user)):
    return current_user
# Sample quizzes
sample_quizzes = [
    {
        "title": "Web Development Basics",
        "questions": [
            {
                "text": "What does HTML stand for?",
                "options": [
                    "Hyper Text Markup Language",
                    "High Tech Modern Language",
                    "Hyperlink and Text Markup Language",
                    "Home Tool Markup Language"
                ],
                "correctAnswer": 0
            },
            {
                "text": "Which of the following is used for styling web pages?",
                "options": ["HTML", "JavaScript", "CSS", "XML"],
                "correctAnswer": 2
            },
            {
                "text": "What is the purpose of JavaScript in web development?",
                "options": [
                    "To style web pages",
                    "To create dynamic and interactive web pages",
                    "To define the structure of web pages",
                    "To store data on the server"
                ],
                "correctAnswer": 1
            }
        ]
    },
    {
        "title": "Python Programming",
        "questions": [
            {
                "text": "What is the correct way to declare a variable in Python?",
                "options": [
                    "var x = 5",
                    "let x = 5",
                    "x = 5",
                    "int x = 5"
                ],
                "correctAnswer": 2
            },
            {
                "text": "Which of the following is used to define a function in Python?",
                "options": ["function", "def", "fun", "define"],
                "correctAnswer": 1
            },
            {
                "text": "What is the output of print(2 ** 3)?",
                "options": ["6", "8", "9", "16"],
                "correctAnswer": 1
            }
        ]
    },
    {
        "title": "JavaScript Fundamentals",
        "questions": [
            {
                "text": "Which keyword is used to declare a variable in JavaScript?",
                "options": ["var", "let", "both var and let", "variable"],
                "correctAnswer": 2
            },
            {
                "text": "What is the result of typeof null in JavaScript?",
                "options": ["null", "undefined", "object", "number"],
                "correctAnswer": 2
            },
            {
                "text": "Which method is used to add an element to the end of an array?",
                "options": ["push()", "append()", "addToEnd()", "insert()"],
                "correctAnswer": 0
            }
        ]
    },
    {
        "title": "Data Structures",
        "questions": [
            {
                "text": "Which data structure uses LIFO (Last In First Out) principle?",
                "options": ["Queue", "Stack", "Linked List", "Tree"],
                "correctAnswer": 1
            },
            {
                "text": "What is the time complexity of searching an element in a balanced binary search tree?",
                "options": ["O(1)", "O(n)", "O(log n)", "O(n^2)"],
                "correctAnswer": 2
            },
            {
                "text": "Which of the following is not a linear data structure?",
                "options": ["Array", "Linked List", "Queue", "Tree"],
                "correctAnswer": 3
            }
        ]
    },
    {
        "title": "SQL Basics",
        "questions": [
            {
                "text": "Which SQL command is used to retrieve data from a database?",
                "options": ["GET", "RETRIEVE", "SELECT", "FETCH"],
                "correctAnswer": 2
            },
            {
                "text": "What does the acronym SQL stand for?",
                "options": ["Structured Query Language", "Simple Question Language", "Structured Question Language", "Simple Query Language"],
                "correctAnswer": 0
            },
            {
                "text": "Which clause is used to filter the results of a SQL query?",
                "options": ["FILTER", "WHERE", "HAVING", "GROUP BY"],
                "correctAnswer": 1
            }
        ]
    },
    {
        "title": "Network Fundamentals",
        "questions": [
            {
                "text": "What does IP stand for in the context of networking?",
                "options": ["Internet Protocol", "Internal Protocol", "Information Processing", "Interconnection Process"],
                "correctAnswer": 0
            },
            {
                "text": "Which layer of the OSI model is responsible for routing?",
                "options": ["Data Link Layer", "Network Layer", "Transport Layer", "Session Layer"],
                "correctAnswer": 1
            },
            {
                "text": "What is the purpose of DNS in networking?",
                "options": ["To assign IP addresses", "To encrypt data", "To translate domain names to IP addresses", "To manage network traffic"],
                "correctAnswer": 2
            }
        ]
    },
    {
        "title": "Operating Systems",
        "questions": [
            {
                "text": "What is the primary function of an operating system?",
                "options": ["Run applications", "Manage hardware resources", "Provide user interface", "All of the above"],
                "correctAnswer": 3
            },
            {
                "text": "Which scheduling algorithm is based on the principle of first-come, first-served?",
                "options": ["Round Robin", "Priority Scheduling", "FCFS", "Shortest Job First"],
                "correctAnswer": 2
            },
            {
                "text": "What is virtual memory in operating systems?",
                "options": ["High-speed cache", "Extension of RAM using disk space", "A type of ROM", "CPU register"],
                "correctAnswer": 1
            }
        ]
    },
    {
        "title": "Cybersecurity Basics",
        "questions": [
            {
                "text": "What is phishing?",
                "options": ["A type of fish", "A hacking technique", "An authentication method", "A network protocol"],
                "correctAnswer": 1
            },
            {
                "text": "Which of the following is not a common type of malware?",
                "options": ["Virus", "Trojan", "Worm", "Firewall"],
                "correctAnswer": 3
            },
            {
                "text": "What does SSL stand for in the context of secure communications?",
                "options": ["Secure Socket Layer", "System Security Layer", "Safe Server Link", "Synchronized Secure Line"],
                "correctAnswer": 0
            }
        ]
    },
    {
        "title": "Machine Learning Concepts",
        "questions": [
            {
                "text": "What is the primary goal of supervised learning?",
                "options": ["Clustering", "Classification and Regression", "Dimensionality Reduction", "Anomaly Detection"],
                "correctAnswer": 1
            },
            {
                "text": "Which algorithm is commonly used for clustering in machine learning?",
                "options": ["Linear Regression", "Decision Trees", "K-Means", "Logistic Regression"],
                "correctAnswer": 2
            },
            {
                "text": "What does CNN stand for in the context of deep learning?",
                "options": ["Compressed Neural Network", "Convolutional Neural Network", "Complex Neural Nodes", "Centralized Network Nodes"],
                "correctAnswer": 1
            }
        ]
    },
    {
        "title": "Git Version Control",
        "questions": [
            {
                "text": "What command is used to create a new Git repository?",
                "options": ["git create", "git init", "git start", "git new"],
                "correctAnswer": 1
            },
            {
                "text": "Which Git command is used to download changes from a remote repository?",
                "options": ["git pull", "git push", "git fetch", "git clone"],
                "correctAnswer": 0
            },
            {
                "text": "What does the command 'git add .' do?",
                "options": ["Adds a new repository", "Stages all changes in the current directory", "Commits all changes", "Creates a new branch"],
                "correctAnswer": 1
            }
        ]
    },
    {
        "title": "Cloud Computing",
        "questions": [
            {
                "text": "Which of the following is not a major cloud service provider?",
                "options": ["Amazon Web Services (AWS)", "Microsoft Azure", "Google Cloud Platform (GCP)", "Oracle Cloud"],
                "correctAnswer": 3
            },
            {
                "text": "What does IaaS stand for in cloud computing?",
                "options": ["Internet as a Service", "Infrastructure as a Service", "Integration as a Service", "Information as a Service"],
                "correctAnswer": 1
            },
            {
                "text": "Which cloud service model provides a platform for developers to build and run applications?",
                "options": ["SaaS", "PaaS", "IaaS", "FaaS"],
                "correctAnswer": 1
            }
        ]
    },
    {
        "title": "Agile Methodology",
        "questions": [
            {
                "text": "What is a sprint in Agile methodology?",
                "options": ["A bug in the software", "A fixed time-box for development", "A type of meeting", "A testing phase"],
                "correctAnswer": 1
            },
            {
                "text": "Which of the following is not one of the four values in the Agile Manifesto?",
                "options": ["Individuals and interactions over processes and tools", "Working software over comprehensive documentation", "Customer collaboration over contract negotiation", "Following a plan over responding to change"],
                "correctAnswer": 3
            },
            {
                "text": "What is the role of a Scrum Master in Agile?",
                "options": ["To manage the team", "To remove impediments and facilitate the Scrum process", "To set project deadlines", "To write code"],
                "correctAnswer": 1
            }
        ]
    },
    {
        "title": "RESTful API Design",
        "questions": [
            {
                "text": "What does REST stand for in the context of API design?",
                "options": ["Representational State Transfer", "Remote Execution State Transfer", "Rapid Execution Service Technology", "Resource Execution State Transfer"],
                "correctAnswer": 0
            },
            {
                "text": "Which HTTP method is typically used to update an existing resource in a RESTful API?",
                "options": ["GET", "POST", "PUT", "DELETE"],
                "correctAnswer": 2
            },
            {
                "text": "What is the purpose of the HTTP status code 404 in a RESTful API response?",
                "options": ["Successful request", "Server error", "Resource not found", "Unauthorized access"],
                "correctAnswer": 2
            }
        ]
    },
    {
        "title": "Docker Containers",
        "questions": [
            {
                "text": "What is a Docker container?",
                "options": ["A virtual machine", "A lightweight, standalone executable package", "A physical server", "A network protocol"],
                "correctAnswer": 1
            },
            {
                "text": "Which file is used to define the steps to create a Docker image?",
                "options": ["Containerfile", "Imagefile", "Dockerfile", "Buildfile"],
                "correctAnswer": 2
            },
            {
                "text": "What command is used to run a Docker container?",
                "options": ["docker start", "docker run", "docker execute", "docker begin"],
                "correctAnswer": 1
            }
        ]
    },
    {
        "title": "Blockchain Technology",
        "questions": [
            {
                "text": "What is the primary purpose of blockchain technology?",
                "options": ["To create cryptocurrencies", "To provide a decentralized and immutable ledger", "To speed up database queries", "To encrypt emails"],
                "correctAnswer": 1
            },
            {
                "text": "Which consensus mechanism is used by Bitcoin?",
                "options": ["Proof of Stake", "Proof of Work", "Proof of Authority", "Proof of Capacity"],
                "correctAnswer": 1
            },
            {
                "text": "What is a smart contract in blockchain?",
                "options": ["A legal document", "A type of cryptocurrency", "Self-executing code on the blockchain", "A method of encryption"],
                "correctAnswer": 2
            }
        ]
    },
    {
        "title": "UI/UX Design Principles",
        "questions": [
            {
                "text": "What does UX stand for in design?",
                "options": ["User Extension", "User Experience", "User Examination", "User Execution"],
                "correctAnswer": 1
            },
            {
                "text": "Which of the following is a key principle of good UI design?",
                "options": ["Complexity", "Inconsistency", "Clarity", "Rigidity"],
                "correctAnswer": 2
            },
            {
                "text": "What is the purpose of a wireframe in UX design?",
                "options": ["To add color to the design", "To test the final product", "To create a basic layout of the interface", "To write the code for the interface"],
                "correctAnswer": 2
            }
        ]
    },
    {
        "title": "Big Data and Analytics",
        "questions": [
            {
                "text": "What are the three V's often used to describe Big Data?",
                "options": ["Volume, Velocity, Variety", "Visibility, Value, Verification", "Validity, Volatility, Virtualization", "Viability, Vitality, Visualization"],
                "correctAnswer": 0
            },
            {
                "text": "Which of the following is not a common Big Data processing framework?",
                "options": ["Hadoop", "Spark", "Storm", "SQLite"],
                "correctAnswer": 3
            },
            {
                "text": "What is the primary purpose of data analytics in Big Data?",
                "options": ["To store large amounts of data", "To process data in real-time", "To extract meaningful insights from data", "To encrypt sensitive information"],
                "correctAnswer": 2
            }
        ]
    },
    {
        "title": "Software Testing",
        "questions": [
            {
                "text": "What type of testing is performed to verify that a system meets external specifications?",
                "options": ["Unit Testing", "Integration Testing", "System Testing", "Acceptance Testing"],
                "correctAnswer": 3
            },
            {
                "text": "Which testing technique uses valid and invalid input to check the behavior of the system?",
                "options": ["Black Box Testing", "White Box Testing", "Grey Box Testing", "Red Box Testing"],
                "correctAnswer": 0
            },
            {
                "text": "What is the purpose of regression testing?",
                "options": ["To test new features", "To ensure that recent changes haven't broken existing functionality", "To test the system's performance", "To verify the system's security"],
                "correctAnswer": 1
            }
        ]
    },
    {
        "title": "Artificial Intelligence Ethics",
        "questions": [
            {
                "text": "What is algorithmic bias in AI?",
                "options": ["A programming error", "Unfair prejudice in AI decision-making", "A type of machine learning algorithm", "A method to improve AI accuracy"],
                "correctAnswer": 1
            },
            {
                "text": "Which of the following is a key ethical concern in AI development?",
                "options": ["Making AI systems too intelligent", "Ensuring AI systems are affordable", "Protecting privacy and preventing misuse of data", "Developing AI systems that can pass the Turing test"],
                "correctAnswer": 2
            },
            {
                "text": "What does 'explainable AI' refer to?",
                "options": ["AI systems that can explain human behavior", "AI systems whose decisions can be understood and traced by humans", "AI systems that can learn from explanations", "AI systems that can explain other AI systems"],
                "correctAnswer": 1
            }
        ]
    }
]


# Quiz management endpoints

@app.on_event("startup")
async def startup_event():
    # Insert sample quizzes if the collection is empty
    if await db.quizzes.count_documents({}) == 0:
        await db.quizzes.insert_many(sample_quizzes)

@app.get("/quizzes")
@limiter.limit("20/minute")
async def get_quizzes(request: Request, current_user: User = Depends(get_current_user)):
    quizzes = await db.quizzes.find().to_list(length=100)
    return {"quizzes": quizzes}

@app.post("/quizzes")
@limiter.limit("5/minute")
async def create_quiz(request: Request, quiz: dict, current_user: User = Depends(get_current_user)):
    result = await db.quizzes.insert_one(quiz)
    return {"message": "Quiz created successfully", "id": str(result.inserted_id)}

@app.get("/quizzes/{quiz_id}")
@limiter.limit("30/minute")
async def get_quiz(request: Request, quiz_id: str, current_user: User = Depends(get_current_user)):
    quiz = await db.quizzes.find_one({"_id": ObjectId(quiz_id)})
    if quiz:
        quiz["_id"] = str(quiz["_id"])
        return quiz
    raise HTTPException(status_code=404, detail="Quiz not found")

@app.post("/quizzes/{quiz_id}/submit")
@limiter.limit("10/minute")
async def submit_quiz(request: Request, quiz_id: str, answers: list, current_user: User = Depends(get_current_user)):
    quiz = await db.quizzes.find_one({"_id": ObjectId(quiz_id)})
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    
    score = 0
    for i, answer in enumerate(answers):
        if answer == quiz["questions"][i]["correctAnswer"]:
            score += 1
    
    result = {
        "user_id": str(current_user.id),
        "quiz_id": quiz_id,
        "score": score,
        "total_questions": len(quiz["questions"]),
        "answers": answers,
        "submitted_at": datetime.utcnow()
    }
    await db.quiz_results.insert_one(result)
    return {"message": "Quiz submitted successfully", "score": score, "total_questions": len(quiz["questions"])}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)


