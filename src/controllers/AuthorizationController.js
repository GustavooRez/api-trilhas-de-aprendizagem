const jwt = require("jsonwebtoken");
const secretToken = "sdaFsadasdaGasdCMySecretKey";

var verify = function (req, res, next) {
  const auth = req.headers.authorization;

  if (auth) {
    jwt.verify(auth, secretToken, (err, verifiedJwt) => {
      if (err) {
        return res.json({ error: "Token não é válido" , err});
      } else {
        next()
      }
    });
  } else {
    return res.json({ error: "Você não está autenticado" });
  }
};

module.exports = verify;
