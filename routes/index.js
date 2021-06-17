/*
    Este archivo contiene todas las peticiones del cliente y lo que
    le responde el servidor.
    NOTA 

*/


const {Router, json} = require("express")
const router = Router()
// POSTGRESQL
const {Pool} = require("pg")
const { render } = require("pug")
const pool = new Pool({
    host: "",
    user: "postgres",
    password: "123", // Cambia a tu contraseña
    database: "pruebaHospital", // Ponle el nombre que le pusiste a la base de datos.
    port: 5432
})

// VARIABLES PARA QUE FUNCIONE LOS GETS DE ADMIN

let dataToReturn
let dataEditCurp
let dataEditID

// GET PARTE DEL ADMIN

router.get("/", (req, res) =>{
    res.render("login.pug", {root : __dirname, dataUser: dataToReturn, success : ''})
})

router.get("/admin", (req, res)=>{
    res.render("admin.pug", { root: __dirname, dataUser : dataToReturn})
})

router.get("/doctor", (req, res)=>{
    res.render("doctor.pug", { root: __dirname, dataUser : dataToReturn})
})


router.get("/admin/register-doctor", (req, res) =>{
    res.render("register_doctor.pug", { root: __dirname , success : ""})
})

router.get("/admin/ver-doctor", async (req, res) =>{
    const dataDoctores = await pool.query("SELECT id ,nombre, apellido1, apellido2, nss, curp, domicilio, sexo, TO_CHAR(fecha_nac::date, 'dd/mm/yyyy') AS fecha_nac, TO_CHAR(fecha_ingreso::date, 'dd/mm/yyyy') AS fecha_ingreso, especialidad FROM medico WHERE habilitado=true")
    let rowsDoctores = dataDoctores.rows
    let rowsDoctoresSize = dataDoctores.rowCount
    res.render("crud_doctores.pug", { root: __dirname, medicos: rowsDoctores, medicosSize : rowsDoctoresSize})
})

router.get("/admin/register-paciente", (req, res) =>{
    res.render("register_paciente.pug", { root: __dirname })
})

router.get("/admin/ver-paciente", async (req, res) =>{
    const dataPaciente = await pool.query("SELECT id, nombre, apellido1, apellido2, nss, curp, domicilio, sexo, TO_CHAR(fecha_nac::date, 'yyyy/mm/dd') AS fecha_nac, telefono FROM paciente WHERE habilitado = true")
    let pacienteRows = dataPaciente.rows

    let pacienteRowsSize = dataPaciente.rowCount
    res.render("ver_paciente.pug", { root: __dirname, paciente : pacienteRows, pacienteSize : pacienteRowsSize })
})

router.get("/admin/ver-doctor/editar", async (req, res) =>{
    const dataDoctor = await pool.query("SELECT nombre, apellido1, apellido2, nss, curp, domicilio, sexo, TO_CHAR(fecha_nac::date, 'yyyy-mm-dd') AS fecha_nac, TO_CHAR(fecha_ingreso::date, 'yyyy-mm-dd') as fecha_ingreso, especialidad FROM medico WHERE curp = $1;", [dataEditCurp])
    let rowsDoctor = dataDoctor.rows
    res.render("editar_doctor.pug", { root: __dirname, medico: rowsDoctor })
})

router.get("/admin/ver-paciente/editar", async (req, res) =>{
    const dataPaciente = await pool.query("SELECT id, nombre, apellido1, apellido2, nss, curp, domicilio, sexo, TO_CHAR(fecha_nac::date, 'yyyy-mm-dd') AS fecha_nac, telefono FROM paciente WHERE curp = $1;", [dataEditCurp])
    let rowsPaciente = dataPaciente.rows
    res.render("editar_paciente.pug", { root: __dirname, paciente: rowsPaciente })
})

