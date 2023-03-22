import React from "react";
import { useEffect } from "react";

function useExpandableFilter() {
    useEffect(() => {
        const handleGlobalClick = event => {
            let element = event.target;

            if(element.matches('.theme-mobids .filter-container .expandable h2')) {
                element.parentElement.classList.toggle('expanded')
                event.preventDefault()
            }
        }
        document.addEventListener('click', handleGlobalClick)

        return () => {
            document.removeEventListener('click', handleGlobalClick)
        }
    })
}

export default useExpandableFilter