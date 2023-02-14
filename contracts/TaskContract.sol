// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

// Crecion del Smart Contract (TaskContract -> nombre Opcional)
contract TaskContract {

    uint256 public TaskCounter = 0;

    // Vamos a crear una tarea 

    constructor (){
        createTask("Jose", "programador");
    }

    // event -> retorno de algun objeto, de una tarea ya creada

    event TaskCreated (
        uint256 id,
        string title,
        string description,
        bool done,
        uint256 createdAt
    );

    event createdDone(
        uint256 id,
        bool done
    );




    // Declaracion de Varibles
    struct Task {
        uint256 id;
        string title;
        string description;
        bool done;
        uint256 createdAt;
    }

    // Declaracion de conjunto de Datos, que tienen un par clave valor-> Solo se puede retornar un valor a la vez

    mapping (uint256 => Task ) public tasks;
    /*
    Ejemplo [
        0:{},
        1:{},
        2:{}
    ]
    */

    // Vamos a crear funciones que interactuen con los datos 
    // string memory _title -> strinb - tipo | memory - regla | title - variable 

    // Crear Tarea 
    
    function createTask(string memory _title, string memory _description)public{
        //  block.timestamp -> retorna el tiempo de creacion 
        TaskCounter++;
        tasks[TaskCounter] = Task(TaskCounter, _title, _description, false, block.timestamp);
        // vamos  devolver lo creado
        emit TaskCreated(TaskCounter, _title, _description, false, block.timestamp);

    }

    // Funciona para actualizar los datos 

    function toggleDone(uint _id) public {
        Task memory _task = tasks[_id];
        _task.done =! _task.done;
        tasks[_id] = _task;
        emit createdDone(_id,_task.done);
    }

 


}