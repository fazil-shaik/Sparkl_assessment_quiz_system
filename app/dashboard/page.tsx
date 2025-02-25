// "use client"

// import { useState } from "react"
// import { useRouter } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import { FloatingCursor } from "@/components/floating-cursor"
// import { quizzes } from "@/lib/quizData"
// import Link from "next/link"

// export default function DashboardPage() {
//   const [username] = useState("us") // This would come from authentication
//   const router = useRouter()

//   const handleLogout = () => {
//     // TODO: Implement actual logout logic
//     router.push("/login")
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-pink-300 to-purple-600">
//       <FloatingCursor />
//       <header className="bg-black bg-opacity-20 backdrop-blur-lg">
//         <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Top">
//           <div className="w-full py-6 flex items-center justify-between border-b border-pink-500 lg:border-none">
//             <div className="flex items-center">
//               <a href="#">
//                 <span className="sr-only">Online Quiz System</span>
//                 <img
//                   className="h-10 w-auto"
//                   src="https://tailwindui.com/img/logos/workflow-mark.svg?color=white"
//                   alt=""
//                 />
//               </a>
//             </div>
//             <div className="ml-10 space-x-4">
//               <span className="text-black">{username}</span>
//               <Button
//                 onClick={handleLogout}
//                 className="inline-block bg-white py-2 px-4 border border-transparent rounded-md text-base font-medium text-pink-600 hover:bg-pink-50"
//               >
//                 Logout
//               </Button>
//             </div>
//           </div>
//         </nav>
//       </header>

//       <main>
//         <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
//           <div className="px-4 py-6 sm:px-0">
//             <div className="border-4 border-dashed border-gray-200 rounded-lg bg-white bg-opacity-20 backdrop-blur-lg p-4">
//               <h2 className="text-2xl font-bold text-white mb-4 bg-black-200">Available Quizzes</h2>
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                 {quizzes.map((quiz) => (
//                   <Link href={`/quiz/${quiz.id}`} key={quiz.id}>
//                     <div className="bg-white bg-opacity-30 backdrop-blur-lg rounded-lg p-4 hover:bg-opacity-40 transition-all cursor-pointer">
//                       <h3 className="text-lg font-semibold text-black">{quiz.title}</h3>
//                       <p className="text-sm text-black mt-2">{quiz.questions.length} questions</p>
//                     </div>
//                   </Link>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   )
// }


"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { FloatingCursor } from "@/components/floating-cursor"
import { quizzes } from "@/lib/quizData"
import Link from "next/link"

export default function DashboardPage() {
  const [username] = useState("us") // This would come from authentication
  const router = useRouter()

  const handleLogout = () => {
    // TODO: Implement actual logout logic
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-300 to-purple-600">
      <FloatingCursor />
      <header className="bg-black bg-opacity-20 backdrop-blur-lg">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Top">
          <div className="w-full py-6 flex items-center justify-between border-b border-pink-500 lg:border-none">
            <div className="flex items-center">
              <a href="#">
                <span className="sr-only">Online Quiz System</span>
                <img
                  className="h-10 w-auto"
                  src="https://tailwindui.com/img/logos/workflow-mark.svg?color=white"
                  alt=""
                />
              </a>
            </div>
            <div className="ml-10 space-x-4">
              <span className="text-white font-medium">{username}</span>
              <Button
                onClick={handleLogout}
                className="inline-block bg-white py-2 px-4 border border-transparent rounded-md text-base font-medium text-pink-600 hover:bg-pink-50"
              >
                Logout
              </Button>
            </div>
          </div>
        </nav>
      </header>

      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 rounded-lg bg-white bg-opacity-20 backdrop-blur-lg p-4">
              <h2 className="text-2xl font-bold text-black mb-4">Available Quizzes</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {quizzes.map((quiz) => (
                  <Link href={`/quiz/${quiz.id}`} key={quiz.id}>
                    <div className="bg-white bg-opacity-30 backdrop-blur-lg rounded-lg p-4 hover:bg-opacity-40 transition-all cursor-pointer">
                      <h3 className="text-lg font-semibold text-black">{quiz.title}</h3>
                      <p className="text-sm text-black mt-2">{quiz.questions.length} questions</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}