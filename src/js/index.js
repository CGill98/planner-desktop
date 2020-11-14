import React from 'react'
import ReactDom from 'react-dom'
import MainScreen from './page-components/main-screen'
import EditScreen from './page-components/EditScreen'
import {getAllTasks} from './storage/storage.js'
import styles from './styles/App.module.css'

let GLOBAL_storedTasks = [];

const LoadScreen = ({startAsync, onFinish}) => {
    startAsync()
        .then(()=>{onFinish()})
    return(
        <div className={styles.background}>

        </div>
    )
}

const App = () => {
    const [init, setInit] = React.useState(false)
    const [storedTasks, setStoredTasks] = React.useState([])

    async function initialise() {
        //await clearAll()
    
        //console.log("initialise")
        GLOBAL_storedTasks = await getAllTasks()
        
      }

        {/*}
        <EditScreen task={{title:"something", id: 1, completed: false, date:false, time: false, subTasks: []}}/>
        
        */}
    if (init) {
        return(
            <MainScreen storedTasks={GLOBAL_storedTasks}/>
        )
    } else {
        return(
        <LoadScreen
            startAsync={initialise}
            onFinish={()=>{
            setStoredTasks(GLOBAL_storedTasks)
            setInit(true)}}/>
        )
    }
}

ReactDom.render(<App/>, document.getElementById('root'))