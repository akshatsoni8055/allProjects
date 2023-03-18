const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

function sendPassword(recipient, password) {
    const msg = {
        to: recipient,
        from: 'akshatsoni8055@gmail.com',
        subject: 'Login Sussessful',
        html: `<p>Your password is :</p><br><strong>${password}</strong> <br> 
               <p> You can use this password to login next time into our application <p>`,
    }


    sgMail.send(msg).then(() => { }, error => {
        console.error(error);

        if (error.response) {
            console.error(error.response.body)
        }
    });

}

function query(msg) {
    const mail = {
        to: 'akshatsoni8055@gmail.com',
        from: 'akshatsoni8055@gmail.com',
        subject: msg.subject,
        html: `<strong>${msg.email}</strong> <br> ${msg.name} <br> <p> ${msg.message} </p>`
    }
    return sgMail.send(mail).then(resp => { return true }, error => { return false });
}

module.exports = { query, sendPassword }