const App = () => {

    const [breakLength,setBreakLength] = React.useState("5");
    const [sessionLength,setSessionLength] = React.useState("25");
    const [time,setTime] = React.useState("25:00");
    const [states,setStates] = React.useState({timer:false, session:"Session", newSession: false});


    React.useEffect(() => {
        const beep = document.getElementById("beep");
    
        if (time === "00:00") {
            beep.play();
            if(states.session == "Session"){
                setStates({timer:false, session:"Break",  newSession: true});
                setTime(timeFormat(breakLength + ":00"))
            }else{
                setStates({timer:false,session:"Session", newSession: true})
                setTime(timeFormat(sessionLength + ":00"))
            }
        }
    }, [time]); 

    React.useEffect(() => {
        if(states.newSession){
            setStates(prevState => ({ ...prevState, timer:true, newSession: false }));
            timer(time, setTime);
        }
    }, [states]); 

    const handleClick = (event) => {
        const key = event.target.closest("button");
        if(key){
            if(!states.timer){
                if(key.id == "break-decrement" && parseInt(breakLength) > 1){
                    setBreakLength(parseInt(breakLength) - 1)
                }
                if(key.id == "break-increment" && parseInt(breakLength) < 60){
                    setBreakLength(parseInt(breakLength) + 1)
                }
                if(key.id == "session-decrement" && parseInt(sessionLength) > 1){
                    SessionUpdate(setSessionLength, setTime, sessionLength, "-")
                }
                if(key.id == "session-increment" && parseInt(sessionLength) < 60){
                    SessionUpdate(setSessionLength, setTime, sessionLength, "+")
                }
            }
            if(key.id == "reset"){
                clearTimeout(timeout)
                setStates(prevState => ({...prevState, timer: false , session: "Session"}));
                SessionUpdate(setSessionLength, setTime, sessionLength, "reset")
                setBreakLength("5")
                beep.pause()
                beep.currentTime = 0;
            }
            if(key.id == "start_stop"){
                console.log(time)
                if(!states.timer){
                    timer(time, setTime)
                    setStates(prevState => ({...prevState, timer: true }));
                }else{

                    clearTimeout(timeout)
                    setStates(prevState => ({...prevState, timer: false }));
                }   
            }
        }
    }

    return (
        
        <div className="container">
            <p>25 + 5 Clock</p>
            <div className="session-setup">
                <Break length={breakLength} handleClick={handleClick} />
                <Session length={sessionLength} handleClick={handleClick}/>
            </div>
            <Time time={time} session={states.session} handleClick={handleClick}/>
            <audio id="beep" src="https://res.cloudinary.com/dmf7frt4a/video/upload/v1725802385/bedside-clock-alarm-95792_twfzzi.mp3"></audio>
        </div>
    );
}

const Break = ({length, handleClick}) => (
    <div className="session">
        <span id="break-label">Break Length</span>
        <div className="control">
            <button id="break-decrement" onClick={handleClick}>
                <i className="material-icons">arrow_downward</i>
            </button>
            <span id="break-length">{length}</span>
            <button id="break-increment" onClick={handleClick}>
                <i className="material-icons">arrow_upward</i>
            </button>
        </div>
    </div>)


const Session = ({length, handleClick}) => (
    <div className="session">
        <span id="session-label">Session Length</span>
        <div className="control" >
            <button id="session-decrement" onClick={handleClick}>
                <i className="material-icons">arrow_downward</i>
            </button>
            <span id="session-length">{length}</span>
                <button id="session-increment" onClick={handleClick}>
                    <i className="material-icons">arrow_upward</i>
            </button>
            
        </div>
    </div>
)

const Time = ({time, session, handleClick}) => (
    <div className="session timer">
        <div className="time">
            <span id="timer-label">{session}</span>
            <span id="time-left">{time}</span>
        </div>
        <div className="control">
            <button id="start_stop" onClick={handleClick}>
                <i className="material-icons">play_circle</i>
                <i className="material-icons">pause_circle</i>
            </button>
            <button id="reset" onClick={handleClick}>
                <i className="material-icons">refresh</i>
            </button>
        

        </div>
    </div>
    
)
ReactDOM.render(<App />, document.getElementById("app"));

const timeFormat = (time) =>{
   let arr = time.split(":")
    return arr.map(d => {
        return d.length == 1? '0' + d: d;
    }).join(":")
}


let timeout
const timer = (time, setTime) => {
    let [min,sec] = time.split(":")
    const countDown = (m,s) => {
        s = parseInt(s)
        m = parseInt(m)
        setTime(timeFormat(`${m}:${s}`));
            if (s > 0 && m > 0) {
                timeout = setTimeout(() => {
                    s--;
                    countDown(m,s);
                }, 1000);
            } else if( s == 0 && m > 0) {
                s = 60;
                m--; 
                timeout = setTimeout(() => {
                    s--;
                    countDown(m,s);
                }, 1000);
            } else if (s > 0 && m == 0) {
                timeout = setTimeout(() => {
                    s--;
                    countDown(m,s);
                }, 1000);
            } else {
                clearTimeout(timeout);                
            }
    };
        countDown(min,sec);
}

const SessionUpdate = (setSessionLength, setTime, sessionLength, op) => {
    if (op == "reset"){
        setSessionLength("25")
        setTime("25:00")
    }else{
        setSessionLength(eval(sessionLength + op + 1))
        setTime(timeFormat(eval(sessionLength + op + 1) + ":00"))
    }

}
