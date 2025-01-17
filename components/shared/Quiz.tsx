"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const Quiz = () => {
  const [answers, setAnswers] = useState<number[]>(Array(10).fill(-1))
  const [result, setResult] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const router = useRouter()

  const options = [
    "Not at all",
    "Several days",
    "More than half the days",
    "Nearly every day",
  ]

  const questions = [
    "Little interest or pleasure in doing things",
    "Feeling down, depressed, or hopeless",
    "Trouble falling or staying asleep, or sleeping too much",
    "Feeling tired or having little energy",
    "Poor appetite or overeating",
    "Feeling bad about yourself - or that you are a failure or have let yourself or your family down",
    "Trouble concentrating on things, such as reading the newspaper or watching television",
    "Moving or speaking so slowly that other people could have noticed Or the opposite - being so fidgety or restless that you have been moving around a lot more than usual",
    "Thoughts that you would be better off dead?",
    "Ever thoughts of hurting yourself?",
  ]

  const handleGetResult = () => {
    if (answers.includes(-1)) {
      alert("Please answer all the questions before submitting.")
      return
    }
    const totalScore = answers.reduce((acc, curr) => acc + curr, 0)
    setResult(totalScore)
    setShowResult(true)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-10 w-full bg-white shadow-md hidden lg:block">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => router.push("/")}>
              <Image
                src="/assets/images/logo-large2.png"
                alt="MEDPLUS Logo"
                width={50}
                height={50}
              />
              <h1 className="text-2xl font-bold">MEDPLUS</h1>
            </div>
            <Button onClick={() => router.push("/sign-in")}>Login</Button>
          </div>
        </nav>
      </header>

      <main className="flex-grow flex flex-col">
        <Card className="w-full bg-inherit flex-grow overflow-hidden flex flex-col">
          <CardHeader>
            <CardTitle className="text-4xl lg:text-5xl font-bold text-center text-gray-800 tracking-widest my-4">Depression Screening Questionnaire</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow overflow-hidden">
            <ScrollArea className="h-full pr-4">
              {questions.map((question, qIndex) => (
                <div key={qIndex} className="my-14 lg:mx-10 border-b border-t border-gray-400 py-10 rounded-sm">
                  <h2 className="text-3xl text-center tracking-wider font-medium text-pretty  text-neutral-800 mx-1 mb-9 my-2 ">
                     {question}
                  </h2>
                  <RadioGroup
                    onValueChange={(value) => {
                      const newAnswers = [...answers]
                      newAnswers[qIndex] = parseInt(value)
                      setAnswers(newAnswers)
                    }}
                  >
                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 lg:gap-10 self-center lg:px-20">
                      {options.map((option, oIndex) => (
                        <Label
                          key={oIndex}
                          htmlFor={`question-${qIndex}-${oIndex}`}
                          className=" items-center md:text-center px-6 py-3 text-xl border-[5px] rounded-full cursor-pointer transition-colors duration-200 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:bg-gradient-to-r [&:has([data-state=checked])]:from-cyan-500 [&:has([data-state=checked])]:to-emerald-500 [&:has([data-state=checked])]:bg-primary/10"
                        >
                          <RadioGroupItem
                          value={oIndex.toString()}
                          id={`question-${qIndex}-${oIndex}`}
                          className="hidden"
                          />
                          <span>{option}</span>
                        </Label>
                      ))}
                    </div>
                  </RadioGroup>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>

        <div className="p-4 flex justify-center">
          <Button
            className="py-7 px-7 text-gray-100 bg-emerald-600 text-3xl font-medium tracking-wider rounded-full self-center "
            onClick={handleGetResult}
          >
            Get Result
          </Button>
        </div>

        <Dialog open={showResult} onOpenChange={setShowResult}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Your Result</DialogTitle>
              <DialogDescription>
                Depression Screening Questionnaire Score
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <h3 className="text-xl font-bold mb-4">Your score is {result}</h3>
              <p className="mb-4">
                Each of your answers has a score of 0-3. Adding these up provides your Total Score.
              </p>
              <h4 className="text-lg font-semibold mb-2">Interpreting your Total Score</h4>
              <ul className="list-disc list-inside space-y-1">
                <li><strong>1-4:</strong> Minimal depression</li>
                <li><strong>5-9:</strong> Mild depression</li>
                <li><strong>10-14:</strong> Moderate depression</li>
                <li><strong>15-19:</strong> Moderately severe depression</li>
                <li><strong>20-27:</strong> Severe depression</li>
              </ul>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}

export default Quiz

