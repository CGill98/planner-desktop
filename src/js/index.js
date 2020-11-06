import React from 'react'
import ReactDom from 'react-dom'
import MainScreen from './page-components/main-screen'
import EditScreen from './page-components/EditScreen'

const App = () => {
        {/*}
        <EditScreen task={{title:"something", id: 1, completed: false, date:false, time: false, subTasks: []}}/>
        
        */}

    return(
        <MainScreen storedTasks={[{title:"science homework", id: 1, completed: false, date:false, time: false, subTasks: []}]}/>
    )
}

ReactDom.render(<App/>, document.getElementById('root'))