const listButtons = document.querySelectorAll(".button-delete")

listButtons.forEach(button => {
    let parent = button.parentNode.parentNode
    let td = parent.childNodes
    button.addEventListener("click", async ()=>{
        const data = {dia : td[8].outerText, hora:td[9].outerText, curpPaciente : td[4].outerText, curpDoc: td[7].outerText }
        const response = await fetch("/delete-cita", {
            method: "post",
            headers: {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify(data)
        })
        response
        location.reload(true)
    })
})

const listButtonsEdit = document.querySelectorAll(".button-Edit")
listButtonsEdit.forEach(buttonEdit =>{
    let parent = buttonEdit.parentNode.parentNode
    let td = parent.childNodes
    buttonEdit.addEventListener("click", async () =>{
        const data = {dia : td[8].outerText, hora:td[9].outerText, curpPaciente : td[4].outerText, curpDoc: td[7].outerText}
        const response = await fetch("/editar-cita", {
            method: "post",
            headers: {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify(data)
        })
        response
        location.replace("/admin/ver-cita/editar")
    })
})
