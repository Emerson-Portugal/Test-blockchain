// solicitar el contrato
const TaskContract = artifacts.require("TaskContract")

// Empezar la automatizacion
contract("TaskContract", () => {

  // Lo promero que vamos hacer

  before(async () => {
    this.contract = await TaskContract.deployed();
  })

  // Implementacion de los siguientes pasos 
  // OJO -> 'migrate deployed successfully' -> es solo texto -> migracion con exito 


  // Comprobar que existe una red

  it('migrate deployed successfully', async () => {
    const address = this.contract.address
    // Comprobar si valides 
    assert.notEqual(address, null);
    assert.notEqual(address, undefined);
    assert.notEqual(address, 0x0);
    assert.notEqual(address, "");
  })


  // Comprobar si existe tareas en la red

  it('get Tasks List', async () => {

    const counter = await this.contract.TaskCounter();
    const task = await this.contract.tasks(counter);

    assert.equal(task.id.toNumber(), counter);
    assert.equal(task.title, "Jose");
    assert.equal(task.description, "programador");
    assert.equal(task.done, false)
    assert.equal(counter, 1);

  })


  // Vamos a crear una tarea y saber si se ha creado correctamente


  it("task created successfully", async () => {

    const newtask = await this.contract.createTask("Oscar", "He is programming")
    const easy = await newtask.logs[0].args;
    const conter = await this.contract.TaskCounter()

    assert.equal(conter, 2)
    assert.equal(easy.id.toNumber(), 2)
    assert.equal(easy.title, "Oscar")
    assert.equal(easy.description, "He is programming")
    assert.equal(easy.done, false)

  })


  it("Done", async () => {

    const value = await this.contract.toggleDone(1)
    const easy = value.logs[0].args;
    
    assert.equal(easy.done, true)
  })
})