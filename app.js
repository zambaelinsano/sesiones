const express= require('express')
const mysql = require('mysql2')
const session=require('express-session')
const path= require('path')

const app=express();
const port=3000;
const db=mysql.createConnection(
    {
        host:'localhost',
        user:'root',
        password:'n0m3l0',
        database:'BD_USUARIOS'
    }
)
db.connect((err)=>{
    if(err){
        console.log('Error al conectar',err)
        return;
    }
    console.log('Conectado a la BD')
});
app.use(session({
    secret:'clave_secreta',
    resave:false,
    saveUninitialized:true
}))
app.use(express.urlencoded({extend:true}))
app.use(express.json())
app.use(express.static(path.join(__dirname,'public')))



app.post('/login',(req,res)=>{
    const{username,password}=req.body;
    if(!username||!password){
        return res.status(400).send('Por favor ingresa usuario y contraseña')
    }
    const sql='Select* from usuarios where username=?';
    db.query(sql,[username],(err,result)=>{
        if(err){
            console.log('Error en la consulta',err)
            return res.status(500).send('Error en el srvidor')
        }
        if(result.lenght===0){
            return res.status(401).send('Usuario no encontrado')
        }
        const user=result[0]
        if(password===user.password){
            req.session.userId=user.id;
            req.session.username=user.username;
            res.send('sesion iniciada correctamente')         
        }
        else{
            req.status(401).send('contraseña incorrecta')
        }
    })
})

app.get('/logout',(req,res)=>{
    req.session.destroy((err)=>{
        if(err){
            return res.status(500).send('Error al cerrar sesion')
        }
    })
    res.send('Sesion cerrada')
})
app.listen(port,()=>{
    console.log(`Servidor corriendo en http://localhost:${port}`)
})