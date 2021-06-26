// require express
const express = require('express')

// require nodemailer
const nodemailer = require('nodemailer')

// require morgan 
const morgan = require('morgan')

// require dotenv
const dotenv = require('dotenv')

// require cors
const cors = require('cors')


// init express app
const app = express()

// init dotenv
dotenv.config()

app.use(cors())


// init express Middlewares
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(morgan('dev'))


// Email Config
// init smtpTransport
const smtpTransport = nodemailer.createTransport({
    host: "mail.nomadicmanagement.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});


smtpTransport.verify(function(error, success) {
    if (error) {
        console.log(error);
    } else {
        console.log("Email Server is connected Successfully");
    }
});



// init email endpoint 
app.post('/api/email', async(req, res) => {
    try {

        // get emailData
        const emailData = req.body


        // init mailOptions 
        const mailOptions = {
            from: "Nomadic Management <info@nomadicmanagement.com>",
            to: "steve@nomadicmanagement.com",
            subject: "New Trash Report",

            html: `<h3>Trash Report Details</3>
                <hr/> <br/>
                <p>FullName: ${emailData.fullName}</p>
                <p>Email: ${emailData.email}</p>
                <p>Phone: ${emailData.phone}</p>
                <p>Image: ${emailData.imageUrl}</p>
                <p>Longitude: ${emailData.long}</p>
                <p>Latitude: ${emailData.lat}</p>
                <p>Description: ${emailData.description}</p>
                <p>Address: ${emailData.trashLocation || ""} </p>
                <a href="https://www.google.com/maps/@${emailData.lat},${emailData.long},17z">View Location</a>


                <hr/>
                <small>Nomadic Management Team</small>

            `
        }

        // send email
        smtpTransport.sendMail(mailOptions, (error) => {
            if (error) {
                console.log(error)
                return res.status(400).json({
                    success: false,
                    error: error
                })
            }

            return res.json({
                success: true,
                message: "email send successfully"
            })
        })


    } catch (error) {
        console.log(error)
        return res.json({
            success: false,
            error: error
        })
    }
})


// app.use(express.static(path.join(__dirname, 'client/build')));
// app.get('*', function(req, res) {
//   res.sendFile(path.join(__dirname, '/client/build', 'index.html'));
// });


// listen
const PORT = process.env.PORT || 4002
app.listen(PORT, () => {
    console.log(`server listening at port ${PORT}`)
})