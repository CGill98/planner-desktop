import React, {useEffect} from 'react'
import ReactDom from 'react-dom'
import MainScreen from './page-components/main-screen'
import EditScreen from './page-components/EditScreen'
import {getAllTasks} from './storage/storage.js'
import styles from './styles/App.module.css'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    BrowserRouter
  } from "react-router-dom";


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

    
    async function initialise() {
        //await clearAll()
    
        //console.log("initialise")
        GLOBAL_storedTasks = await getAllTasks()
        setInit(true)
        setStoredTasks(GLOBAL_storedTasks)
        
      }

        {/*}
        <EditScreen task={{title:"something", id: 1, completed: false, date:false, time: false, subTasks: []}}/>
        
        */}


    if (init) {
        return(
            <Router>
                <Switch>
                    <Route path="/">
                        <MainScreen storedTasks={GLOBAL_storedTasks}/>
                    </Route>
                    <Route path="/EditScreen">
                        <EditScreen task={{title:"something", id: 1, completed: false, date:false, time: false, subTasks: []}}/>
                    </Route>
                </Switch>
            </Router>
        )
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