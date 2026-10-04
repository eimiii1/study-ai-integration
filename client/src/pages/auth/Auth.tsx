import { useState } from "react"
import SignInForm from "../../components/auth/SignInForm"
import RegisterForm from "../../components/auth/RegisterForm"

type View = 'sign-in' | 'register'

const Auth = () => {
    const [isFlipped, setIsFlipped] = useState<boolean>(false)
    const [view, setView] = useState<View>('sign-in')

    return (
        <main className='min-h-screen grid lg:grid-cols-2 bg-obsidian text-bone'>
            <section className="bg-inkwell text-obsidian flex flex-col justify-center px-8 md:px-16 py-16 gap-10">
                <div className="max-w-md">
                    <h1 className="font-serif text-3xl md:text-[2.75rem] leading-[1.15] mb-4">
                        Study your own notes and quizzed back to you by AI.
                    </h1>

                    <p className="text-obsidian/70 leading-relaxed mx-w-sm">
                        Turn a deck of flashcards into a quiz in one click. Try the card below.
                    </p>
                </div>
                
                <button
                    type="button"
                    aria-label="Click to flip the flashcard"
                    onClick={() => setIsFlipped(prev => !prev)}
                    className="w-full max-w-sm aspect-4/3 text-left perspective-[1400px]"
                >
                    <div
                        className={[
                            "relative w-full h-full",
                            "transform-3d",
                            "transition-transform duration-500",
                            "ease-[cubic-bezier(.3,.9,.3,1)]",
                            isFlipped ? "transform-[rotateY(180deg)]" : "",
                        ].join(" ")}
                    >
                        <div
                            className="absolute inset-0 bg-[#F7F5EF] text-bone rounded-sm p-7 flex flex-col justify-between backface-hidden"
                        >
                            <span className="text-sm text-bone/50">
                                Question
                            </span>
                            <p className="font-serif text-xl md:text-2xl leading-snug">
                                What is a binary search tree?
                            </p>
                            <span className="text-sm text-bone/40">
                                Click to flip
                            </span>
                        </div>
                        
                        <div className="absolute inset-0 bg-gilt text-[#F7F5EF] rounded-sm p-7 flex flex-col justify-between backface-hidden transform-[rotateY(180deg)]">
                            <span className="text-sm text-[#F7F5EF]/70">
                                Answer
                            </span>
                            <p className="font-serif text-xl md:text-2xl leading-snug">
                                A tree where each node has at most two children, with left nodes smaller and right nodes larger
                            </p>
                            <span className="text-sm text-[#F7F5EF]/60">
                                Click to flip back
                            </span>
                        </div>
                    </div>
                </button>
            </section>
            
            <section className="bg-[#F7F5EF] flex items-center justify-center px-8 md:px-16 py-16">
                <div className="w-full max-w-sm">
                    {view == 'sign-in' ? (
                        <SignInForm onRegister={() => setView('register')} />
                    ) : (
                        <RegisterForm onLogin={() => setView('sign-in')} />
                    )}
                </div>
            </section>
        </main>
    )
}

export default Auth