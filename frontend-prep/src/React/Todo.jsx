// TODO


export default function Todo(){

    const [todos, setTodos] = useState([]);


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

    return (
        <div>
            <h1>Todo List</h1>
            <TodoForm addTodo={addTodo}/>
            <TodoList todos={todos} removeTodo={removeTodo} toggleTodo={toggleTodo}/>
        </div>
    )

}