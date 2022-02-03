const bcryptjs = require("bcryptjs");
const app = require("../../config/server");

module.exports = app => {
    app.get('/', (req,res) => {

        if (req.session.loggedin){
            res.render('../views/index.ejs', {
                login:true,
                name: req.session.name
            });
        } else {
            res.render('../views/index.ejs', {
                login:false,
                name: "Por favor inicie  sesion"
            });
        }
        res.render('../views/index.ejs');
    })

    app.get('/login', (req,res) => {
        res.render('../views/login.ejs');
    })

    app.get('/register', (req,res) => {
        res.render('../views/register.ejs');
    })

    //POST en el Registro:
    app.post('/register', async (req,res) => {
        const {user, name, rol, pass} = req.body;
        console.log(req.body);
        let passwordHaas = await bcryptjs.password.hash(pass, 8);
        connection.query("INSERT INTO users SET ?", {
            user:user,
            name:name,
            pass:passwordHaas  
        }, async(error, results)=>{
            if(error){
                console.log(error);
            } else {
                res.send('../views/register.ejs', {
                    alert: true,
                    alertTitle: "Registration",
                    alertMessage: "Seccessful Registration",
                    alertIcon: "success",
                    showConfirmButton: false,
                    timer: 1500,
                    ruta: ''
                });
            }
        })
    })

    //SOLICITUD POST DE LOGIN (AUTENTICATION)
    app.post('/auth', async (req,res) => {
        const {user,pass} = req.body;
        let passwordHaas = await bcryptjs.hash(pass, 8);

        if(user && pass){
            connection.query('SELECT * FROM users WHERE user = ?' , [user], async(err, results) => {
            if(results.length === 0 || !(await bcryptjs.compare(pass, results[0].pass))){
                res.render('../views/login.ejs', {
                    //configuracion de sweetalert2 para error
                    alert: true,
                    alertTitle: "Error",
                    alertMessage: "Usuario y/o Contraseña incorrectas",
                    alertIcon: "error",
                    showConfirmButton: true,
                    timer: false,
                    ruta: 'login'
                });
            } else {
                req.session.loggedin = true;
                req.session.name = results[0].name;
                res.render('../views/login.ejs', {
                  //configuracion de sweetalert2 para login correcto
                  alert:true,
                  alertTitle: "Conexion Exitosa",
                  alertMessage: "Login Correcto",
                  alertIcon: "success",
                  showConfirmButton: false,
                  timer: 1500,
                  ruta: ''
                })
            }
            })
        }
    })
}