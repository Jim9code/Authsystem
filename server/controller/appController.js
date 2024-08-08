const mysql = require("mysql2");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const validateToken = require("../routes/jwt");
dotenv.config();

// creating connection to my data base
const pool = mysql.createPool({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});
// confirm database connection
pool.getConnection((err, connection) => {
  if (err) throw err;
  console.log(`DATA_base Connection active on ID ${connection.threadId}`);
});

// ###########################################3##### chats search bar   $################################################

// find user via search
// exports.find = (req,res)=>{
//     let searchTearm = req.body.search
//           pool.query(`select * from posts where name LIKE ?`,['%'+ searchTearm + '%'],(err,rows)=>{
//         if(!err){
//             console.log(rows)
//             res.render('chats.ejs',{rows, users:  [{first_name : "Profile"}]})
//         }else{
//             console.log(err)
//         }
//     })
// }

// #################################################   HOME  #######################################################

// rendring home
exports.home = (req, res) => {
  //   using id i passed to jwt to  get user information id.id because is jwt id
  const TokenID = req.id.id;

  pool.query("select *  from users where id = ? ", [TokenID], (err, users) => {
    if (err) {
      console.log(err);
    } else {
      pool.query( "select *  from todo where uid = ? ", [TokenID],(err, todo) => {
          if (err) {
            console.log(err);
          } else {
            pool.query( "select count(id) from todo where uid = ?",[TokenID],(err, rownum) => {
                if (err) {
                  console.log(err);
                } else {
                  const rowCount = rownum[0]["count(id)"];
                  console.log(rowCount);

                  res.status(201).render("home.ejs", { users, todo, rowCount });
                }
              }
            );
          }
        }
      );
    }
  });
};

// ##############################################   LOGIN  ##################################################################

// rendering the LOGIN page
exports.login = (req, res) => {
  res.render("login.ejs", { alert: "Welcome back!", color: "green" });
};

// posting the info from the login page to use in verifying the login
exports.logined = (req, res) => {
  const { Bemail, Bpassword } = req.body;
  const body = { Bemail, Bpassword };
  const Bmail = body.Bemail;
  const Bpass = body.Bpassword;

  //   geting id , email and password from my database
  pool.query(`select id, email , password from users where email like ?`, ["%" + Bemail + "%"], async (err, result) => {
      //   if no result from the base .length ===0
      if (result.length === 0) {
        res.render("login.ejs", { alert: "Email Invalid!", color: "red" });
      } else {
        const db = result[0];
        const id = db.id;
        const Demail = db.email;
        const Dpass = db.password;

        //   comparilogin password and database password
        if (Demail === Bmail) {
          const unhashedMatch = await bcrypt.compare(Bpass, Dpass);

          if (unhashedMatch) {
            // create JWTs
            const accesstoken = jwt.sign(
              { id: id },
              process.env.ACCESS_TOKEN_SECRET
            );
            res.cookie("accessToken", accesstoken, {
              httpOnly: true,
              secure: true,
              maxAge: 60 * 60 * 24 * 30 * 1000,
            });

            return res.redirect("/");
          } else {
            return res.render("login.ejs", {
              alert: " Incorrect password!",
              color: "red",
            });
          }
        } else {
          res.render("login.ejs", { alert: "Email Invalid!", color: "red" });
        }
      }
    }
  );
};

// ################################################    REGISTRATION    ###########################################################3#####################

// rendering the REGISTRATION page
exports.register = (req, res) => {
  res.render("register.ejs", { alert: "Welcome new User!", color: "green" });
};

// post registered form and send to data base
exports.registered = (req, res) => {
  const {
    first_name,
    last_name,
    username,
    email,
    phone,
    password,
    Cpassword,
    bio,
  } = req.body;

  //   To email check , password
  pool.query(`select email from users where email = ?`,[email],async (err, result) => {
      if (err) {
        console.log(err);
      } else {
        // checking if email already existed
        if (result.length > 0) {
          console.log(result.length);
          return res.render("register.ejs", {
            alert: "This EMAIL is already in use",
            color: "red",
          });

          // making sure passwords match
        } else if (password !== Cpassword) {
          return res.render("register.ejs", {
            alert: "Passwords did not match!",
            color: "red",
          });
        } else if (password.length < 8) {
          return res.render("register.ejs", {
            alert: "Password must not be less than 8 characters",
            color: "red",
          });
        } else {
          let hashedPassword = await bcrypt.hash(password, 8);
          console.log(hashedPassword);

          // to register user
          pool.query(
            `insert into  users set first_name = ?,
               last_name = ?,
                username = ?,
                 email = ?,
                 phone = ?,
                 password = ?,
                 bio = ?  `,
            [
              first_name,
              last_name,
              username,
              email,
              phone,
              hashedPassword,
              bio,
            ],
            (err) => {
              if (!err) {
                // res.render("register.ejs", {
                //   alert: " Registration Successful!",
                //   color: "green",
                // });
                console.log("New register")
                res.redirect('/login')

                
              } else {
                console.log(err);
              }
            }
          );
        }
      }
    }
  );
};

// #####################################  LOGOUT   #######################################################

exports.logout = (req, res) => {
  res.clearCookie("accessToken");
  res.redirect("/login");
};
