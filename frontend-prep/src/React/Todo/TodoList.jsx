export default function TodoList({ todos, removeTodo, toggleTodo, editTodo }){

    return (
        <ul>
            {todos?.map((todo)=> {
                return (
                    <li key={todo.id}>
                        {isEdit === todo.id ? (
                            <input type="text" value={editText} 
                            onChange={(e) => setEditText(e.target.value)} />
                        ) : (
                           <div>
                            {todo.completed ? <s>{todo.task}</s> : todo.task}
                           </div>
                        )}
                        <button onClick={() => toggleTodo(todo.id)}>
                            {todo.completed ? "Undo" : "Complete"}
                        </button>
                        <button onClick={() => removeTodo(todo.id)}>
                            Remove
                        </button>
                        <button onClick={() => editTodo(todo.id, todo.task)}>
                            {isEdit === todo.id ? "Save" : "Edit"}
                        </button>
                    </li>
                )
            })}
        </ul>
    )
} 