const sgMail = require('@sendgrid/mail')


sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email , name) =>{
    sgMail.send({
        to:email,
        from:'amey.bhattad72@gmail.com',
        subject:'Welcome to the Task Manager App!',
        text:`Thank you ${name} for joining with us. hope you enjoy!`
    })
}

const sendCancelEmail = (email,name)=>{
    sgMail.send({
        to:email,
        from:'amey.bhattad72@gmail.com',
        subject:'Account successfully Deleted!',
        text:`GoodBye ${name},We hope yo see you back soon!`
    })
}
module.exports={
    sendWelcomeEmail,
    sendCancelEmail

}