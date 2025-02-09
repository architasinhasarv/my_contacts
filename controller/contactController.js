const asyncHandler = require("express-async-handler")
const Contact = require("../models/contactModels");

// desc Get All contact
// @route Get /api/contacts
// @access private 
const getContact =asyncHandler(async (req,res) => {
    const contact = await Contact.find({created_by_id : req.user.id});
    // res.status(200).json({"message": "Get all contacts"});
    res.status(200).json({contact});
});

// desc Create a new contact
// @route Post /api/contacts
// @access private 
const createContact =asyncHandler(async (req,res) => {
    console.log("This is the body request", req.body);
    const {name, email, phone} = req.body;
    if( !name || !email || !phone) {
        // res.status(404).json({"message":"Please provide the name, email and phone "});
        res.status(400);
        throw new Error("All fields are mandatory");
    }
    const contact = await Contact.create({
        name,
        email,
        phone,
        created_by_id : req.user.id
    });
    // res.status(201).json({"message": "Add contacts"});
    res.status(201).json({contact});
});

// desc Update contact
// @route Put /api/contacts
// @access private 
const updateContact =asyncHandler(async (req,res) => {
    const contact = await Contact.findById(req.params.id);
    if (!contact){
        res.status(404);
        throw new Error("Contact not Found");
    }
    if (contact.created_by_id.toString() !== req.user.id ){
        res.status(403);
        throw new Error("User dont have permission to update the contact");
    }
    const updatedContact = await Contact.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new:true}
    );
    // res.status(201).json({"message": `Update contacts for ${req.params.id}`});
    res.status(201).json(updatedContact);
});

// des Delete contact
// @route Delete /api/contacts
// @access private 
const deleteContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
        res.status(404);
        throw new Error("Contact not Found");
    }
    if (contact.created_by_id.toString() !== req.user.id ){
            res.status(403);
            throw new Error("User dont have permission to delete the contact");
        }
        await Contact.deleteOne({ _id: req.params.id });

    res.status(200).json({ message: "Contact deleted successfully" });
});


// desc Get the particular contact
// @route Get /api/contacts
// @access private 
const getContactId =asyncHandler(async (req,res) => {
    const contact = await Contact.findById(req.params.id);
    if (!contact){
        res.status(404);
        throw new Error("Contact not Found");
    }
    res.status(201).json({contact});
});

module.exports= {getContact,
     createContact,
      getContactId,
       updateContact,
        deleteContact
    };