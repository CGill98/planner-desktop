import React, { useState } from 'react';
import styles from '../styles/App.module.css'
//import {write} from '../storage/storage'
//import {div, StyleSheet, div, Div, Button, FlatList, divInput, div, Scrolldiv} from 'react-native';
//import CheckBox from '@react-native-community/checkbox';
//import DateTimePicker from '@react-native-community/datetimepicker';
//import {styles, addingTaskSection} from "../assets/styles.js"
//import { AdMobBanner, PublisherBanner, setTestDeviceIDAsync } from 'expo-ads-admob';
//import AsyncStorage from '@react-native-community/async-storage'
//import {setStartID, setEndID, storeTask, clearTask} from '../global/LocalStorage.js'

//ca-app-pub-3088532579762761~4235259950 - app id
//ca-app-pub-3088532579762761/1376344086 - banner ad id
//ca-app-pub-3088532579762761~8077128583 - IOS APP ID
//ca-app-pub-3088532579762761/3946311880 - banner ad id IOS

//console.log("main screen.js")

async function testAds() {
    await setTestDeviceIDAsync('EMULATOR')

} 

const getAllTasks = async () => {
    //console.log("get all Tasks called")
    //console.log(typeof parseInt("1"))
    
    try {
        //console.log("first try block")
        let startID = parseInt(await AsyncStorage.getItem('@startID'))
        let endID = parseInt(await AsyncStorage.getItem('@endID'))
        let initTasks = []; //local list
        //console.log("startID: ", startID)
        if (typeof startID !== "number") {
            //console.log("start ID nan")
            setStartID(0)
        } else {
            if (typeof endID !== "number") {
                //console.log("end ID nan")
                setEndID(0)
            } else {
                //console.log("start ID not null")
                //console.log(startID)
                //console.log(endID)
                //console.log("state-end ids: ", startID, endID)
                
                for (let i = startID; i <= endID; i++) {
                    //console.log(`@task:${i}`)
                    
                    try {
                        let key = `@task:${i}`
                        let jsonValue = JSON.parse(await AsyncStorage.getItem(key))
                        //console.log("jsonvalue retrieved", jsonValue)

                        if (typeof jsonValue === "object" && jsonValue != null) { 
                            //console.log("jsonValue: ", jsonValue)
                            initTasks.push(jsonValue)
                        }

                    } catch(e) {
                        //console.log("b")
                        console.log(e)
                    }
                    
                }
                //console.log(initTasks)
            }
        }
        /*
        return new Promise(function(resolve, reject) { 
            if (0 < initTasks.length) {
                resolve(initTasks)
            } else {
                reject("rejected")
            }
        })*/
        return initTasks

    } catch(e) {
        // error reading value
        //console.log("a")
        console.log(e)
    }
}
  
  

