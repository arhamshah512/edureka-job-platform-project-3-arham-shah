const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000

const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/edureka_project_3_job_platform_arham')


function makeFieldsRequiredByDefault(schema) {
    schema.eachPath((path, type) => {
        if (type.instance !== 'ObjectId' && !type.options.hasOwnProperty('required')) {
            type.required = true
        }
    })
}

const JobListingSchema = new mongoose.Schema({
    id: String,
    title: String,
    description: String,
    duration: String,
    requirements: [String],
    location: String,
    pay: String,
    employerId: String,
    jobApplications: [String],
})

JobListingSchema.plugin(makeFieldsRequiredByDefault)

const JobListing = mongoose.model('JobListing', JobListingSchema) 

const JobSeekerSchema = new mongoose.Schema({
    role: String,
    name: String,
    username: String,
    hashedPasscode: String,
    jobsAppliedFor: [String],
    applicationsMade: [String],
})

JobSeekerSchema.plugin(makeFieldsRequiredByDefault)

const JobSeeker = mongoose.model('JobSeeker', JobSeekerSchema) 

const EmployerSchema = new mongoose.Schema({
    role: String,
    name: String,
    username: String,
    hashedPasscode: String,
    jobListingsCreated: [String],
})

EmployerSchema.plugin(makeFieldsRequiredByDefault)

const Employer = mongoose.model('Employer', EmployerSchema)

const ApplicationSchema = new mongoose.Schema({
    jobListing: String,
    jobSeeker: String,
    text: String,
    status: String
})

ApplicationSchema.plugin(makeFieldsRequiredByDefault)

const Application = mongoose.model('Application', ApplicationSchema)

const MessageSchema = new mongoose.Schema({
    senderId: String,
    receiverId: String,
    text: String,
    // isRead: Boolean
}, { timestamps: true })

MessageSchema.plugin(makeFieldsRequiredByDefault)

const Message = mongoose.model('Message', MessageSchema)

app.use(cors())
app.use(express.json())

app.get('/api/get-employers', (req, res) => {
    Employer.find().then(data => res.json(data))
})

app.get('/api/get-job-seekers', (req, res) => {
    JobSeeker.find().then(data => res.json(data))
})

app.get('/api/get-job-listings', (req, res) => {
    JobListing.find().then(data => res.json(data))
})

app.get('/api/get-applications', (req, res) => {
    Application.find().then(data => res.json(data))
})

app.get('/api/get-messages', (req, res) => {
    Message.find().then(data => res.json(data))
})

app.post('/api/create-new-user', async (req, res) => {
    try {
        const details = req.body
        const jobSeekers = await JobSeeker.find()
        const employers = await Employer.find()

        const existingUsernames = [
            ...jobSeekers,
            ...employers
        ].map(user => user.username)

        if (existingUsernames.includes(details.username)) {
            res.status(400).send('Username already exists.')
            return
        }

        if (details.role === 'Job Seeker') {
            const newUser = new JobSeeker(details)
            await newUser.save()
            res.status(201).json(newUser)
        } else {
            const newUser = new Employer(details)
            await newUser.save()
            res.status(201).json(newUser)
        }
    } catch (err) {
        console.log(err)
    }
})
 
app.post('/api/create-job-listing', async (req, res) => {
    try {
        const newJobListing = new JobListing(req.body)
        await newJobListing.save()
        const employer = await Employer.findById(newJobListing.employerId)

        await employer.updateOne({
            jobListingsCreated: [...employer.jobListingsCreated, newJobListing._id]
        })

        res.status(201).json(newJobListing.toObject())
    } catch (err) {
        console.log(err)
    }
})

app.post('/api/send-application', async (req, res) => {
    try {
        const details = req.body

        const newApplication = new Application(details)
        await newApplication.save()

        const jobSeeker = await JobSeeker.findById(details.jobSeeker)

        await jobSeeker.updateOne({
            jobsAppliedFor: [...jobSeeker.jobsAppliedFor, details.jobListing],
            applicationsMade: [...jobSeeker.applicationsMade, newApplication._id]
        })

        const jobListing = await JobListing.findById(details.jobListing)

        await jobListing.updateOne({
            jobApplications: [...jobListing.jobApplications, newApplication._id]
        })

        res.status(201).json(newApplication.toObject())
    } catch (err) {
        console.log(err)
    }
})

app.delete('/api/delete-application/', async (req, res) => {
    console.log(req.body)

    const application = await Application.findById(req.body.applicationId)
    await application.deleteOne()

    res.status(204)
})

app.put('/api/update-application-status', async (req, res) => {
    const details = req.body

    const application = await Application.findById(details.applicationId)
    await application.updateOne({ status: details.status })

    res.status(204)
})

app.post('/api/login', async (req, res) => {
    const details = req.body
    const jobSeekers = await JobSeeker.find()
    const employers = await Employer.find()

    const users = [
        ...jobSeekers,
        ...employers
    ]

    const usernames = users.map(user => user.username)

    const doesUsernameExist = usernames.includes(details.username)

    if (!doesUsernameExist) {
        res.status(400).send('Username does not exist.')
        return
    }

    if (doesUsernameExist) {
        const doesPasscodeMatch = users.find(user => user.username === details.username).hashedPasscode === details.hashedPasscode

        if (!doesPasscodeMatch) {
            res.status(400).send('Incorrect passcode.')
            return
        }
    
        const user = users.find(user => (
            user.username === details.username &&
            user.hashedPasscode === details.hashedPasscode
        ))

        res.status(200).json(user.toObject())
    }
})

app.post('/api/send-message', async (req, res) => {
    try {
        const newMessage = new Message(req.body)
        await newMessage.save()
        res.status(201).json(newMessage.toObject())
    } catch (err) {
        console.log(err)
    }    
})

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
})

// app.put('/api/update-message-is-read-boolean', async (req, res) => {
//     const details = req.body

//     const message = await Message.findById(details.messageId)
//     await message.updateOne({ isRead: details.isRead })

//     res.status(204)
// })  
