//####################################################################################################################
//File writing methods


const storage = {
    getItem: (key) => {
        console.log(`getting: ${key}`)
        return fetch(`http://localhost:3050/getItem/${key}`, {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit*/
            headers: {
            'Content-Type': 'application/json',
            // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        }).then(data => data) 
          .then(data => data.json())
    },
    setItem: (key, data) => {
        const item = JSON.stringify({key: key, data: data})
        fetch(`http://localhost:3050/setItem/${item}`, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit*/
            headers: {
            'Content-Type': 'application/json',
            // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        }) 
    },
    removeItem: (key) => {
        console.log("remove item called")
        console.log("removing " + key)
        fetch(`http://localhost:3050/deleteItem/${key}`, {
            method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit*/
            headers: {
            'Content-Type': 'application/json',
            // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        }).then(res => res)
    },
    getAllData: () => {
        console.log("get all data called")
        return fetch(`http://localhost:3050/getAllData`, {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit*/
            headers: {
            'Content-Type': 'application/json',
            // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        }).then(data => data) 
          .then(data => data.json())
    }
}


//####################################################################################################################
//METHODS CONVERTED FROM ASYNC
//THESE METHODS ARE FOR USE GLOBALLY
let GLOBAL_tasks = [];


const setID = async (key, id) => {
    try {
        const IDstr = id.toString() 
        console.log("IDstr: ", IDstr)
        //await AsyncStorage.setItem(key , IDstr)
        storage.setItem(key, IDstr)
    } catch (e) {
        // saving error
        console.log(e)
    }    
}

const setStartID = async (id) => {
    setID("@startID", id)
}

const setEndID = async (id) => {
    setID("@endID", id)
}

//store an object as a string, (use to store individual tasks)
const storeTask = async (task) => {
    try {
        const jsonValue = task
        console.log("jsonValue: ",typeof jsonValue)
        let key = `@task:${task.id}`
        console.log("stored key: ", key)
        //await AsyncStorage.setItem(key , jsonValue)
        console.log(jsonValue)
        storage.setItem(key, jsonValue)
        setEndID(task.id)
        //const startID = parseInt(await AsyncStorage.getItem("@startID")) 
        let startID = await storage.getItem("@startID")
        console.log(startID)
        startID = parseInt(startID.data)
        console.log(startID)
        if (isNaN(startID) || typeof startID !== "number") {
            
            setStartID(task.id)
        }

        //const i = await AsyncStorage.getItem(key)
        //const i = await storage.getItem(key)
        
        //console.log("just stored: ", i)
    } catch (e) {
        // saving error
        console.log(e)
    }
}

const clearTask = async (id) => {
    try {
        const key = `@task:${id}` 
        console.log(`key ${key}`)

        const res = await storage.removeItem(key)
        GLOBAL_tasks = GLOBAL_tasks.filter(task => task.id !== id)
        console.log(GLOBAL_tasks)
        console.log(res)
        //at this point the task is removed from the json file
        //now the start and endIDs are changed on the "frontend"
        let startID = parseInt((await storage.getItem("@startID")).data)
        let endID = parseInt((await storage.getItem("@endID")).data)
        
        if (id == startID) { //change StartID
            console.log("clearTask: id === startID ")
            console.log(`startID ${startID}, endID ${endID}`)
            for (let i = 1 + startID; i <= endID; i++) {
                let task = await storage.getItem(`@task:${i}`)
                task = task.data
                //console.log(`taskstr: ${taskstr}, `)
                if (task !== null) {
                    console.log("clearTask, id == startID: taskstr !== null")
                    //const task = JSON.parse(taskstr)
                    console.log("task:", task)
                    setStartID(task.id)
                    startID = task.id
                    break; 
                }
            }

            if (id == startID) { //set id to nan if not changed
                setStartID(NaN)
            }
        }  
        
        if (id == endID) { //change endID
            console.log("endID changing")
            for (let i = GLOBAL_tasks.length; 0 <= i; i--) {
                let task = GLOBAL_tasks[i].id
                console.log(task)
                if (task !== null) {
                    console.log(task)
                    //const task = JSON.parse(taskstr)
                    setEndID(task.id)
                    endID = task.id
                    break; 
                }
            }

            if (id == endID) {
                setEndID(NaN)
            }
        } 

      } catch(e) {
        // remove error
        console.log(e)
      }
}

  const getAllTasks = async () => {
    const data = await storage.getAllData(); // should return obj of all data
    console.log(data)
    let initTasks = []; //local list

    let tasks = data.tasks;
    console.log(tasks)
    if (tasks) {
        Object.keys(tasks).map((id) => {
            if (tasks[id].date) {
                tasks[id].date = extractDate(tasks[id].date)
            }

            if (tasks[id].time) {
                tasks[id].time = extractDate(tasks[id].time)
            }   
            console.log(tasks[id])

            initTasks.push(tasks[id])
        })
    }
    GLOBAL_tasks = initTasks;
    return initTasks;

  }

//NOTE THERE IS ARE LOCAL GET ALL TASK FUNCTIONS THAT WORK ALONG THESE
export {setStartID, setEndID, storeTask, clearTask, getAllTasks};
