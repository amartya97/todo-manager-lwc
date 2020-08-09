import { LightningElement, track} from 'lwc';
import addTodo from '@salesforce/apex/ToDoController.addTodo';
import getCurrentTodos from '@salesforce/apex/ToDoController.getCurrentTodos';
import updateTodo from '@salesforce/apex/ToDoController.updateTodo';
import deleteTodo from '@salesforce/apex/ToDoController.deleteTodo';


export default class ToDoManager extends LightningElement {
    //track decorator used to make one way data binding
    //hence when the value of the variable changes ui will change
    @track time="12:44 AM";
    @track greetings="Good Evening";   
    @track todos=[];

    connectedCallback(){
        this.getTime();
        this.fetchToDos();  

        setInterval( () => {
            this.getTime();
            console.log("Set interval called");
        }, 1000*60);
    }

    getTime(){
        const date = new Date();
        const hour = date.getHours();
        const minute = date.getMinutes();

        this.time = `${this.getHour(hour)}:${this.getDoubleDigit(minute)} ${this.getMidDay(hour)}`;

        this.setGreetings(hour);
    }

    getHour(hour){
        return hour === 0 ? 12 : hour > 12 ? (hour - 12) : hour;
    }

    getMidDay(hour){
        return hour >= 12 ? "PM" : "AM";
    }

    getDoubleDigit(digit){
        return digit < 10 ? "0"+digit : digit;
    }

    setGreetings(hour){
        if(hour >= 5 && hour < 12){
            this.greetings="Good Morning";
        }else if(hour >= 12 && hour < 17){
            this.greetings="Good Afternoon";
        }else{
            this.greetings="Good Evening";
        }
    }


    //Handler method
    addToDoHandler(){
        const inputText = this.template.querySelector("lightning-input");
        
        const todo = {
            todoName: inputText.value,
            done: false
        };
        console.log(todo);
        addTodo({payload : JSON.stringify(todo)}).then(response => {
            console.log("Item inserted successfully");
            console.log(response);
            
            //this.fetchTodos();
            if (response) {
                //fetch fresh list of todos
                this.fetchTodos();
              }
        }).catch(error => {
            console.log("error in addToDoHander");
            
            console.error("Error while inserting "+error.body.message);
            
        });
        //his.todos.push(todo);
        inputText.value="";
        
    }

    fetchToDos(){
        getCurrentTodos().then(results => {
            console.log(results);
            
            if(results){
                console.log("getting results");
                this.todos=results;
                //this.fetchToDos();
            }
        }).catch(error => {
            console.log("error in getCurrentTodos");
            console.error("Error while inserting "+error.body.message);
        });
    }

    //updating handlers to return current updated list after update or delete
    updateHandler(){
        this.updateTodo();
    }
    deleteHandler(){
        this.deleteTodo();
    }

    //get methods to filter values in todo
    get upcomingTasks(){
        return this.todos && this.todos.length 
        ? this.todos.filter( todo => !todo.done) 
        : [] ;
    }
    get completedTasks(){
        return this.todos && this.todos.length 
        ? this.todos.filter( todo => todo.done) 
        : [] ;
    }
}