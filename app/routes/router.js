const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const nodemailer = require('nodemailer')
const dotenv = require("dotenv").config()


let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});



router.get('/', function (req, res) {
    res.render("pages/index", { "erros": null, "valores": { "nome":"","email":"","telefone":"","assunto":"","mensagem":""}, "retorno": null });
});

router.post("/formulario", 
    
        body("nome").notEmpty().withMessage('Preencha o nome').bail().isLength({ min: 3, max: 30}).withMessage("Nome deve ter de 3 a 30 caracteres!"),
        body("email").isEmail(),
        body("telefone").isLength({ min:11 , max: 11}).withMessage("Numero deve ter 11 caracteres!"),
        body("assunto").isLength({ min: 1, max: 30}).withMessage("O assunto deve ter de 1 a 30 caracteres!"),
        body("mensagem").isLength({min: 5, max: 500}).withMessage("A mensagem deve ter de 1 até 500 caracteres!"),

    function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors);
            return res.render("pages/index", { "erros": errors, "valores":req.body, "retorno":null});
        }
            return res.render("pages/index", { "erros": null, "valores": req.body, "retorno":req.body});     

})

const mailOptions = {
    from: process.env.EMAIL_USER,
    to: req.body.email,
    subject: req.body.assunto,
    text: req.body.mensagem,
};

transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.log(error);
    } else {
        console.log(info);
        console
    }
})    


module.exports = router;