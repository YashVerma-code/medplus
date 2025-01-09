'use client';
import { set } from 'lodash';
import Image from 'next/image';
import { useState } from 'react';
const Quiz= () => {
    const [answers, setAnswers] = useState([0,0,0,0,0,0,0,0,0,0]);
    const options=[ 
        "Not at all",
        "Several days",
        "More than half the days",
        "Nearly every day"];
    const questions=["Little interest or pleasure in doing things"," Feeling down, depressed, or hopeless", "Trouble falling or staying asleep, or sleeping too much","Feeling tired or having little energy","Poor appetite or overeating", "Feeling bad about yourself - or that you are a failure or have let yourself or your family down","Trouble concentrating on things, such as reading the newspaper or watching television", "Moving or speaking so slowly that other people could have noticed Or the opposite - being so fidgety or restless that you have been moving around a lot more than usual", "Thoughts that you would be better off dead?", "Ever thoughts hurting yourself?"]
    const [result, setResult]  = useState(0);
 
    return (
        <div>
            <header id="top" className="sticky top-0 z-10 w-full bg-white/10 shadow-md">
                    <nav className="navbar bg-white/10 ring-1 ring-black/5 backdrop-blur-md p-4">
                      <div className="container-fluid flex flex-wrap justify-between items-center max-sm:gap-5">
                        <div className="flex items-center ">
                          <Image src="/assets/images/logo-large2.png" alt="Logo" className="img-fluid" id="logo" width={100} height={100} />
                          <div className=" text-4xl md:text-5xl font-bold text-black">MEDPLUS</div>
                        </div>
                       
                            <button
                            type="button"
                            title="Login"
                            className="bg-black/90 shadow-lg hover:bg-gray-900 mr-10  text-white font-semibold rounded-lg text-xl px-6 py-2 tracking-wider text-center"
                            onClick={() => window.location.href = '/sign-in'}
                            >
                            Login
                            </button>
                      </div>
                    </nav>
                  </header>
    <div className="flex flex-col gap-7 justify-start items-start ml-10 md:ml-16 mt-10">
        {questions.map((question, qIndex) => {
            return (
                <div key={qIndex} className="flex flex-col gap-4">
                    <div className="text-2xl text-gray-600 mb-4 mt-2">{(qIndex + 1) + '.  ' + question}</div>
                    <div className="flex flex-col md:flex-row gap-4 item-start md:items-center">
                        {options.map((option, oIndex) => {
                            return (
                                <div key={oIndex} className="flex flex-col md:flex-row gap-2 item-start md:items-center">
                                    <label htmlFor={`${qIndex}-${oIndex}`} className="cursor-pointer">
                                        <input 
                                            type="radio" 
                                            id={`${qIndex}-${oIndex}`} 
                                            name={`question-${qIndex}`} 
                                            value={option} 
                                            className="hidden peer/io" 
                                            onChange={() => {
                                                const newAnswers = [...answers];
                                                newAnswers[qIndex] = oIndex;
                                                setAnswers(newAnswers);
                                            }}
                                        />
                                        <span className="peer-checked/io:bg-[#6998ff] px-5 py-2 bg-white/70 hover:bg-zinc-300 font-semibold rounded-full">{option}</span>
                                    </label>
                                </div>
                            );
                        })}
                    </div>
                </div>
            );
        })}
        <button  onClick={
            () => {
                const result = answers.reduce((acc, curr) => acc + curr, 0);
                setResult(result+1);
            }
        } className="bg-[#6998ff] self-center text-white font-semibold px-8 text-2xl py-2 rounded-full shadow-lg hover:bg-blue-700 mb-10">Get Result</button>
        {result > 0 && <div className="text-2xl text-gray-600  bg-white p-5  px-4 pr-10 md:px-8 md:rounded-3xl mb-6 -mx-12 lg:-mx-0  lg:w-8/12"><p className='font-bold mb-4'>Your score is {result}</p><p className='text-blue mt-3 font-semibold text-3xl'>About your score</p>
Each of your answers has a score of 0-3. Click “Your Answers” above to see your score for each question. Adding these up provides your Total Score.<br/>

Not at all = 0; Several days = 1; More than half the days = 2; Nearly every day = 3<br/>

<p className='text-blue font-semibold text-3xl mt-3'>Interpreting your Total Score</p>
<p className='font-bold inline'>1-4:</p> Minimal depression<br/>
<p className='font-bold inline'>5-9:</p> Mild depression<br/>
<p className='font-bold inline'>10-14:</p> Moderate depression<br/>
<p className='font-bold inline'>15-19:</p>Moderately severe depression<br/>
<p className='font-bold inline'>20-27:</p> Severe depression</div>}
    </div>
    </div>
  );
};

export default Quiz;
