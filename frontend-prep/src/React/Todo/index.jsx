// TODO

import TodoForm from "./TodoForm";
import TodoList from "./TodoList";


export default function Todo(){

    const [todos, setTodos] = useState(()=>{
        const savedTodos = localStorage.getItem("todos");
        return savedTodos ? JSON.parse(savedTodos) : [];
    });
    const [isEdit, setIsEdit] = useState(false);
    const [editText, setEditText] = useState("");
    const [searchText, setSearchText] = useState("");
    const [filter, setFilter] = useState("all");

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
        setIsEdit(id);
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

    const handleSearch = () => {
        const filteredTodos = todos.filter((todo)=> todo.task.toLowerCase().includes(searchText.toLowerCase()));
        setTodos(filteredTodos);
    }

    const handleClearSearch = () => {
        setSearchText("");
        setTodos(todos);
    }

    useEffect(()=> {
        const filteredTodos = todos.filter((todo)=> {
            if(filter === "completed"){
                return todo.completed;
            }else if(filter === "pending"){
                return !todo.completed;
            }else{
                return true;
            }
        });
        setTodos(filteredTodos);
    },[filter])

    useEffect(()=> {
        localStorage.setItem("todos", JSON.stringify(todos));
    },[todos])

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
                    <input  type="text" placeholder="Search todos..." 
                    value={searchText} onChange={(e) => setSearchText(e.target.value)}/>
                    <button onClick={handleSearch}>
                        Search
                    </button>
                    <button onClick={handleClearSearch}>
                        Clear
                    </button>
               </div>
               {/* filters */}
               <div>
                <Select value={filter} onChange={(e) => setFilter(e.target.value)}>
                    <option value="all">All</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                </Select>
               </div>
            </div>
            <TodoForm addTodo={addTodo} isEdit={isEdit} editText={editText}/>
            <TodoList todos={todos} removeTodo={removeTodo} 
            toggleTodo={toggleTodo} editTodo={editTodo} isEdit={isEdit} editText={editText}/>
        </div>
    )
}