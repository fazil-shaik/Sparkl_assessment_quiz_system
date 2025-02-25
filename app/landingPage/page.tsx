"use client"
import router from "next/router";
import { useRouter } from "next/navigation";
export default function LandingPage() {
    const router = useRouter();
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-pink-500 text-white px-6">
        <header className="w-full max-w-4xl flex justify-between items-center py-6">
          <h1 className="text-3xl font-bold">QuizzMaster</h1>
          <nav>
            <ul className="flex space-x-6 text-lg">
              <li><a href="#about" className="hover:underline">About</a></li>
              <li><a href="#features" className="hover:underline">Features</a></li>
              <li><a href="#contact" className="hover:underline">Contact</a></li>
            </ul>
          </nav>
        </header>
        
        <main className="flex flex-col items-center text-center mt-16">
          <h2 className="text-5xl font-extrabold mb-4">Welcome to Quizzmaster</h2>
          <p className="text-lg max-w-2xl mb-6">
            Experience the best service with our cutting-edge solutions designed just for you.
          </p>
          <a href="#get-started" className="bg-white text-pink-500 px-6 py-3 rounded-full font-semibold text-lg hover:bg-gray-200 transition" onClick={async (e) => { e.preventDefault(); router.push("/signup"); }}>
            Get Started
          </a>
        </main>
      </div>
    );
  }
  