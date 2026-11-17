export default function TodoForm({ addTodo, isEdit }){

    const [text, setText] = useState("");
    return (
        <form formId="todoForm">
            <input type="text" placeholder="Enter a task" id="taskInput" 
            value={text} onChange={(e) => setText(e.target.value)}/>
           <button type="submit" onClick={(e) => {
                e.preventDefault();
                if(text.trim().length > 0){
                    addTodo(text);
                    setText("");
                }
            }}>
                Add Task
            </button>
        </form>
    )
}