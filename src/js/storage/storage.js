//####################################################################################################################
//File writing methods


const storage = {
    getItem: (key) => {
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
        }) 
    },
    getAllData: () => {
        return fetch(`http://localhost:3050/getAlldata`, {
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
        const startID = parseInt(await storage.getItem("@startID")) 
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
        console.log("key ", key)
        //await AsyncStorage.removeItem(key)
        storage.removeItem(key)
        //let startID = parseInt(await AsyncStorage.getItem("@startID"))
        //let endID = parseInt(await AsyncStorage.getItem("@endID"))
        let startID = parseInt(await storage.getItem("@startID"))
        let endID = parseInt(await storage.getItem("@endID"))

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
            for (let i = endID - 1; startID <= i; i--) {
                let task = await storage.getItem(`@task:${i}`)
                task = task.data
                if (task !== null) {
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
/*
const getAllTasks = async () => {
    console.log("getAllTasksCalled")
    try {
        let startID = parseInt((await storage.getItem('@startID')).data)
        let endID = parseInt((await storage.getItem('@endID')).data)
        let initTasks = []; //local list
        console.log(startID)
        console.log(endID)
        if (typeof startID !== "number") {
            setStartID(0)
        } else {
            if (typeof endID !== "number") {
                setEndID(0)
            } else {
  
                console.log("start-end ids: ", startID, endID)
                
                for (let i = startID; i <= endID; i++) {
                    console.log(`@task:${i}`)
                    
                    try {
                        let key = `@task:${i}`
                        let jsonValue = await storage.getItem(key)
                        jsonValue = jsonValue.data
                        console.log("jsonvalue retrieved", jsonValue)
  
                        if (typeof jsonValue === "object" && jsonValue != null) { 
                            console.log("jsonValue: ", jsonValue)
                            if (jsonValue.date !== false) {
                              jsonValue.date = extractDate(jsonValue.date)
                            }
  
                            if (jsonValue.time !== false) {
                              jsonValue.time = extractDate(jsonValue.time)
                            }
  
                            initTasks.push(jsonValue)
                        }
  
                    } catch(e) {
                        console.log(e)
                    }
                    
                }
  
                return initTasks;
            }
            
          }
  
    } catch(e) {
        // error reading value
        console.log(e)
        return []
    }
  }*/
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
    
    return initTasks;

  }

//NOTE THERE IS ARE LOCAL GET ALL TASK FUNCTIONS THAT WORK ALONG THESE
export {setStartID, setEndID, storeTask, clearTask, getAllTasks};
