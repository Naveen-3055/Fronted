export default function TodoList({ todos, removeTodo, toggleTodo, editTodo }){

    return (
        <ul>
            {todos?.map((todo)=> {
                return (
                    <li key={todo.id}>
                        {todo.completed ? <s>{todo.task}</s> : todo.task}
                        <button onClick={() => toggleTodo(todo.id)}>
                            {todo.completed ? "Undo" : "Complete"}
                        </button>
                        <button onClick={() => removeTodo(todo.id)}>
                            Remove
                        </button>
                        <button onClick={() => editTodo(todo.id, todo.task)}>
                            Edit
                        </button>
                    </li>
                )
            })}
        </ul>
    )
}