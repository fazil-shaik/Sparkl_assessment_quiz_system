// "use client"

// import { useState, useEffect } from "react"
// import { useRouter } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import { FloatingCursor } from "@/components/floating-cursor"
// import { quizzes, type Quiz } from "@/lib/quizData"
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"
// import { Pie } from "react-chartjs-2"

// ChartJS.register(ArcElement, Tooltip, Legend)

// export default function QuizResultsPage({
//   params,
//   searchParams,
// }: { params: { id: string }; searchParams: { answers: string } }) {
//   const router = useRouter()
//   const [quiz, setQuiz] = useState<Quiz | null>(null)
//   const [score, setScore] = useState(0)
//   const [answers, setAnswers] = useState<number[]>([])

//   useEffect(() => {
//     const foundQuiz = quizzes.find((q) => q.id === Number.parseInt(params.id))
//     if (foundQuiz) {
//       setQuiz(foundQuiz)
//       const userAnswers = searchParams.answers.split(",").map(Number)
//       setAnswers(userAnswers)
//       const calculatedScore = foundQuiz.questions.reduce((acc, question, index) => {
//         return acc + (question.correctAnswer === userAnswers[index] ? 1 : 0)
//       }, 0)
//       setScore(calculatedScore)
//     } else {
//       router.push("/dashboard")
//     }
//   }, [params.id, searchParams.answers, router])

//   if (!quiz) {
//     return <div>Loading...</div>
//   }

//   const chartData = {
//     labels: ["Correct", "Incorrect"],
//     datasets: [
//       {
//         data: [score, quiz.questions.length - score],
//         backgroundColor: ["#10B981", "#EF4444"],
//         hoverBackgroundColor: ["#059669", "#DC2626"],
//       },
//     ],
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-pink-300 to-purple-600 flex items-center justify-center">
//       <FloatingCursor />
//       <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded-lg p-8 w-full max-w-2xl">
//         <h1 className="text-3xl font-bold text-white mb-6">{quiz.title} - Results</h1>
//         <div className="mb-6">
//           <h2 className="text-2xl font-semibold text-white mb-4">
//             Your Score: {score} / {quiz.questions.length}
//           </h2>
//           <div className="w-64 h-64 mx-auto">
//             <Pie data={chartData} />
//           </div>
//         </div>
//         <div className="space-y-4">
//           {quiz.questions.map((question, index) => (
//             <div key={index} className="bg-white bg-opacity-30 backdrop-blur-lg rounded-lg p-4">
//               <p className="text-white font-semibold mb-2">{question.text}</p>
//               <p className="text-white">Your answer: {question.options[answers[index]]}</p>
//               <p
//                 className={`font-semibold ${answers[index] === question.correctAnswer ? "text-green-500" : "text-red-500"}`}
//               >
//                 {answers[index] === question.correctAnswer
//                   ? "Correct"
//                   : `Incorrect - Correct answer: ${question.options[question.correctAnswer]}`}
//               </p>
//             </div>
//           ))}
//         </div>
//         <div className="mt-6 text-center">
//           <Button onClick={() => router.push("/dashboard")} className="bg-pink-500 text-white">
//             Back to Dashboard
//           </Button>
//         </div>
//       </div>
//     </div>
//   )
// }

"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { FloatingCursor } from "@/components/floating-cursor"
import { quizzes, type Quiz } from "@/lib/quizData"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"
import { Pie } from "react-chartjs-2"

ChartJS.register(ArcElement, Tooltip, Legend)

export default function QuizResultsPage({
  params,
  searchParams,
}: { params: { id: string }; searchParams: { answers: string } }) {
  const router = useRouter()
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [score, setScore] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])

  useEffect(() => {
    const foundQuiz = quizzes.find((q) => q.id === Number.parseInt(params.id))
    if (foundQuiz) {
      setQuiz(foundQuiz)
      const userAnswers = searchParams.answers.split(",").map(Number)
      setAnswers(userAnswers)
      const calculatedScore = foundQuiz.questions.reduce((acc, question, index) => {
        return acc + (question.correctAnswer === userAnswers[index] ? 1 : 0)
      }, 0)
      setScore(calculatedScore)
    } else {
      router.push("/dashboard")
    }
  }, [params.id, searchParams.answers, router])

  if (!quiz) {
    return <div>Loading...</div>
  }

  const chartData = {
    labels: ["Correct", "Incorrect"],
    datasets: [
      {
        data: [score, quiz.questions.length - score],
        backgroundColor: ["#10B981", "#EF4444"],
        hoverBackgroundColor: ["#059669", "#DC2626"],
      },
    ],
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-300 to-purple-600 flex items-center justify-center">
      <FloatingCursor />
      <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded-lg p-8 w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-white mb-6">{quiz.title} - Results</h1>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-white mb-4">
            Your Score: {score} / {quiz.questions.length}
          </h2>
          <div className="w-64 h-64 mx-auto">
            <Pie data={chartData} />
          </div>
        </div>
        <div className="space-y-4">
          {quiz.questions.map((question, index) => (
            <div key={index} className="bg-white bg-opacity-30 backdrop-blur-lg rounded-lg p-4">
              <p className="text-white font-semibold mb-2">{question.text}</p>
              <p className="text-white">Your answer: {question.options[answers[index]]}</p>
              <p
                className={`font-semibold ${answers[index] === question.correctAnswer ? "text-green-500" : "text-red-500"}`}
              >
                {answers[index] === question.correctAnswer
                  ? "Correct"
                  : `Incorrect - Correct answer: ${question.options[question.correctAnswer]}`}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-6 text-center">
          <Button onClick={() => router.push("/dashboard")} className="bg-pink-500 text-white">
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  )
}