router.get("/admin/cita", async (req, res) =>{
    const dataDoctor = await pool.query("SELECT nombre, apellido1, apellido2, nss, curp, domicilio, sexo, TO_CHAR(fecha_nac::date, 'yyyy-mm-dd') AS fecha_nac, TO_CHAR(fecha_ingreso::date, 'yyyy-mm-dd') as fecha_ingreso, especialidad FROM medico WHERE habilitado = true")
    const dataPaciente = await pool.query("SELECT id, nombre, apellido1, apellido2, nss, curp, domicilio, sexo, TO_CHAR(fecha_nac::date, 'yyyy/mm/dd') AS fecha_nac, telefono FROM paciente WHERE habilitado = true")
    let rowsPaciente = dataPaciente.rows
    let rowsPacienteSize = dataPaciente.rowCount
    let rowsDoctor = dataDoctor.rows
    let rowsDoctorSize = dataDoctor.rowCount
    res.render("cita.pug", { root : __dirname, doctor: rowsDoctor, doctorSize: rowsDoctorSize, paciente: rowsPaciente, pacienteSize : rowsPacienteSize })
})

router.get("/404", (req, res) =>{
    res.render("404.pug", { root: __dirname })
})

// POST DE ADMIN

router.post(("/"), async (req, res) =>{
    // Info que llega
    const dataComplete = req.body

    // Info admin
    const responseAdmin = await pool.query("SELECT * FROM administrador")
    const rowsAdmin = responseAdmin.rows[0]

    // Info usuario doctor
    const responseDoctorUser = await pool.query("SELECT * FROM medico_usuarios")
    const rowsDoctorUser = responseDoctorUser.rows

    // Info doctor
    const responseDoctor = await pool.query("SELECT * FROM medico")
    const rowsDoctor = responseDoctor.rows

    // Si es admin
    if(dataComplete.user === rowsAdmin.usuario && dataComplete.password == rowsAdmin.contrasenia){
        dataToReturn = dataComplete
        res.status(200).redirect("/admin")
    }

    // Si es doctor
    for(let i = 0; i < 10; i++){
        if(dataComplete.user === rowsDoctorUser[i].usuario && dataComplete.password === rowsDoctorUser[i].contrasenia){
            for(let j = 0; j < 10; j++){
                if(rowsDoctorUser[i].usuario === rowsDoctor[j].curp){
                    dataToReturn = rowsDoctor[j]
                }
            }
            res.status(200).redirect("/doctor")
        }
    }
    res.render("login.pug", {root : __dirname, success : 'Este usuario no existe.'})
})

router.post("/delete-doctor", async (req, res) =>{
    const data =  req.body
    const curp = data.curp
    pool.query("UPDATE medico SET habilitado = false WHERE curp = $1", [curp])
    res.sendStatus(200)
})

router.post("/editar-doctor", (req, res) =>{
    dataEditCurp = req.body.curp
    dataEditID = req.body.id
    res.status(200).json(dataEditCurp)
})

router.post("/admin/ver-doctor/editar", async (req, res) =>{
    const data = req.body
    let doctorCita = await pool.query("SELECT * FROM cita WHERE id_doctor = $1", [dataEditID]);
    let doctorCitaSize = doctorCita.rowCount
    await pool.query("UPDATE medico SET nombre = $1, apellido1 = $2, apellido2 = $3, nss = $4, curp = $5, domicilio = $6, sexo = $7, fecha_nac = $8, fecha_ingreso = $9, especialidad = $10 WHERE id = $11", [data.nombre, data.apellido1, data.apellido2, data.nss, data.curp, data.domicilio, data.sexo, data.fecha_nac, data.fecha_ingreso, data.especialidad, dataEditID])
    await pool.query("UPDATE medico_usuarios SET usuario = $1, contrasenia = $2 WHERE id = $3", [data.curp, data.nombre, dataEditID])
    
    if(doctorCitaSize != 0){
        await pool.query("UPDATE cita SET doctornombre = $1, doctorapellido1 = $2, doctorcurp = $3 WHERE id_doctor = $4", [data.nombre, data.apellido1, data.curp, dataEditID])
    }
    res.redirect("/admin")
})

