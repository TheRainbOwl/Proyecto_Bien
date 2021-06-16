const listButtons = document.querySelectorAll(".button-delete")

listButtons.forEach(button => {
    let parent = button.parentNode.parentNode
    let td = parent.childNodes
    button.addEventListener("click", async ()=>{
        const data = {curp : td[6].outerText}
        const response = await fetch("/delete-doctor", {
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
        const data = {curp : td[6].outerText, id : td[1].outerText}
        const response = await fetch("/editar-doctor", {
            method: "post",
            headers: {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify(data)
        })
        response
        location.replace("/admin/ver-doctor/editar")
    })
})

