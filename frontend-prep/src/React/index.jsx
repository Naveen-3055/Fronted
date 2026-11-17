// TODO

import TodoForm from "./Day1/TodoForm";
import TodoList from "./Day1/TodoList";


export default function Todo(){

    const [todos, setTodos] = useState([]);
    const [isEdit, setIsEdit] = useState(false);
    const [editText, setEditText] = useState("");

    const addTodo = (text) => {
       if(text.trim().length > 0){
         setTodos((prev)=> [...prev, {id: Date.now(), task: text,
             completed: false}]);
         }
    }

    const removeTodo = (id) => {
        setTodos((prev)=> prev.filter((todo)=> todo.id !== id));
    }

    const toggleTodo = (id) => {
        setTodos((prev)=> prev.map((todo)=> {
            if(todo.id === id){
                return {...todo, completed: !todo.completed};
            }
        }))
    }

    const editTodo = (id, newTask) => {
        setIsEdit(true);
        setEditText(newTask);
        setTodos((prev)=> prev.map((todo)=> {
            if(todo.id === id){
                return {...todo, task: newTask};
            }
            return todo;
        }))
    }

    const completedTodos = todos.filter((todo)=> todo.completed).length;
    const pendingTodos = todos.length - completedTodos;

    return (
        <div>
            <h1>Todo List</h1>
            <div>
               <div>
                 <h3>todo count: {todos.length}</h3>
                <h3>completed todos: {completedTodos}</h3>
                <h3>pending todos: {pendingTodos}</h3>
               </div>

               {/* search bar */}
               <div>

               </div>
               {/* filters */}
               <div></div>
            </div>
            <TodoForm addTodo={addTodo} isEdit={isEdit} editText={editText}/>
            <TodoList todos={todos} removeTodo={removeTodo} 
            toggleTodo={toggleTodo} editTodo={editTodo}/>
        </div>
    )
}