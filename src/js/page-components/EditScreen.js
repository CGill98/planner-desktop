import React, { useState } from 'react';
import styles from '../styles/App.module.css'

const makeChanges = (task, changes) => {
    const changedTask = {...task, ...changes}
    console.log(changedTask)
} 
function timeToString(time) {
    if (time) { //if date has been set
        //console.log(time)
        let timeString = typeof time === "string" ? time : time.toLocaleTimeString('en-US').substring(0, 5)
        return timeString
    }
    else {
        return ""
    }
}

function dateToString(date) {
    if (date) { //if date has been set
        //console.log(date)
        let dateString = typeof date === "string" ? date : date.toLocaleDateString()
        return dateString
    }
    else {
        return ""
    }
}



const EditScreen = ({task}) => {
    const [taskTitle, setTaskTitle] = useState(task.title)
    const [schedule, setSchedule] = useState(-1)
    const [frr, forceReRender] = useState(true)
    const [selectedDays, setSelectedDays] = useState([])
    const [taskDate, setTaskDate] = React.useState(task.date)
    const [taskTime, setTaskTime] = React.useState(task.time)
    const [addingTaskTime, setAddingTaskTime] = React.useState(taskTime !== false ? timeToString(taskTime) : "Time")
    const [addingTaskDate, setAddingTaskDate] = React.useState(taskDate !== false ? dateToString(taskDate) : "Date")

    const DayCheckBoxes = () => {
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thusday', 'Friday', 'Saturday', 'Sunday']
        let i = 0;
        return( 
        <select multiple={true} value={selectedDays} size="7" onChange={(event) => {
                console.log(event.target.value)
                let tempDays = selectedDays;
                console.log(selectedDays.filter((day) => day == event.target.value))
                if (selectedDays.includes(event.target.value)) {
                    console.log("if")
                    tempDays = tempDays.filter((day) => day != event.target.value)
                } else {
                    console.log("else")
                    tempDays.push(event.target.value)
                }
                setSelectedDays(tempDays)
                console.log(selectedDays)
            }}>
            {
    
            days.map((day, index) => {
                return(
                        <option type="checkbox" id={i} value={i++} key={index}>
                            {day}
                        </option>
                      )})
            }
        </select>);
    }

    return( 
    <div id="edit-screen" className={styles.background}>
        <div>
            <form onSubmit={() => makeChanges(task, {title: taskTitle, schedule: {type: schedule, days: selectedDays}})}>

                <div className={styles.addingTaskTitleContainer}>
                    <div className={styles.addingTaskText}>Change Task Title</div>
                    <input type="text" onChange={(event) => setTaskTitle(event.target.value)} className={styles.addTaskInput}
                    value={taskTitle}/>
                </div>
                <div className={styles.addingTaskDateContainer}>
                        <div className={styles.addingTaskText}>Add a completion date</div>
                        <div className={styles.addingTaskTextSmall}>(optional)</div>
                        <div className={styles.addingTaskDateInputContainer}>
                            <input type="time" value={addingTaskTime} className={styles.addingTaskDateInput}
                                data-date-format='HH-mm'
                                onChange={(event)=>{
                                console.log(event.target.value)
                                setTaskTime(event.target.value)
                                setAddingTaskTime(event.target.value)
                            }}/>

                            <input type="date" value={addingTaskDate} className={styles.addingTaskDateInput}
                                 data-date-format='yyyy-MM-dd'
                                 onChange={(event)=>{
                                    setTaskDate(event.target.value)
                                    setAddingTaskDate(event.target.value)
                                }}/>
                        </div>
                    </div>
                    <div className={styles.h2}>Make the task Repeat</div>
                
                <div className={styles.schedule}>
                    {/*<label className={styles.label}>Repetion Type</label>*/}
                    <div className={styles.scheduleSelect}>
                        <select id="schedule" name="schedule" size="3" value={schedule} onChange={(event)=>{
                            setSchedule(event.target.value)
                            console.log(schedule)
                            }}>
                            <option value={0}>Weekday</option>
                            <option value={1}>Weekend</option>
                            <option value={2}>Specific Day of the Week</option>
                        </select>
                    </div>
                    {schedule == 2 && 
                    <>
                        <div className={styles.scheduleSelect}>
                            <DayCheckBoxes/>
                        </div>
                    </>}
                </div>
                <input type="submit" value="submit" className={styles.darkButton}/>
            </form>
        </div>
    </div>);
}

export default EditScreen;