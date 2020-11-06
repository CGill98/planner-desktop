import React, { useState } from 'react';
import styles from '../styles/App.module.css'

const makeChanges = (task, changes) => {
    const changedTask = {...task, ...changes}
    console.log(changedTask)
} 



const EditScreen = ({task}) => {
    const [taskTitle, setTaskTitle] = useState(task.title)
    const [schedule, setSchedule] = useState(-1)
    const [frr, forceReRender] = useState(true)
    const [selectedDays, setSelectedDays] = useState([])

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
                <h2 className={styles.h2}>Make the task Repeat</h2>
                <label>Repeat</label>
                <div>
                    <select id="schedule" name="schedule" size="3" value={schedule} onChange={(event)=>{
                        setSchedule(event.target.value)
                        }}>
                        <option value={0}>Weekday</option>
                        <option value={1}>Weekend</option>
                        <option value={2}>Specific Day of the Week</option>
                    </select>
                    {schedule == 2 ? <DayCheckBoxes/> : <div/>}
                </div>
                <div className={styles.addingTaskTitleContainer}>
                    <div className={styles.addingTaskText}>Change Task Title</div>
                    <input type="text" onChange={(event) => setTaskTitle(event.target.value)} className={styles.addTaskInput}
                    value={taskTitle}/>
                </div>
                <input type="submit" value="submit"/>
            </form>
        </div>
    </div>);
}

export default EditScreen;