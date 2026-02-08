const adminAuth=(req, res, next) => {
     const token="xyz";
    const isAuthenticated=token==="xyz";
    console.log("Admin middleware executed");
    if(isAuthenticated){
        next();
    }else{
        res.status(401).send("Unauthorized");
    }
}

const UserAuth=(req, res, next) => {
     const token="xyz";
    const isAuthenticated=token==="xyz";
    console.log("User middleware executed");
    if(isAuthenticated){
        next();
    }else{
        res.status(401).send("Unauthorized");
    }
}

module.exports={adminAuth,UserAuth};