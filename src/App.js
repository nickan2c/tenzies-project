import React from "react"
import Die from "./components/Die"
import {nanoid} from "nanoid"
import Confetti from "react-confetti"

export default function App() {

    const [dice, setDice] = React.useState(allNewDice())
    const [tenzies, setTenzies] = React.useState(false)
    const [time,setTime] = React.useState(0)
    const [start,setStart] = React.useState(new Date())

    /*React.useEffect(() => {
        const allHeld = dice.every(die => die.isHeld)
        const firstValue = dice[0].value
        const allSameValue = dice.every(die => die.value === firstValue)
        if (allHeld && allSameValue) {
            console.log("You won!")
        }
        
    }, [dice])*/

    
    React.useEffect(() => {
        const first = dice[0].value
        const filtered= dice.filter(die => die.value!==first)
        const notHeld = dice.filter(die=>die.isHeld===false).map(die=> die.isHeld)

        // if one dice is held, then set start to a new time.
        if (notHeld.length===9){
            setStart(new Date())
        }
        if (notHeld.length===8){
            var end = new Date()
            var timeTaken= ((end.getTime() - start.getTime())/1000)

            setTime(timeTaken)
            setTenzies(true)

            // not sure how to make it work
            // localStorage.setItem("recentTime", String(timeTaken))
            // if (timeTaken < localStorage.getItem("lowestTime")){
            //     localStorage.setItem("lowestTime", String(timeTaken))
            // }
        }



    }, [dice])
    

    function generateNewDie() {
        return {
            value: Math.ceil(Math.random() * 6),
            isHeld: false,
            id: nanoid()
        }
    }
    
    function allNewDice() {
        const newDice = []
        for (let i = 0; i < 10; i++) {
            newDice.push(generateNewDie())
        }
        return newDice
    }
    
    function rollDice() {
        if (tenzies){
            setDice(allNewDice())
            setTenzies(false)
        }
        else
        {     
            setDice(oldDice => oldDice.map(die => {
            return die.isHeld ? 
                die :
                generateNewDie()
        }))}
        }
    
    function holdDice(id) {
        setDice(oldDice => oldDice.map(die => {
            return die.id === id ? 
                {...die, isHeld: !die.isHeld} :
                die
        }))
    }
    
    const diceElements = dice.map(die => (
        <Die 
            key={die.id} 
            value={die.value} 
            isHeld={die.isHeld} 
            holdDice={() => holdDice(die.id)}
        />
    ))
    
    return (
        <main>
            {tenzies && <Confetti />}
            <h1 className="title">Tenzies</h1>
            <p className="instructions">Roll until all dice are the same. 
            Click each die to freeze it at its current value between rolls.</p>
            <div className="dice-container">
                {diceElements}
            </div>
            {tenzies && (<div>
                <h4>That took you {time} seconds!</h4>
                {/* not sure how to fix
                <h5>Your previous time: {localStorage.getItem("recentTime")}</h5>
                <h5>Your best time: {localStorage.getItem("lowestTime")}</h5> */}

                </div>
                            
            )}
            <button 
                className="roll-dice" 
                onClick={rollDice}
            >
                {tenzies ? "New Game" : "Roll"}
            </button>
        </main>
    )
}