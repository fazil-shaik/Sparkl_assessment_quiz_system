export interface Question {
  id: number
  text: string
  options: string[]
  correctAnswer: number
}

export interface Quiz {
  id: number
  title: string
  questions: Question[]
}

export const quizzes: Quiz[] = [
  {
    id: 1,
    title: "Web Development Basics",
    questions: [
      { id: 1, text: "What does HTML stand for?", options: ["Hyper Text Markup Language", "High Tech Modern Language", "Hyperlink and Text Markup Language", "Home Tool Markup Language"], correctAnswer: 0 },
      { id: 2, text: "Which of the following is used for styling web pages?", options: ["HTML", "JavaScript", "CSS", "XML"], correctAnswer: 2 },
      { id: 3, text: "What is the purpose of JavaScript in web development?", options: ["To style web pages", "To create dynamic and interactive web pages", "To define the structure of web pages", "To store data on the server"], correctAnswer: 1 },
      { id: 4, text: "Which HTML tag is used to define an unordered list?", options: ["<ul>", "<ol>", "<li>", "<list>"], correctAnswer: 0 },
      { id: 5, text: "Which CSS property is used to change text color?", options: ["font-color", "text-color", "color", "background-color"], correctAnswer: 2 },
      { id: 6, text: "What does CSS stand for?", options: ["Creative Style Sheets", "Cascading Style Sheets", "Computer Style Sheets", "Colorful Style Sheets"], correctAnswer: 1 },
      { id: 7, text: "What is the default display property of a div element?", options: ["inline", "block", "inline-block", "flex"], correctAnswer: 1 },
      { id: 8, text: "Which HTML tag is used to create a hyperlink?", options: ["<a>", "<link>", "<href>", "<url>"], correctAnswer: 0 },
      { id: 9, text: "Which JavaScript method is used to select an HTML element?", options: ["getElementById", "querySelector", "getElementsByClassName", "All of the above"], correctAnswer: 3 },
      { id: 10, text: "What is the purpose of the 'alt' attribute in an image tag?", options: ["To provide alternate text for an image", "To change the image size", "To set image alignment", "To link an image to another page"], correctAnswer: 0 },
      { id: 11, text: "What does JSX stand for in React?", options: ["JavaScript XML", "JavaScript Extension", "Java Syntax Extension", "JavaScript XHTML"], correctAnswer: 0 },
      { id: 12, text: "What is the purpose of useState in React?", options: ["To manage component state", "To handle events", "To fetch data", "To define styles"], correctAnswer: 0 },
      { id: 13, text: "Which function is used to render components in React?", options: ["render()", "ReactDOM.render()", "React.renderComponent()", "React.mount()"], correctAnswer: 1 },
      { id: 14, text: "What is Node.js primarily used for?", options: ["Frontend development", "Server-side scripting", "Database management", "Game development"], correctAnswer: 1 },
      { id: 15, text: "Which module is used to create an HTTP server in Node.js?", options: ["fs", "http", "url", "express"], correctAnswer: 1 },
      { id: 16, text: "What is the purpose of Express.js?", options: ["To manage databases", "To build APIs and web applications", "To handle file uploads", "To perform computations"], correctAnswer: 1 },
      { id: 17, text: "Which command initializes a new Node.js project?", options: ["npm init", "node init", "npm start", "node create"], correctAnswer: 0 },
      { id: 18, text: "Which lifecycle method is invoked after a React component is mounted?", options: ["componentDidUpdate", "componentDidMount", "componentWillMount", "useEffect"], correctAnswer: 1 },
      { id: 19, text: "How do you pass data to a React component?", options: ["Using state", "Using props", "Using context", "Using Redux"], correctAnswer: 1 },
      { id: 20, text: "Which database is commonly used with Node.js?", options: ["MongoDB", "MySQL", "PostgreSQL", "All of the above"], correctAnswer: 3 }
    ]
  },
  {
    id: 2,
    title: "React Fundamentals",
    questions: [
      { id: 1, text: "What is a React component?", options: ["A JavaScript function", "A CSS class", "An HTML element", "A database table"], correctAnswer: 0 },
      { id: 2, text: "What is the purpose of state in React?", options: ["To store static data", "To handle user input", "To manage and update component data", "To define component structure"], correctAnswer: 2 },
      { id: 3, text: "What is JSX?", options: ["A JavaScript library", "A syntax extension for JavaScript", "A new programming language", "A database query language"], correctAnswer: 1 },
      { id: 4, text: "What is the purpose of props in React?", options: ["To manage component state", "To pass data to components", "To handle events", "To define styles"], correctAnswer: 1 },
      { id: 5, text: "Which method is used to create a new React component?", options: ["React.createComponent()", "React.createElement()", "React.newComponent()", "React.newElement()"], correctAnswer: 1 },
      { id: 6, text: "What is the purpose of useEffect in React?", options: ["To manage component state", "To handle side effects", "To fetch data", "To define styles"], correctAnswer: 1 },
      { id: 7, text: "What is the virtual DOM in React?", options: ["A real DOM", "A copy of the real DOM", "A lightweight representation of the real DOM", "A new programming language"], correctAnswer: 2 },
      { id: 8, text: "How do you handle events in React?", options: ["Using event listeners", "Using event handlers", "Using event props", "Using event state"], correctAnswer: 1 },
      { id: 9, text: "What is the purpose of React Router?", options: ["To manage component state", "To handle routing in React applications", "To fetch data", "To define styles"], correctAnswer: 1 },
      { id: 10, text: "What is the purpose of Redux in React?", options: ["To manage component state", "To handle routing", "To manage application state", "To define styles"], correctAnswer: 2 },
      { id: 11, text: "What is a higher-order component in React?", options: ["A component that renders another component", "A component that manages state", "A component that handles events", "A component that defines styles"], correctAnswer: 0 },
      { id: 12, text: "What is the purpose of the render method in React?", options: ["To create a new component", "To render a component to the DOM", "To manage component state", "To handle events"], correctAnswer: 1 },
      { id: 13, text: "What is the purpose of the componentDidMount lifecycle method in React?", options: ["To handle side effects", "To fetch data", "To perform actions after the component is mounted", "To define styles"], correctAnswer: 2 },
      { id: 14, text: "What is the purpose of the componentDidUpdate lifecycle method in React?", options: ["To handle side effects", "To fetch data", "To perform actions after the component is updated", "To define styles"], correctAnswer: 2 },
      { id: 15, text: "What is the purpose of the componentWillUnmount lifecycle method in React?", options: ["To handle side effects", "To fetch data", "To perform actions before the component is unmounted", "To define styles"], correctAnswer: 2 },
      { id: 16, text: "What is the purpose of the shouldComponentUpdate lifecycle method in React?", options: ["To handle side effects", "To fetch data", "To determine if the component should update", "To define styles"], correctAnswer: 2 },
      { id: 17, text: "What is the purpose of the getDerivedStateFromProps lifecycle method in React?", options: ["To handle side effects", "To fetch data", "To update state based on props", "To define styles"], correctAnswer: 2 },
      { id: 18, text: "What is the purpose of the getSnapshotBeforeUpdate lifecycle method in React?", options: ["To handle side effects", "To fetch data", "To capture some information before the DOM is updated", "To define styles"], correctAnswer: 2 },
      { id: 19, text: "What is the purpose of the useReducer hook in React?", options: ["To manage component state", "To handle side effects", "To manage complex state logic", "To define styles"], correctAnswer: 2 },
      { id: 20, text: "What is the purpose of the useContext hook in React?", options: ["To manage component state", "To handle side effects", "To access context values", "To define styles"], correctAnswer: 2 }
    ]
  }
]