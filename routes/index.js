const express= require('express');
const router = express.Router();
const {ensureAuthenticated} =require('../config/auth');
const Contact = require('../models/contact');

//Welcome Page
router.get('/',(req,res)=> res.render('welcome'));

//Dashboard
router.get('/dashboard', (req,res) => 
{
    Contact.find({}).populate('user').exec(function(err,contacts){
       
        return res.render('dashboard',{
            title: "My Contacts List",
            contact_list: contacts
        })
    })
}

);

module.exports = router;


router.post('/dashboard/create-contact',function(req,res){
    //   contactList.push(
    //     {
    //         name : req.body.name,
    //         phone : req.body.phone
    //     }
    //ye use kiya tha app.use(bodyparser url encoding) waale feature ka jiski wajah se ye padh paa raha tha 
    //   );
        // contactList.push(req.body);
        Contact.create({
            name: req.body.name,
            phone: req.body.phone,
            user: req.user._id
        },function(err,newContact){
            if(err)
            {
                console.log('error in createing a contact');
                return ;
            }
    
            console.log('*****', newContact);
            return res.redirect('back');
        });
    
        // return res.redirect('/practise');
        // return res.redirect('/');
    });

   router.get('/dashboard/delete-contact/', function(req,res){
    
        //get the id from query in the ul
    
        let id = req.query.kurkure;
    
        //find the contact in the database using id and delete
    
        Contact.findByIdAndDelete(id,function(err){
    
            if(err)
            {
            console.log('Error found in database');
            return ;
            }    
       
            return res.redirect('back');
    
        });
    
        
    
        //console.log(req.query) ;
        //let phone = req.query.phone ;
        // let contactIndex = contactList.findIndex(contact => contact.phone ==phone);
    
        // if (contactIndex != -1)
        // {
        //     contactList.splice(contactIndex,1);
        // }
    
    
    
    
    
    
    
    
    
    
    // Understanding query params  
    
        // app.get('/delete-contact/',function(req,res){
        //     console.log(req.params);
    
        // }) will print name : ____  phone : _____ 
    
    
    
    
    
    
    
    
    
    });


