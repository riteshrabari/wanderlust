const User=require("../models/user.js");

module.exports.renderSignUpForm=(req,res)=>{
    res.render("user/signup.ejs");
}

module.exports.signUp=async(req,res)=>{
    try{
        let {username,email,password}=req.body;
        const newUser=new User({email,username});
        const registered = await User.register(newUser,password);
        req.login(registered,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to Wanderlust");
            res.redirect("/listings");
        })
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}

module.exports.renderSignInForm=(req,res)=>{
    res.render("user/login.ejs");
}

module.exports.login=async(req,res)=>{
    req.flash("success","Welcome back to Wanderlust");
    let redirect=res.locals.redirectUrl || "/listings";
    res.redirect(redirect);
}

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
       return next(err);
    })
    req.flash("success","Successfully logged out");
    res.redirect("/listings");
}