router.post("/register-doctor", async (req, res) =>{
    const data = req.body
    await pool.query("INSERT INTO medico(nombre, apellido1, apellido2, nss, curp, domicilio, sexo, fecha_nac, fecha_ingreso, especialidad, habilitado) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, true)", [data.nombre, data.apellido1, data.apellido2, data.nss, data.curp, data.domicilio, data.sexo, data.fecha_nac, data.fecha_ingreso, data.especialidad])
    await pool.query("INSERT INTO medico_usuarios(usuario, contrasenia) VALUES($1, $2)", [data.curp, data.nombre])
    res.redirect("/admin")
})

router.post("/register-paciente", async (req, res) =>{
    const data = req.body
    await pool.query("INSERT INTO paciente(nombre, apellido1, apellido2, nss, curp, domicilio, sexo, fecha_nac, telefono, habilitado) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, true)", [data.nombre, data.apellido1, data.apellido2, data.nss, data.curp, data.domicilio, data.sexo, data.fecha_nac, data.telefono])
    res.redirect("/admin")
})

router.post("/delete-paciente", async (req, res) =>{
    const data = req.body
    const curp = data.curp
    pool.query("UPDATE paciente SET habilitado = false WHERE curp = $1", [curp])
    res.sendStatus(200)
})

router.post("/editar-paciente", (req, res) =>{
    dataEditCurp = req.body.curp
    dataEditID = req.body.id
    res.status(200).json(dataEditCurp)
})

router.post("/admin/ver-paciente/editar", async (req, res) =>{
    const data = req.body
    const dataCita = await pool.query("SELECT * FROM cita WHERE id_paciente = $1", [dataEditID]);
    let dataCitaSize = dataCita.rowCount
    await pool.query("UPDATE paciente SET nombre = $1, apellido1 = $2, apellido2 = $3, nss = $4, curp = $5, domicilio = $6, sexo = $7, fecha_nac = $8, telefono = $9 WHERE id = $10", [data.nombre, data.apellido1, data.apellido2, data.nss, data.curp, data.domicilio, data.sexo, data.fecha_nac, data.telefono, dataEditID])
    if(dataCitaSize != 0){
        await pool.query("UPDATE cita SET pacientenombre = $1, pacienteapellido1 = $2, pacientecurp = $3 WHERE id_paciente = $4", [data.nombre, data.apellido1, data.curp, dataEditID])
    }
    res.redirect("/admin")
})

router.post("/admin/cita", async (req, res) =>{
    const data = req.body
    const pacient = data.paciente
    const doctor = data.doctor
    const dataDoctor = await pool.query("SELECT id, nombre, apellido1, apellido2, nss, curp, domicilio, sexo, TO_CHAR(fecha_nac::date, 'yyyy-mm-dd') AS fecha_nac, TO_CHAR(fecha_ingreso::date, 'yyyy-mm-dd') as fecha_ingreso, especialidad FROM medico WHERE curp = $1", [doctor])
    const dataPaciente = await pool.query("SELECT id, nombre, apellido1, apellido2, nss, curp, domicilio, sexo, TO_CHAR(fecha_nac::date, 'yyyy/mm/dd') AS fecha_nac, telefono FROM paciente WHERE curp = $1", [pacient])
    let rowsPaciente = dataPaciente.rows
    let rowsDoctor = dataDoctor.rows
    await pool.query("INSERT INTO cita(doctornombre, doctorapellido1, doctorcurp, id_doctor ,pacientenombre, pacienteapellido1, pacientecurp, id_paciente,dia, hora, habilitado) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, true)", [ rowsDoctor[0].nombre, rowsDoctor[0].apellido1, rowsDoctor[0].curp, rowsDoctor[0].id, rowsPaciente[0].nombre, rowsPaciente[0].apellido1, rowsPaciente[0].curp, rowsPaciente[0].id, data.fecha, data.hora])
    res.status(200).redirect("/admin")
})

// ESTE NO SE TOCA, HACE LA CONEXIÓN ENTRE ESTE ARCHIVO Y EL DE app.js PARA QUE FUNCIONEN LAS PETICIONES
module.exports = router