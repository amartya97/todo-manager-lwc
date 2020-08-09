import { LightningElement, api } from 'lwc';
import updateTodo from '@salesforce/apex/ToDoController.updateTodo';
import deleteTodo from '@salesforce/apex/ToDoController.deleteTodo';

export default class ToDoItem extends LightningElement {
    //@api is a public property , helps to fetch data from parent class
    @api todoId;
    @api todoName;
    @api done=false;

    //Handler method
    updateHandler(){
        const todo ={
            todoId : this.todoId,
            todoName : this.todoName,
            done : !this.done
        }
        updateTodo({payload : JSON.stringify(todo)}).then(results =>{
                console.log("Successfully updated todos");
                const updateEvent = new CustomEvent('update');
                this.dispatchEvent(updateEvent);
        }).catch(error => {
            console.log("error in updating todos");
            console.error("Error while updating todos "+error);
            
        });
        
    }
    deleteHandler(){
        deleteTodo({todoId : this.todoId}).then(results => {
            console.log("Successfully deleted todos");
            const deleteEvent = new CustomEvent('delete');
            this.dispatchEvent(updateEvent);
            
        }).catch(error => {
            console.log("error in deleting todos");
            console.error("Error while deleting todos " +error);
            
        })
    }

    //method to get dynamic class name in templet
    get containerName(){
        return this.done ? "todo completed" : "todo upcoming";
    }
    get iconName(){
        return this.done ? "utility:check" : "utility:add";
    }
}