const { verify } = require("jsonwebtoken")



// checking if user is not authenticated so that he cant access Home page 
const validateToken = (req , res,next)=>{
    const accessToken = req.cookies["accessToken"]
           if(!accessToken){

                 return res.redirect('/login')
                    } else{ 
                        try {
                            const validateToken = verify(accessToken,process.env.ACCESS_TOKEN_SECRET,(err,userID)=>{
                
                               if(err){ return res.redirect('/login') }
                                    // getting back my id from the jwt
                                       req.id = userID
                                       const jwtID = 'this id is from the token ' + userID.id
                                       console.log(jwtID)
                                       return next()
                                    })

        } catch (err) {return res.json({alert:"an erro in going home"})}
    }
}




// checking if user is authenticated so that he cant access login and register page
const ifAuthenticated = (req , res,next)=>{
    const accessToken = req.cookies["accessToken"]

    if(accessToken){

        return res.redirect('/')
    }else { 
        try { 
            return next()
        }catch (err) {
            return res.json({alert:"an erro in going home"})
        }
    }
}





module.exports = {validateToken , ifAuthenticated}