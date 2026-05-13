'use client'; 

import { useRouter } from "next/navigation"

export default function Link(props) {
    const route = useRouter();
    const style = {...props.style,... {cursor:'pointer'}}
    return(
        <span {...props} onClick={(e)=>{
            e.preventDefault()
            route.push(props.href)
        }} style={style}>
            {props.children}
        </span>
    )
}