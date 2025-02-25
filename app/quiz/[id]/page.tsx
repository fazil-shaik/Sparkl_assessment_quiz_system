// "use client"

// import { useState, useEffect } from "react"
// import { useRouter } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import { FloatingCursor } from "@/components/floating-cursor"

// interface Question {
//   text: string
//   options: string[]
//   correctAnswer: number
// }

// interface Quiz {
//   _id: string
//   title: string
//   questions: Question[]
// }

// export default function QuizPage({ params }: { params: { id: string } }) {
//   const router = useRouter()
//   const [quiz, setQuiz] = useState<Quiz | null>(null)
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
//   const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])
//   const [quizCompleted, setQuizCompleted] = useState(false)

//   useEffect(() => {
//     const fetchQuiz = async () => {
//       const token = localStorage.getItem("token")
//       if (!token) {
//         router.push("/login")
//         return
//       }

//       try {
//         const response = await fetch(`http://localhost:8000/quizzes/${params.id}`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         })

//         if (response.ok) {
//           const quizData = await response.json()
//           setQuiz(quizData)
//           setSelectedAnswers(new Array(quizData.questions.length).fill(-1))
//         } else {
//           router.push("/dashboard")
//         }
//       } catch (error) {
//         console.error("Error fetching quiz:", error)
//         router.push("/dashboard")
//       }
//     }

//     fetchQuiz()
//   }, [params.id, router])

//   const handleAnswerSelect = (answerIndex: number) => {
//     const newSelectedAnswers = [...selectedAnswers]
//     newSelectedAnswers[currentQuestionIndex] = answerIndex
//     setSelectedAnswers(newSelectedAnswers)
//   }

//   const handleNextQuestion = () => {
//     if (currentQuestionIndex < quiz!.questions.length - 1) {
//       setCurrentQuestionIndex(currentQuestionIndex + 1)
//     } else {
//       setQuizCompleted(true)
//     }
//   }

//   const handlePreviousQuestion = () => {
//     if (currentQuestionIndex > 0) {
//       setCurrentQuestionIndex(currentQuestionIndex - 1)
//     }
//   }

//   const handleSubmitQuiz = async () => {
//     const token = localStorage.getItem("token")
//     if (!token) {
//       router.push("/login")
//       return
//     }

//     try {
//       const response = await fetch(`http://localhost:8000/quizzes/${params.id}/submit`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ answers: selectedAnswers }),
//       })

//       if (response.ok) {
//         const result = await response.json()
//         router.push(`/quiz/${params.id}/results?score=${result.score}&total=${result.total_questions}`)
//       } else {
//         console.error("Error submitting quiz")
//       }
//     } catch (error) {
//       console.error("Error submitting quiz:", error)
//     }
//   }

//   if (!quiz) {
//     return <div>Loading...</div>
//   }

//   const currentQuestion: Question = quiz.questions[currentQuestionIndex]

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-pink-300 to-purple-600 flex items-center justify-center">
//       <FloatingCursor />
//       <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded-lg p-8 w-full max-w-2xl">
//         <h1 className="text-3xl font-bold text-white mb-6">{quiz.title}</h1>
//         {!quizCompleted ? (
//           <>
//             <div className="mb-6">
//               <h2 className="text-xl font-semibold text-white mb-4">
//                 Question {currentQuestionIndex + 1} of {quiz.questions.length}
//               </h2>
//               <p className="text-white text-lg mb-4">{currentQuestion.text}</p>
//               <div className="space-y-2">
//                 {currentQuestion.options.map((option, index) => (
//                   <Button
//                     key={index}
//                     onClick={() => handleAnswerSelect(index)}
//                     className={`w-full justify-start ${
//                       selectedAnswers[currentQuestionIndex] === index
//                         ? "bg-pink-500 text-white"
//                         : "bg-white text-pink-600"
//                     }`}
//                   >
//                     {option}
//                   </Button>
//                 ))}
//               </div>
//             </div>
//             <div className="flex justify-between">
//               <Button
//                 onClick={handlePreviousQuestion}
//                 disabled={currentQuestionIndex === 0}
//                 className="bg-pink-500 text-white"
//               >
//                 Previous
//               </Button>
//               <Button onClick={handleNextQuestion} className="bg-pink-500 text-white">
//                 {currentQuestionIndex === quiz.questions.length - 1 ? "Finish" : "Next"}
//               </Button>
//             </div>
//           </>
//         ) : (
//           <div className="text-center">
//             <h2 className="text-2xl font-semibold text-white mb-4">Quiz Completed!</h2>
//             <Button onClick={handleSubmitQuiz} className="bg-pink-500 text-white">
//               Submit Quiz
//             </Button>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { FloatingCursor } from "@/components/floating-cursor"
import { quizzes, type Quiz, type Question } from "@/lib/quizData"

export default function QuizPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])
  const [quizCompleted, setQuizCompleted] = useState(false)

  useEffect(() => {
    const foundQuiz = quizzes.find((q) => q.id === Number.parseInt(params.id))
    if (foundQuiz) {
      setQuiz(foundQuiz)
      setSelectedAnswers(new Array(foundQuiz.questions.length).fill(-1))
    } else {
      router.push("/dashboard")
    }
  }, [params.id, router])

  const handleAnswerSelect = (answerIndex: number) => {
    const newSelectedAnswers = [...selectedAnswers]
    newSelectedAnswers[currentQuestionIndex] = answerIndex
    setSelectedAnswers(newSelectedAnswers)
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz!.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      setQuizCompleted(true)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleSubmitQuiz = () => {
    router.push(`/quiz/${params.id}/results?answers=${selectedAnswers.join(",")}`)
  }

  if (!quiz) {
    return <div>Loading...</div>
  }

  const currentQuestion: Question = quiz.questions[currentQuestionIndex]

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-300 to-purple-600 flex items-center justify-center">
      <FloatingCursor />
      <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded-lg p-8 w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-white mb-6">{quiz.title}</h1>
        {!quizCompleted ? (
          <>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                Question {currentQuestionIndex + 1} of {quiz.questions.length}
              </h2>
              <p className="text-white text-lg mb-4">{currentQuestion.text}</p>
              <div className="space-y-2">
                {currentQuestion.options.map((option, index) => (
                  <Button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    className={`w-full justify-start ${
                      selectedAnswers[currentQuestionIndex] === index
                        ? "bg-pink-500 text-white"
                        : "bg-white text-pink-600"
                    }`}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex justify-between">
              <Button
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
                className="bg-pink-500 text-white"
              >
                Previous
              </Button>
              <Button onClick={handleNextQuestion} className="bg-pink-500 text-white">
                {currentQuestionIndex === quiz.questions.length - 1 ? "Finish" : "Next"}
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-white mb-4">Quiz Completed!</h2>
            <Button onClick={handleSubmitQuiz} className="bg-pink-500 text-white">
              View Results
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

