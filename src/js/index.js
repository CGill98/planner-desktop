import React, {useEffect} from 'react'
import ReactDom from 'react-dom'
import MainScreen from './page-components/main-screen'
import EditScreen from './page-components/EditScreen'
import {getAllTasks} from './storage/storage.js'
import styles from './styles/App.module.css'


let GLOBAL_storedTasks = [];

const LoadScreen = ({startAsync}) => {
    console.log("Loadscreen")
    useEffect(()=>{
        startAsync()
    })
    /*
    startAsync()
        .then(()=>})*/
    return(
        <div className={styles.background}>

        </div>
    )
}

const App = () => {
    const [init, setInit] = React.useState(false)
    const [storedTasks, setStoredTasks] = React.useState([])
    const [screen, setScreen] = React.useState('MainScreen')
    const [taskToEdit, setTaskToEdit] = React.useState({})
    
    async function initialise() {
        //await clearAll()
    
        //console.log("initialise")
        GLOBAL_storedTasks = await getAllTasks()
        setInit(true)
        setStoredTasks(GLOBAL_storedTasks)
        
      }

    if (init) {
        
        switch (screen) {
            case "MainScreen":
                return <MainScreen storedTasks={GLOBAL_storedTasks} setScreen={setScreen} setTaskToEdit={setTaskToEdit}/>
            case "EditScreen":
                return <EditScreen task={taskToEdit}
                                   setScreen={setScreen}/>
        }
              
    } else {
        return(
        <LoadScreen
            startAsync={initialise}/>
        )
    }
}

ReactDom.render(
    <App/>
, document.getElementById('root'))