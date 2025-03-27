const nodemailer = require('nodemailer')
const pug = require('pug')
class Email{
    constructor(firstName,email){
        this.to = email
        this.firstName = firstName
        this.from = `Ahmed Shehab <${process.env.GMAIL_USER}>`
    }

    _newTransport(){
        return nodemailer.createTransport(
            {
                host: 'smtp.gmail.com',
                port: 587,
                secure: false, // Use STARTTLS
                auth: {
                  user: process.env.GMAIL_USER,
                  pass: process.env.GMAIL_PASS,
                },
                tls: {
                  ciphers: 'SSLv3',
                },
              }
        )
    }

    async _send(template,subject,data){
        const html = pug.renderFile(`${__dirname}/../views/emails/${template}.pug`,{...data})
        const mailOptions = {
            from:this.from,
            to:this.to,
            subject,
            html,
        }
        await this._newTransport().sendMail(mailOptions)
    }

    async sendVerificationMail(token){
        await this._send("verificationEmail","Verify Your Taskly Account",{
            firstName:this.firstName,
            token
        })
    }

    async sendInvitationMail(projectName,inviterName,invitationLink){
        await this._send("invitationEmail","Project Invitation",{
            username:this.firstName,
            projectName,
            inviterName,
            invitationLink
        })
    }
}

module.exports = Email