import { redirect, useNavigate, Outlet } from "react-router-dom"
import { useState } from "react";

let buttons = ["a", "b", "c", "d", "e", "f"]

export default function Root(){
    const navigate = useNavigate();
    
    return(
        <div>
            {buttons.map((element, index) => {
                return(
                    <button 
                        key={index} 
                        onClick={()=>{
                            return navigate(`/${index}`);
                        }}
                        >
                        {element}
                    </button>
                )
            })}
            <Outlet/>
        </div>
    )
}