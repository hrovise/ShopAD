const jwt = require("jsonwebtoken");

module.exports = (req, res, next)=>{
  try {
    console.log('if failed');
    const token = req.headers.authorization.split(" ")[1];

    const decodedToken = jwt.verify(token, 'secret_this_should_be_longer');

  req.userData = {role: decodedToken.role, email: decodedToken.email, userId: decodedToken.userId}
  next();
  } catch(error) {
    res.json({message:"Auth failed"});
  }
};
