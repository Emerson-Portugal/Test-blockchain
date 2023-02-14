App = {

    contracts: {},

    init:async () =>  {
        console.log("Loaded")
        await App.loadEthereum()
        await App.loadAccount()
        await App.loadCotracts()
        App.render()
        await App.renderTask()
    },

    // Comprobar si existe Metamax
    loadEthereum: async () =>{
        if(window.ethereum){
            App.web3Provider = window.ethereum
            await window.ethereum.request({ method: 'eth_requestAccounts' });
        }
        else{
            console.log('No ethereum browser')
        }
    },

    // Validamos nuestra billetera 
    loadAccount: async () =>{
        const account= await window.ethereum.request({ method: 'eth_requestAccounts' });
        App.account = account[0]
    },

    // cargamos la blockchain
    loadCotracts: async () =>{
        // Hemos Traido el JSOM
        const res = await fetch("TaskContract.json")
        const tasksJSON = await res.json()

        // Hemos convertido el JSOM con truffle
        App.contracts.taskContract = TruffleContract(tasksJSON)

        // Hemos conectado ese JSOM a metamask
        App.contracts.taskContract.setProvider(App.web3Provider)

        // Vamos a desplegar 
        App.taskContract = await App.contracts.taskContract.deployed()

    },

    // Traer la direccion de la billetera 
    render:() => {
        document.getElementById('account').innerHTML = App.account

    },

    // Tenderidar cada Tarea
    renderTask: async () =>{
        const counter = await App.taskContract.TaskCounter()
        const counterfinal = await counter.toNumber()
        
        html = ""

        for( let i = 1; i<= counterfinal; i++){
            const task = await App.taskContract.tasks(i)
            
            const taskId = task[0]
            const taskTitle = task[1]
            const taskDescription = task[2]
            const taskDone = task[3]
            const taskCreated = task[4]

            let taskElement = `
                <div class="card bg-dark rounded-0 mb-2"> 
                    <div class = "card-header d-flex justify-content-between align-items-center">
                        <span>${taskTitle}</span> 

                        <div class="form-check form-switch">
                            <input class="form-check-input" data-id="${taskId}" type="checkbox" ${taskDone && "checked"} 
                            onchange = "App.toggleDone(this)"
                            />
                        </div>

                    </div>

                    <div class = "card-body"> 
                        <span>${taskDescription}</span>
                        <p class="text-muted"> Task was created ${new Date (taskCreated*1000).toLocaleString()}</p>
                    </div>

                </div>
            
            `
            html += taskElement
        }

        document.querySelector("#taskList").innerHTML = html
    },


    // Crea  una tarea 
    createTask: async(title, description) =>{
        const result = await App.taskContract.createTask(title,description, {
            from: App.account
        })
        console.log(result.logs[0].args)
    },


    toggleDone: async(element)=>{

        const taskId = element.dataset.id

        await App.taskContract.toggleDone(taskId, {
            from: App.account
        })

        window.location.reload()

    }





}

App.init()