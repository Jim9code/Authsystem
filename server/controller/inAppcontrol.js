const mysql= require('mysql2')
const dotenv = require('dotenv')
const fileupload = require('express-fileupload')

dotenv.config()



// creating connection to my data base
const pool = mysql.createPool({
    host    : process.env.HOST,
    user    : process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE, 
})
// confirm database connection
pool.getConnection((err,connection)=>{
    if(err)throw err;
    console.log(`DATA_base Connection active on ID ${connection.threadId}`)
})







exports.todo = (req,res)=>{

    //   using id i passed to jwt to  get user information id.id because is jwt id      
             const TokenID = req.id.id

             const {todo} = req.body
             if(todo.length === 0){
                res.send('task cannot be empty! <a href="/">Back</a>')
             }else{
                    
             pool.query('select count(id) from todo where uid = ?',[TokenID],(err,rownum)=>{
                if(err){
                    console.log(err)
                }else{
                        const rowCount = rownum[0]['count(id)']
                        console.log(rowCount)

                        if(rowCount === 4){

                            res.redirect('/')
                        }else{

                            pool.query('insert into  todo set uid = ? , task = ? ',[TokenID,todo],(err,todo)=>{
                                if(err){
                                  console.log(err)
                                }else{
                                  
                                  res.redirect('/')
                                }
                          })
                        }

                }
             })






             }

                
}


exports.tododel = (req,res)=>{

    const id = req.params.id
         
    pool.query('delete from todo where id= ? ',[id],(err,todo)=>{
        if(err){
          console.log(err)
        }else{
          
          res.redirect('/')
        }
  })
}










// ############################  profile page   ############################################################3


// get page
exports.profile = (req,res)=>{
    const TokenID = req.id.id

             pool.query('select * from users where id = ?',[TokenID],(err,rows)=>{
                if(err){
                   console.log(err)
               }else{
                   console.log(rows)
                    res.status(201).render('profile.ejs',{rows})
 } })

}





exports.profile_pic = (req,res)=>{
      
    let profileimg ;
    let uploadfile;
   
    if(!req.files || Object.keys(req.files).length === 0){
   
       return res.status(401).send("No file uploaded!")
    }
   
    profileimg = req.files.profileimg
    uploadfile =  "upload/" + profileimg.name
    console.log(__dirname)
    console.log(profileimg)
   
   
   //  use move function mv to place file on server
   profileimg.mv(uploadfile , (err)=>{
       if(err){
           return res.status(500).send('could not move')
       }
   })
                              const TokenID = req.id.id
   
         pool.query('update users set profile_pic = ? where id = ?',[profileimg.name, TokenID ],(err,rows)=>{
           
           if(err){
               console.log(err)
           }else{
               res.redirect('/profile')
               
           }
         })
         
   }





// ################################   posting page  ############################################################3333


// get page
exports.dairy = (req,res)=>{
    const TokenID = req.id.id
    pool.query('select * from users where id = ?',[TokenID],(err,rows)=>{
        if(err){
           console.log(err)
       }else{

        pool.query('select * from dairy where id = ?',[TokenID],(err,dairow)=>{
            if(err){
               console.log(err)
           }else{
              console.log(dairow)
            
               res.render('dairy.ejs',{rows,dairow})
    } })  
           
} })  
}



// post page to get the posted info
exports.dairyjotted = (req,res)=>{
     
    const TokenID = req.id.id

    const {jotter} = req.body

    
  
    pool.query('update dairy  set jotter = ? , id = ? where id = ?',[jotter,TokenID,TokenID],(err)=>{
        if(err){
           console.log(err)
       }else{
        
           res.redirect('/dairy')
} })  
    
        
       
}




exports.createjotter = (req,res)=>{
    const TokenID = req.id.id

    pool.query('insert into dairy set id = ?',[TokenID],(err)=>{
        if(err){
           console.log(err)
           res.redirect('/dairy')
       }else{
        
           res.redirect('/dairy')
} })  
}




// ##################################  chats ########################################################################################


// get page
exports.chats = (req,res)=>{
    pool.query('select * from posts ',(err,rows)=>{
        if(err){
           console.log(err)
       }else{ 

        const TokenID = req.id.id
        pool.query('select * from users where id = ?',[TokenID],(err,users)=>{
            if(err){
               console.log(err)
           }else{

            res.render('chats.ejs',{rows, users})
    } })  



          
    }
   })
}


exports.chated = (req,res)=>{ 

    const {pid ,pname, textpost} = req.body
    pool.query('insert into posts set pid = ? , post = ?, name = ?',[pid , textpost, pname],(err,result)=>{
        if(err){
            console.log(err)
        }else{
            // res.redirect('/chats');
            console.log('chated')
            res.redirect('/chats')
        }
    })
}