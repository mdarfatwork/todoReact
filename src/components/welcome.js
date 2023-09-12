import React, {useState, useEffect} from 'react'
import { signInWithEmailAndPassword, onAuthStateChanged, createUserWithEmailAndPassword } from 'firebase/auth' 
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

export default function Welcome() {
    const style = {
  bg: `h-screen w-screen p-4 bg-gradient-to-r from-[#2F80ED] to-[#1CB5E0]`,
  container: `bg-slate-100 max-w-[500px] w-full m-auto p-4 rounded-md shadow-xl mt-[30px]`,
  heading: `text-center text-3xl font-bold tex-center text-gray-800 my-5`,
  input: `border-2 border-slate-200 p-2 w-full text-ul rounded-md my-2`,
  button: `my-1 p-3 rounded-md w-full bg-purple-500 text-slate-100`,
}
    const [email, setEmail] = useState("");
    const [password, setPassword]= useState("");
    const [isRegistering, setIsRegistering] = useState(false);
    const [registerInformation, setRegisterInformation]= useState({
        email: "",
        confirmEmail:  "",
        password: "",
        confirmPassword: "" 
    })

    const navigate = useNavigate();

    useEffect(() => {
      auth.onAuthStateChanged((user)=>{
        if (user){
            navigate("/todolist");
        }
      })
      // eslint-disable-next-line
    }, [])

    const handleEmailChange = (e)=>{
        setEmail(e.target.value);
    }
    const handlePasswordChange = (e)=>{
        setPassword(e.target.value);
    }
    const handleSignIn = ()=>{
        signInWithEmailAndPassword(auth, email, password).then(()=>{
            navigate('/todolist');
        }).catch((err)=>{alert(err.message)})
    };
    const handleRegister = () =>{
        if(registerInformation.email !== registerInformation.confirmEmail){
            alert("Please confirm Email is same");
            return
        }else if (registerInformation.password !== registerInformation.confirmPassword){
            alert("Please confirm Password is same");
            return
        }
        createUserWithEmailAndPassword(auth, registerInformation.email, registerInformation.password).then(()=>{
            navigate('/todolist');
        }).catch((err)=>{alert(err.message)})
    }
  return (
    <div className={style.bg}>
        <div className={style.container}>
            {isRegistering ? (
            <>
            <h1 className={style.heading}>Todo List - Register</h1>
            <input className={style.input} type="email" placeholder='Enter Your Email' value={registerInformation.email} onChange={(e)=>{setRegisterInformation({...registerInformation, email: e.target.value})}} /><br/>
            <input className={style.input} type="email" placeholder='Confirm Your Email' value={registerInformation.confirmEmail} onChange={(e)=>{setRegisterInformation({...registerInformation, confirmEmail: e.target.value})}}/><br/>
            <input className={style.input} type="password" placeholder='Enter Your Password' value={registerInformation.password} onChange={(e)=>{setRegisterInformation({...registerInformation, password: e.target.value})}} /><br/>
            <input className={style.input} type="password" placeholder='Confirm Your Password' value={registerInformation.confirmPassword} onChange={(e)=>{setRegisterInformation({...registerInformation, confirmPassword: e.target.value})}} /><br/>
            <button className={style.button} onClick={handleRegister}>Register</button><br/>
            <button className={style.button} onClick={()=> setIsRegistering(false)}>Go back</button>
            </>
            ) : (
            <>
            <h1 className={style.heading}>Todo List - Login</h1>
            <input className={style.input} type="email" placeholder='Enter Your Email' onChange={handleEmailChange} value={email} /><br/>
            <input className={style.input} type="password" placeholder='Enter Your Password' onChange={handlePasswordChange} value={password} /><br/>
            
            <button className={style.button} onClick={handleSignIn}>sign In</button><br/>
            <button className={style.button} onClick={()=> setIsRegistering(true)}>Create an account</button>
            </>
            )
            }
        </div>
    </div>
  )
}