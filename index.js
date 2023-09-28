require("dotenv").config()  //llama la biblioteca dotenv para usarla

const helmet = require("helmet");   

const { db_test } = require("./database.js")    //importa el testeo de la db
const publicModel = require("./publicModel.js") //importa la db

const express = require("express")
const app = express()   //app es el servidor

const PUERTO = process.env.PUERTO   //process.env.variable usa las variables de el archivo .env

app.set("view engine", "ejs");  //le indica al servidor que va a usar ejs como motor de plantilla

//app.use(helmet())   //extra de seguridad
app.use(helmet({ crossOriginEmbedderPolicy: false, originAgentCluster: true }));
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      "img-src": ["'self'", "https: data: blob:"],
    },
  })
);
app.use(express.json())                         //le avisa al servidor que lea en formato json cuando se ejecute una peticion post mediante body
app.use(express.urlencoded({ extends: true }))  //le avisa al servidor que le van a llegar parametros por input

app.get("/", async function (req, res) {  //ruta de inicio, se hace asincronico para evitar bloqueos

    const publicaciones = await publicModel.findAll();  

    res.render("inicio", { publicaciones }) //renderiza inicio.ejs, no es necesario indicar cual es la carpeta en la que se encuentran las vista porque por defecto las busca una carpeta llamada views
                                            //como segundo parametro envia variables hacia inicio.ejs, en este caso una lista de las publicaciones
})

app.get("/agregar", function (req, res){
    res.render("agregar")
})

app.post("/agregar", async function (req, res){ 
    const { Titulo, Descripcion, Imagen } = req.body
    
    try {
        const nuevaPublicacion = await publicModel.create({
            titulo: Titulo, 
            descripcion: Descripcion, 
            imagen: Imagen, 
        })

        if (nuevaPublicacion) { //si nuevaPublicacion no es null
            res.redirect("/")   //va a la pagina principal
        } else {
            res.send("error al agregar publicacion")
        }
    } catch (err) { 
        //res.send(<script>alert("error al cargar publicacion " + err); window.location.href = "/agregar"; </script>);
        res.send("error al cargar publicacion " + err)   //si falla algo en publicModel envia este mensaje
    }
})

app.get("/editar/:id", async function (req, res){   //le llega el parametro id que se usa para buscar la publicacion
    const {id} = req.params
    try{
        const publicacion = await publicModel.findOne({
            where: {
                id: id
            }
        })

        if (publicacion) {
            console.log("editar", publicacion);
            res.render("editar", {publicacion: publicacion})
        }else{
            res.send("no se pudo encontrar publicacion")
        }
        
    }catch (err) { 
        res.send("error al buscar publicacion " + err)   
    }
})

app.post("/editar/:id", async function (req, res){
    const {id} = req.params
    const { Titulo, Descripcion, Imagen } = req.body
    console.log(id);

    try{
        const actualizarPublicacion = await publicModel.update({
            titulo: Titulo,
            descripcion: Descripcion,
            imagen: Imagen
        }, {
            where: {
                id: id
            }
        })

        if (actualizarPublicacion) {
            console.log("editado", actualizarPublicacion);
            res.redirect("/")
        }else{
            res.send("no se pudo actualizar publicacion")
        }
        
    }catch (err) { 
        res.send("error al actualizar publicacion " + err)   
    }
})

app.get("/eliminar/:id", async function (req, res){
    const {id} = req.params

    try {
        const borrarPublicacion = await publicModel.destroy({
            where:{
                id: id
            }
        })

        if (borrarPublicacion) {
            res.redirect("/")
        } else {
            res.send("error al borrar publicacion")
        }
    } catch (err) { 
        res.send("error al borrar publicacion " + err)   
    }
})

db_test()   //ejecuta la funcion para testear

app.listen(PUERTO, () => {
    console.log(`servidor corriendo en: localhost:${PUERTO}`);
})
    