function MainScreen({window, storedTasks}) {
    //testAds()  
    //setTimeout(()=>{console.log("timed out")}, 400)  
    //console.log("stored tasks ", storedTasks)
    //replace below with getalltask
    const [frr, forceReRender] = useState(true)


    const [taskList, setTaskList] = React.useState(storedTasks) //tasks stored in global map

    let MSState = new Map();
    MSState["tasks"] = [taskList, setTaskList]
    const [tasksAdded, setTasksAdded] = React.useState(0) //refreshes the flat list
    const [addingTask, setAddingTask] = React.useState(false)
    const [taskTitle, setTaskTitle] = React.useState("")
    const [showDatePicker, setShowDatePicker] = React.useState(false)
    const [showTimePicker, setShowTimePicker] = React.useState(false)
    const [taskDate, setTaskDate] = React.useState(false)
    const [taskTime, setTaskTime] = React.useState(false)
    const [editingTask, setEditingTask] = React.useState(-1) //the items id
    //console.log(`stored tasks last element: ${parseInt(storedTasks[storedTasks.length - 1].id)}`)
    const length = 0 < storedTasks.length ? parseInt(storedTasks[storedTasks.length - 1].id) : 0
    const [endID, setEndID] = React.useState(length)
    const [addTaskButtonTitle, setAddTaskButtonTitle] = React.useState("ADD TASK")
    const [addingSubTasks, setAddingSubTasks] = React.useState([])
    const [addNewSubTask, setAddNewSubTask] = React.useState(0)
    const [subTaskCheckMap, setSubTaskCheckMap] = React.useState({})
    const [addingTaskTime, setAddingTaskTime] = React.useState(taskTime !== false ? timeToString(taskTime) : "Time")
    const [addingTaskDate, setAddingTaskDate] = React.useState(taskDate !== false ? dateToString(taskDate) : "Date")
    //console.log(`type of endID: ${typeof endID}`)
    //console.log("initTasks length", initTasks.length)
    //console.log("tasklist", taskList)a
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

    const deleteTask = (task) => {
        //console.log(task.id)
        //const newList = taskList.filter(item => item.id != task.id) 
        //console.log(newList)
        //console.log("task id:", task.id)
        setTaskList(taskList.filter(item => item != task))
        //clearTask(task.id)
        //setStartID(taskList[0].id)
    }



    const EditTaskdiv = ({task}) => {
        return(
            <div>
                <div style={{margin: '5px'}} className={styles.darkButton} onClick={()=>{}}>
                    Edit Task
                </div>
                <div className={styles.darkButton} onClick={()=>deleteTask(task)}>
                    Delete Task
                </div>
            </div>)
    }

    const SubTask = ({item}) => {
        return (
        <div className={{flexDirection: "row", alignItems: "center"}}>
            <div className={styles.extraDesc}>{item.str}</div>
            <CheckBox 
            disabled={false}
            value={subTaskCheckMap[item.id]} 
            onChange={
                () => {
                    //console.log("change")
                    //console.log(subTaskCheckMap)
                    let newVal = !subTaskCheckMap[item.id]
                    let newSubTaskCheckMap = subTaskCheckMap
                    newSubTaskCheckMap[item.id] = newVal
                    //console.log(newSubTaskCheckMap)
                    setSubTaskCheckMap(newSubTaskCheckMap)
                }
            }/>
        </div>)
}

    const SubTaskSection = ({item}) => {
        /*
        let subTasks = []
        for (let i =  0; i < item.subTasks.length; i++) {
            subTasks.push({subTask: item.subTasks[i], id: subTaskObjIndex++})
        }*/
        const subTasks = item.subTasks
        //console.log(subTasks)
        if (subTasks != []) {
            return subTasks.map((subtask, key) => {
                <SubTask item={subtask} key={key}/>
            })
        }
        else {
            return <div/>
        }
    }

    const Task = ({item}) => {
        console.log(item)
        return(
                <div className={item.completed ? styles.taskCompleted : styles.task} >
                    <div>
                        <div className={styles.taskTitle} onClick={() => setEditingTask( (editingTask == item.id) ? -1 : item.id )}>
                            {item.title}    
                        </div>
                        <div className={styles.darkButton} onClick={()=> {setTaskCompleted(item)
                                            forceReRender(!frr)}}>
                            Completed    
                        </div>
                    </div>
                    <SubTaskSection item={item}/>
                    {(item.date != false) ? <div className={styles.extraDesc}>{"Due date: " + dateToString(item.date)}</div> : <div/>}
                    {(item.time != false) ? <div className={styles.extraDesc}>{"Due date: " + timeToString(item.time)}</div> : <div/>}
                    {(editingTask == item.id) ? <EditTaskdiv task={item}/> : <div/>}
                </div>)
    }

    const AddingSubTask= ({item}) => {
        return(
            <div className={{height:"10%", background: "white", borderRadius: 4, margin: 2}}>
                <div>{item.str}</div>
            </div>
        )
    }

    const addTask = () => {
        let newTaskList = taskList
        //console.log(`endID: ${endID}`)
        
        //console.log(`after endID: ${endID}`)
        let newTask = {id: endID + 1, title: taskTitle, subTasks: addingSubTasks, date: taskDate, time: taskTime}
        
        newTaskList.push(newTask)
        setTaskList(newTaskList)
        //storeTask(newTask)
        setEndID(endID + 1)    
        setTasksAdded(tasksAdded + 1)
        setAddingTask(false)

        //add subtask to subtask check map
        let newSubTaskCheckMap = subTaskCheckMap
        for (let i = 0; i < addingSubTasks.length; i++) {
            newSubTaskCheckMap[addingSubTasks[i].id] = false
        }
        setSubTaskCheckMap(newSubTaskCheckMap)
        setAddingSubTasks([])
        setTaskDate(false)
        setTaskTime(false)
        setAddTaskButtonTitle("ADD TASK")
       
    }

    const setTaskCompleted = (task) => {
        console.log("setTaskCompleted")
        let newTaskList = taskList
        //console.log(`endID: ${endID}`)
        
        //console.log(`after endID: ${endID}`)

        for (let i = 0; i < newTaskList.length; i++) {
            if (task.id === newTaskList[i].id) {
                console.log(newTaskList[i].completed)
                newTaskList[i].completed = !(newTaskList[i].completed) 
            }
        }
        
        setTaskList(newTaskList)
        
        /*
        setSubTaskCheckMap(newSubTaskCheckMap)
        setAddingSubTasks([])
        setTaskDate(false)
        setTaskTime(false)
        setAddTaskButtonTitle("ADD TASK")*/
       
    }
    
    const pickTime = (event, time) => {
        setShowTimePicker(false)
        setTaskTime(time)   
    }

    const pickDate = (event, date) => {
        setShowDatePicker(false)
        setTaskDate(date)
        
    }
    /*
    const TimePickerdiv = () => {
        if (showTimePicker) {
            return( 
                    <DateTimePicker
                    onChange={pickTime}
                    mode="time"
                    display="clock"
                    value={new Date()}/>
                )
        }
        else {
            return(<div/>)
        }
    }
    /*
    const DatePickerdiv = () => {
        if (showDatePicker) {
            return( 
                    <DateTimePicker
                    onChange={pickDate}
                    value={new Date()}/>
                )
        }
        else {
            return(<div/>)
        }
    }*/

    const AddTaskSection = (props) => {
        //set the props height
        if (addingTask) {
            return(
                <div id="adding-task-section" className={styles.addingTaskSection}>
                    <div className={styles.addingTaskTitleContainer}>
                        <div className={styles.addingTaskText}>Task Title</div>
                        <input type="text" onChange={(event) => setTaskTitle(event.target.value)} className={styles.addTaskInput}/>
                    </div>
                    {/*
                    <div className={{height:"30%", justifyContent:"center", alignItems:"center"}}>
                        <Button title="Add SUBTASK" 
                                color="black"
                        onClick={()=>{
                            let newAddingSubTasks = addingSubTasks
                            subTaskCount = 1 + subTaskCount
                            console.log("subtaskcount: ")
                            console.log(subTaskCount)
                            newAddingSubTasks.push({str: taskdiv, id: subTaskCount})
                            setAddingSubTasks(newAddingSubTasks)
                            setAddNewSubTask(newAddingSubTasks.length)
                        }}/>
                        <divInput onChangediv={(text) => setTaskdiv(text)} className={styles.addTaskInput}/>
                        <FlatList
                            data={addingSubTasks}
                            renderItem={AddingSubTask}
                            keyExtractor={item => `${item.id}`}
                            extraData={addNewSubTask}/>
                    </div>
                    */}
                    <div className={styles.addingTaskDateContainer}>
                        <div className={styles.addingTaskText}>Add a completion date</div>
                        <div className={styles.addingTaskTextSmall}>(optional)</div>
                        <div className={styles.addingTaskDateInputContainer}>
                            <input type="time" value={addingTaskTime} className={styles.addingTaskDateInput}
                                data-date-format='HH-mm'
                                onChange={(event)=>{
                                setAddingTaskTime(event.target.value)
                            }}/>

                            <input type="date" value={addingTaskDate} className={styles.addingTaskDateInput}
                                 data-date-format='yyyy-MM-dd'
                                 onChange={(event)=>{
                                    setAddingTaskDate(event.target.value)
                                }}/>
                        </div>
                    </div>
                    {/*TimePickerdiv()*/}
                    {/*DatePickerdiv()*/}
                    <div className={{height:"9%"}}/>
                    <div className={styles.addTaskButton} onClick={()=>addTask()}
                     color="#091225">
                     Add Task</div>
                </div>
            )
            } else {
                return(
                    <div/>
                )
        }
    }


    return(
        <div id="main-screen" className={styles.background}>
            <div id="content" className={styles.content}>
                    
                    <div id="adding task" className={addingTask ? styles.navPanelsAdding : styles.NavPanels}>
                        <div 
                            onClick={()=> {  
                                setAddingTask(!addingTask); 
                                setAddTaskButtonTitle(!addingTask ? "UNDO" : "ADD TASK");}} 
                                className={styles.addTaskButton}>
                            {addTaskButtonTitle} 
                        </div>
                        {AddTaskSection()}
                    </div>
                    <div id="task section" className={styles.taskSection}>
                        <div className={styles.taskBox}>
                            
                            {
                            taskList.map((task, key) => {
                                return (<Task 
                                            key={key}
                                            item={task}/>)
                            })
                            }
                        </div>
                    </div>
            </div>
        </div>
    );
}

export default MainScreen;