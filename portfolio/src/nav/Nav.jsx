import React from "react";

export default function Nav(){
    const menuItems = [
        {
            name: "Home",
            url: "/"
        },
        {
            name: "Project",
            url: "/" 
        },
        {
            name:"Contact",
            url: "/"
        },
        {
            name: "About",
            url: "/"
        }
    ]
    return(
        <>
        <nav>
            <ul>
                {
                    menuItems.map((item)=>{
                       return <li key={item.name}>{item.name}</li>
                    })
                }
            </ul>
        </nav>
        </>
    )
}