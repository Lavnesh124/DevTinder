#DevTinder

  ## AUthRouter
   -POST /signup
   -POST/login
   -POST/logout


   ##  ProfileRouter
   -GET/Profile
   -PATCH /profile/edit
   -PATCH/profile/password

   
   ## ConnectionRequestRouter
    -POST /request/send/:status/:userId
    -POST /request/review/:status/:requestID

   ## userRouter
     -GET /user/connections
     -GET /user/requests
     -GET /user/feed      - Gets us the profiles of other users on platform 