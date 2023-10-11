const Contact = require('../models/Contact')
const asyncHandler = require('express-async-handler')


const getMessages = asyncHandler(async (req, res) => {
  const messages = await Contact.find({}).exec()

  if(!messages.length) return res.status(404).json({message: "No message found"})

  res.status(200).json(messages)
})

const createMessage = asyncHandler(async (req, res) => {
  const {fullname, subject, mail, userMessage:message} = req.body
console.log(req.body)
  if(!fullname || !subject || !mail || !message) return res.status(400).json({message: "All fields are required"})

  const foundMessage = await Contact.findOne({mail}).exec()
  if(foundMessage && foundMessage.message === message) return res.status(409).json({message: "Message has already been logged. Thanks for reaching out!"})

  const newMessage = {
    fullname, subject, mail, message
  }

  try {
    const result = await Contact.create(newMessage)
    res.status(201).json(result)
  } catch (err) {
    res.status(400).json({message: "Invalid credentials"})
  }

});

module.exports = {getMessages, createMessage};
