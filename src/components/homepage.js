import React, { useEffect, useState } from 'react'
import { signOut, onAuthStateChanged } from 'firebase/auth'
import { auth, db } from '../firebase'
import { useNavigate } from 'react-router-dom'
import { uid } from "uid";
import { set, ref, onValue, remove, update } from "firebase/database"
import { AiOutlinePlus, AiFillEdit } from 'react-icons/ai'
import { FaRegTrashAlt, FaSignOutAlt } from 'react-icons/fa'
import { GiConfirmed } from 'react-icons/gi'

export default function Homepage() {
    const style = {
        bg: `h-screen w-screen p-4 bg-gradient-to-r from-[#2F80ED] to-[#1CB5E0]`,
        container: `bg-slate-100 max-w-[500px] w-full m-auto p-4 rounded-md shadow-xl mt-[30px]`,
        heading: `text-center text-3xl font-bold tex-center text-gray-800 my-5`,
        form: `flex justify-between`,
        input: `border p-2 w-full text-ul`,
        button: `border p-4 ml-2 bg-purple-500 hover:bg-purple-700 text-slate-100`,
        count: `text-center p-2 mt-2`,
        li: `flex justify-between bg-slate-200 p-2 my-2 capitalize rounded-md`,
        text: `border p-2 w-full text-ul ml-2 cursor-pointer`,
        Newbutton: `border p-4 ml-2 bg-purple-400 text-slate-100 rounded-md cursor-pointer`,
        Combutton: `ml-1 text-purple-400 rounded-full cursor-pointer`,
        outflex: `flex justify-center items-end mr-2`,
        outbutton: `p-4 bg-purple-500 text-slate-100 rounded-md ml-[85vw] mt-3`,
        hr: `max-w-[500px] w-full h-1 mx-auto mt-5 bg-slate-200 border-0 rounded`,
        lastflex: `flex justify-between`,
        totaltodo: `p-2 mt-2`,
        cleartodo: `p-2 ml-2 bg-slate-100 rounded-md`,
    }
    const [todo, setTodo] = useState("");
    const [todos, setTodos] = useState([]);
    const [isEdit, setIsEdit] = useState(false);
    const [tempUidd, setTempUidd] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        auth.onAuthStateChanged(user => {
            if (user) {
                onValue(ref(db, `/${auth.currentUser.uid}`), snapshot => {
                    setTodos([]);
                    const data = snapshot.val();
                    if (data !== null) {
                        Object.values(data).map((todo) => {
                            setTodos((oldArry) => [...oldArry, todo]);
                        })
                    }
                })
            }
            else if (!user) {
                navigate("/")
            }
        })
    }, [])


    const handleSignOut = () => {
        signOut(auth).then(() => {
            navigate("/")
        }).catch(err => { alert(err.message) })
    };

    const writeToDatabase = () => {
        if (todo.trim() === "") {
            return; // Don't add empty todos
        }

        const uidd = uid();
        set(ref(db, `/${auth.currentUser.uid}/${uidd}`), {
            todo: todo,
            uidd: uidd,
        });
        setTodo("");
    };

    const handleUpdate = (todo) => {
        setIsEdit(true);
        setTodo(todo.todo);
        setTempUidd(todo.uidd);
    }

    const handleEditConfirm = () => {
        update(ref(db, `/${auth.currentUser.uid}/${tempUidd}`), {
            todo: todo,
            uidd: tempUidd
        }).then(() => {
            setIsEdit(false);
            setTodo("");
            setTempUidd("");
        }).catch((error) => {
            console.error('Error updating item:', error);
        });
        setTodo("");
    }

    const handleDelete = (uid) => {
        remove(ref(db, `/${auth.currentUser.uid}/${uid}`))
            .then(() => {
                console.log('Item deleted successfully');
            })
            .catch((error) => {
                console.error('Error deleting item:', error);
            });
    }

    const handleClearCompleted = () => {
        const updatedTodos = todos.filter((todo) => !todo.completed);
        setTodos(updatedTodos);

        // Remove completed todos from the database
        todos.forEach((todo) => {
            if (todo.completed) {
                remove(ref(db, `/${auth.currentUser.uid}/${todo.uidd}`))
                    .then(() => {
                        console.log('Item deleted successfully');
                    })
                    .catch((error) => {
                        console.error('Error deleting item:', error);
                    });
            }
        });
    };

    const handleComplete = (uid) => {
        const updatedTodos = todos.map((todo) => {
            if (todo.uidd === uid) {
                return {
                    ...todo,
                    completed: !todo.completed,
                };
            }
            return todo;
        });
        setTodos(updatedTodos);
    };

    return (
        <div className={style.bg}>
            <div className={style.outflex}>
                <button className={style.outbutton} onClick={handleSignOut}>{<FaSignOutAlt />}</button>
            </div>
            <div className={style.container}>
                <h1 className={style.heading}>ADD TODO</h1>
                <div className={style.form}>
                    <input className={style.input} type="text" placeholder='Add todo' value={todo} onChange={(e) => setTodo(e.target.value)} />

                    {isEdit ? (
                        <div>
                            <button className={style.button} onClick={handleEditConfirm}>{<GiConfirmed size={30} />}</button>
                        </div>
                    ) : (
                        <div>
                            <button
                                className={style.button}
                                onClick={writeToDatabase}
                                disabled={todo.trim() === ""}
                            >
                                <AiOutlinePlus size={30} />
                            </button>
                        </div>
                    )}
                </div>
                {todos.map((todo) => (
                    <div className={style.li} key={todo.uidd}>
                        <button
                            className={style.Combutton}
                            onClick={() => handleComplete(todo.uidd)}
                        >
                            {<GiConfirmed size={25} />}
                        </button>
                        <p
                            className={`${style.text} ${todo.completed ? "line-through" : ""}`}
                        >
                            {todo.todo}
                        </p>
                        <button
                            className={style.Newbutton}
                            onClick={() => handleUpdate(todo)}
                        >
                            {<AiFillEdit />}
                        </button>
                        <button
                            className={style.Newbutton}
                            onClick={() => handleDelete(todo.uidd)}
                        >
                            {<FaRegTrashAlt />}
                        </button>
                    </div>
                ))}
                <hr className={style.hr} />
                <div className={style.lastflex}>
                    {/* Display total number of todos */}
                    <p className={style.totaltodo}>Total Todos: {todos.length}</p>

                    {/* Clear completed todos */}
                    <button className={style.cleartodo} onClick={handleClearCompleted}>
                        Clear Completed
                    </button>
                </div>
            </div>
        </div>
    )
}
