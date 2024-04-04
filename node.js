//Install Command:
//npm init
//npm i express express-handlebars body-parser

//Common Project Heirarchy
//  Project Folder
//    = views (required for handlebars)
//        = layouts
//        = partials
//    = public
//    = routes
//    = node_modules
//    = app.js
//    = package.json

//Handlebars is an embeded technology that can be used to include one
//page into another. This is similar to how to how PhP and Servlets
//organize their views.
//https://www.npmjs.com/package/express-handlebars

const { User_accModel, ProfileModel, ReplyModel, ReviewsModel, ShopOwnerModel, LaundryShopModel } = require('./models/database/mongoose');

const fs = require('fs/promises');
async function importData() {
    try {
        // Read data from JSON files
        const userData = await fs.readFile('./models/database/sampledata/user_accSample.json', 'utf8');
        const profileData = await fs.readFile('./models/database/sampledata/profileSample.json', 'utf8');
        const repliesData = await fs.readFile('./models/database/sampledata/replySample.json', 'utf8');
        const reviewsData = await fs.readFile('./models/database/sampledata/reviewsSample.json', 'utf8');
        const shopOwnerData = await fs.readFile('./models/database/sampledata/laundry_shop_ownerSample.json', 'utf8');
        const laundryShopData = await fs.readFile('./models/database/sampledata/laundry_shopSample.json', 'utf8');

        // Parse JSON data
        const users = JSON.parse(userData);
        const profiles = JSON.parse(profileData);
        const reviews = JSON.parse(reviewsData);
        const replies = JSON.parse(repliesData);
        const shopOwners = JSON.parse(shopOwnerData);
        const laundryShops = JSON.parse(laundryShopData);

        // Check if data already exists in collections
        const existingUsers = await User_accModel.countDocuments();
        const existingProfiles = await ProfileModel.countDocuments();
        const existingReviews = await ReviewsModel.countDocuments();
        const existingReplies = await ReplyModel.countDocuments();
        const existingShopOwners = await ShopOwnerModel.countDocuments();
        const existingLaundryShops = await LaundryShopModel.countDocuments();

        // Insert data into MongoDB collections if they don't exist
        if (existingUsers === 0) {
            await User_accModel.insertMany(users);
            console.log('User accounts imported');
        }

        if (existingProfiles === 0) {
            await ProfileModel.insertMany(profiles);
            console.log('Profiles imported');
        }

        if (existingReviews === 0) {
            await ReviewsModel.insertMany(reviews);
            console.log('Reviews imported');
        }

        if (existingReplies === 0) {
            await ReplyModel.insertMany(replies);
            console.log('Replies imported');
        }

        if (existingShopOwners === 0) {
            await ShopOwnerModel.insertMany(shopOwners);
            console.log('Shop owners imported');
        }

        if (existingLaundryShops === 0) {
            await LaundryShopModel.insertMany(laundryShops);
            console.log('Laundry shops imported');
        }

        console.log('Data import completed');
    } catch (error) {
        console.error('Error importing data:', error);
    }
}
importData();

const express = require('express');
const session = require('express-session');
const fileUpload = require('express-fileupload');
const bcrypt = require('bcrypt'); // NEW ADDITION
const passport = require('passport'); // NEW ADDITION
const LocalStrategy = require('passport-local').Strategy; // NEW ADDITION
const flash = require('express-flash'); // NEW ADDITION

const server = express();
server.use(fileUpload()) // for fileuploads
const path = require('path') // our path directory

//This is a new library called Body Parser. This system will parse the data
//from its internal JSon system to make request messages simpler.
const bodyParser = require('body-parser')
server.use(bodyParser.json());
server.use(express.json()); 
server.use(express.urlencoded({ extended: true }));

// NEW ADDITION
server.use(session({
    secret: 'penpen',
    resave: false,
    saveUninitialized: false
    //store
}));
server.use(passport.initialize());
server.use(passport.session());
server.use(flash());

//The system must use the hbs view engine. When this is used,
//it will require a folder called "views" where all the embeded
//javascript files will be used. Sub-foldering may also be used.
const handlebars = require('express-handlebars');
server.set('view engine', 'hbs');
server.engine('hbs', handlebars.engine({
    extname: 'hbs'
}));


// Define the helper function
const generateStars = function(rating) {
    let starsHTML = '';
    for (let i = 0; i < rating; i++) {
        starsHTML += '<img src="image/star.png" alt="" class="starsImg">';
    }
    return starsHTML;
};

// NEW VERSION
const checkEqual = async function (req, value2) {
    if (!req.user) {
        return false;
    }

    try {
        const profileInfo = await ProfileModel.findOne({ username: req.user.username }).lean();

        if (!profileInfo) {
            return false;
        }

        return profileInfo.username === value2;
    } catch (error) {
        console.error("An error occurred:", error);
        return false;
    }
};

const checkLikeReview = async function (req, reviewId) {
    if (!req.user) {
        return false; // If the user is not logged in, return false
    }

    try {
        const profileInfo = await ProfileModel.findOne({ username: req.user.username }).lean();

        if (!profileInfo || !profileInfo.likes) {
            return false; // If user's profile info or likes array is not found, return false
        }

        // Check if the provided reviewId exists in the user's liked reviews
        const likedReview = profileInfo.likes.find(like => like.reviewId === reviewId);
        return likedReview !== undefined;
    } catch (error) {
        console.error("An error occurred:", error);
        return false; // Return false in case of any error
    }
};

const checkDislikeReview = async function (req, reviewId) {
    if (!req.user) {
        return false; // If the user is not logged in, return false
    }

    try {
        const profileInfo = await ProfileModel.findOne({ username: req.user.username }).lean();

        if (!profileInfo || !profileInfo.likes) {
            return false; // If user's profile info or likes array is not found, return false
        }

        // Check if the provided reviewId exists in the user's liked reviews
        const dislikedReview = profileInfo.dislikes.find(dislike => dislike.reviewId === reviewId);
        return dislikedReview !== undefined;
    } catch (error) {
        console.error("An error occurred:", error);
        return false; // Return false in case of any error
    }
};

const checkLikeReply = async function (req, replyId) {
    if (!req.user) {
        return false; // If the user is not logged in, return false
    }

    try {
        const profileInfo = await ProfileModel.findOne({ username: req.user.username }).lean();

        if (!profileInfo || !profileInfo.likes) {
            return false; // If user's profile info or likes array is not found, return false
        }

        // Check if the provided reviewId exists in the user's liked reviews
        const likedReply = profileInfo.likesReply.find(like => like.replyId === replyId);
        return likedReply !== undefined;
    } catch (error) {
        console.error("An error occurred:", error);
        return false; // Return false in case of any error
    }
};

const checkDislikeReply = async function (req, replyId) {
    if (!req.user) {
        return false; // If the user is not logged in, return false
    }

    try {
        const profileInfo = await ProfileModel.findOne({ username: req.user.username }).lean();

        if (!profileInfo || !profileInfo.likes) {
            return false; // If user's profile info or likes array is not found, return false
        }

        // Check if the provided reviewId exists in the user's liked reviews
        const dislikedReply = profileInfo.dislikesReply.find(dislike => dislike.replyId === replyId);
        return dislikedReply !== undefined;
    } catch (error) {
        console.error("An error occurred:", error);
        return false; // Return false in case of any error
    }
};

// NEW VERSION
// Use the helper function when setting up the Handlebars engine
server.engine('hbs', handlebars.engine({
    extname: 'hbs',
    helpers: {
        generateStars: generateStars,
        checkEqual : checkEqual
    }
}))

//Note: it is also possible to use the keyword 'handlebars' and the
//      extension '.handlebars". In this example, the shorthand is used.

//This is where static resources are loaded. Client side files like
//CSS and JS files can be stored here. Images can be placed as well.
server.use(express.static('public'));

//To use the HBS functionality, use the function called render
//and render the HBS file from the view folder. It will require
//a layout hbs from the layouts folder which will serve as a
//frame to the webpage.
server.get('/', function(req, resp){
    let currentUser;
    if(req.user) {
        currentUser = '@' + req.user.username;
    } else {
        currentUser = "No user logged in.";
    }
    resp.render('homepage',{
        layout: 'index',
        title: 'Homepage',
        cssFile: 'homepage',
        javascriptFile: 'homepage',
        currentUser : currentUser
    });
});

// NAVIGATION BAR LINKS
server.get('/homepage', function(req, resp){
    
    let currentUser;
    if(req.user) {
        currentUser = '@' + req.user.username;
    } else {
        currentUser = "No user logged in.";
    }

    resp.render('homepage',{
        layout: 'index',
        title: 'Homepage',
        cssFile: 'homepage',
        javascriptFile: 'homepage',
        currentUser : currentUser
    });
});


server.get('/log_in', function(req, resp){
    resp.render('log_in', {
        layout: 'index',
        title: 'Login Page',
        cssFile: 'log_in_style',
        javascriptFile: 'log_in'
    });
});

server.get('/search', function(req, resp){
    resp.render('search',{
        layout: 'index',
        title: 'Search',
        cssFile: 'search',
        javascriptFile: 'search'
    });
});

// NEW VERSION
server.get('/profile', checkAuthenticated, async function(req, resp){
    try {
        const profileInfo = await ProfileModel.find({username : req.user.username}).lean();
        const OwnerProfileInfo = await ShopOwnerModel.find({username : req.user.username}).lean();
        const profileReviews = await ReviewsModel.find({username : req.user.username}).lean();
        const profileReplies = await ReplyModel.find({username : req.user.username}).lean();
        resp.render('profile',{
            layout: 'index',
            title: 'Profile Page',
            cssFile: 'profile_style',
            profile : profileInfo[0] != null ? profileInfo[0] : OwnerProfileInfo[0],
            reviews : profileReviews,
            replies : profileReplies,
        });
    } catch(error) {
        console.error(error);
        // Handle the error, e.g., render an error page or send an error response
        resp.status(500).send('Internal Server Error');
    }
});

server.get('/sign_up', function(req, resp){
    resp.render('sign_up',{
        layout: 'index',
        title: 'Sign up Page',
        cssFile: 'sign_up_style',
        javascriptFile: 'sign_up'
    });
});

// NEW VERSION
server.get('/logout', function(req, res, next) {
    req.logout(function(err) {
        if (err) { return next(err); }
            res.redirect('/homepage?=logged_out');
    });
});


//
server.get('/establishment_owner_response_:username', async function(req, resp){
    try {
        const username = req.params.username;
        const ownerProfile = await ShopOwnerModel.find({username : username}).lean();
        const profileReplies = await ReplyModel.find({username : username}).lean();
        resp.render('establishment_owner_response',{
        layout: 'index',
        title: 'Establishment Owner Response Page',
        cssFile: 'establishment_owner_response',
        javascriptFile: 'establishment_owner_response',
        owner_profile : ownerProfile[0],
        replies : profileReplies
    });
    } catch (error) {
        console.error(error);
        // Handle the error, e.g., render an error page or send an error response
        resp.status(500).send('Internal Server Error');
    }
});

server.get('/search_result', function(req, resp){
    resp.render('search_result',{
        layout: 'index',
        title: 'Search Result Page',
        cssFile: 'search_result',
        javascriptFile: 'search',
        javascriptFile2: 'homepage'
    });
});

server.get('/edit_profile', async function(req, resp){
    try {
        // const loggedin = await User_accModel.find({isLoggedin : true}).lean(); //debugging
        const profileInfo = await ProfileModel.find({username : req.user.username}).lean(); 
        const OwnerProfileInfo = await ShopOwnerModel.find({username : req.user.username}).lean();

        resp.render('edit_profile',{
            layout: 'index',
            title: 'Edit Profile Page',
            cssFile: 'edit-profile',
            javascriptFile: 'edit-profile',
            profile : profileInfo[0] != null ? profileInfo[0] : OwnerProfileInfo[0]
        });
    } catch (error) {
        console.error(error);
        // Handle the error, e.g., render an error page or send an error response
        resp.status(500).send('Internal Server Error');
    }
});

server.get('/view_other_profile_:username', async function(req, resp){
    try {
        const username = req.params.username; 
        const profileInfo = await ProfileModel.find({username : username}).lean();
        const OwnerProfileInfo = await ShopOwnerModel.find({username : username}).lean();
        const profileReviews = await ReviewsModel.find({username : username}).lean();
        const profileReplies = await ReplyModel.find({username : username}).lean();

        resp.render('view_other_profile', {
        layout: 'index',
        title: `Profile Page of ${username}`, 
        cssFile: 'view_other_profile',
        javascriptFile: 'view_other_profile',
        username: username, 
        profile : profileInfo[0] != null ? profileInfo[0] : OwnerProfileInfo[0],
        reviews : profileReviews,
        replies : profileReplies
    });
    } catch (error) {
        console.error(error);
        // Handle the error, e.g., render an error page or send an error response
        resp.status(500).send('Internal Server Error');
    }
    
});

// ALL THE LAUNDRY SHOPS
server.get('/Weclean', async function(req, resp){
    try {
        const reviews = await ReviewsModel.find({shop : "Weclean Laundry Shop"}).lean();
        const Weclean = await LaundryShopModel.find({_id : "Weclean Laundry Shop"}).lean();

        resp.render('Weclean', {
            layout: 'index',
            title: 'Weclean Laundry Shop',
            cssFile: 'style',
            javascriptFile: 'javascript',
            reviews: reviews,
            Weclean: Weclean[0],
            content: Weclean[0],
        });
    } catch (error) {
        console.error(error);
        resp.status(500).send('Internal Server Error');
    }
});

server.get('/7FoldsLaundry', async function(req, resp){
    try {
        const reviews = await ReviewsModel.find({shop : "7Folds Laundry Shop"}).lean();
        const _7Folds = await LaundryShopModel.find({_id : "7Folds Laundry Shop"}).lean();

        resp.render('7FoldsLaundry',{
            layout: 'index',
            title: '7Folds Laundry Shop Page',
            cssFile: 'style',
            javascriptFile: 'javascript',
            reviews: reviews,
            _7Folds: _7Folds[0],
            content: _7Folds[0]
        });
    } catch (error) {
        console.error(error);
        resp.status(500).send('Internal Server Error');
    }
});

server.get('/XYZLaundryService', async function(req, resp){
    try {
        const reviews = await ReviewsModel.find({shop : "XYZ Laundry Service"}).lean();
        const XYZ = await LaundryShopModel.find({_id : "XYZ Laundry Service"}).lean();

        resp.render('XYZLaundryService',{
            layout: 'index',
            title: 'XYZ Laundry Shop Page',
            cssFile: 'style',
            javascriptFile: 'javascript',
            reviews: reviews,
            XYZ : XYZ[0],
            content: XYZ[0],
        });
    } catch (error) {
        console.error(error);
        resp.status(500).send('Internal Server Error');
    }
    
});

server.get('/NonstopLaundryShopMalate', async function(req, resp){
    const reviews = await ReviewsModel.find({shop : "Nonstop Laundry Shop Malate"}).lean();
    const Nonstop = await LaundryShopModel.find({_id : "Nonstop Laundry Shop Malate"}).lean();

    try {
        resp.render('NonstopLaundryShopMalate',{
            layout: 'index',
            title: 'Nonstop Laundry Shop Malate Page',
            cssFile: 'style',
            javascriptFile: 'javascript',
            reviews : reviews,
            Nonstop : Nonstop[0],
            content: Nonstop[0]
        });
    } catch (error) {
        console.error(error);
        // Handle the error, e.g., render an error page or send an error response
        resp.status(500).send('Internal Server Error');
    }
});
//

// CRUD SECTION - Create Read Update Delete
// NEW VERSION
server.post('/submit_review', async function(req, resp) {  
    try {
        console.log("Entering"); //debugging

        //comment Img
        const commentImg = req.files && req.files.commentImg;

        // date
        const currentDate = new Date();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Adding 1 because months are zero-based
        const day = String(currentDate.getDate()).padStart(2, '0');
        const year = String(currentDate.getFullYear()).slice(-2); // Getting last two digits of the year
        const formattedDate = `${month}/${day}/${year}`;

        // _id
        const count = await ReviewsModel.countDocuments();
        const newReviewId = `review_${count + 1}`;
        
        // username (currently loggedIn)
        // const loggedin = await User_accModel.find({isLoggedin : true}).lean(); //debugging
        const profileInfo = await ProfileModel.findOne({username : req.user.username}).lean();
        const OwnerProfileInfo = await ProfileModel.findOne({username : req.user.username}).lean();
    
        // Extract data from the request body
        const { shop_name, rtitle, rcomment, rate } = req.body;
        
        // Create a new review document
        if (commentImg) {
            // Move the uploaded file to the destination
            commentImg.mv(path.resolve(__dirname, 'public/image', commentImg.name), (error) => {
                if (error) {
                    console.log("Error!");
                } else {
                    // Create the review with commentImg
                    ReviewsModel.create({
                        _id: newReviewId,
                        shop: shop_name,
                        username: req.user.username,
                        profile_pic: profileInfo != null ? profileInfo.profile_pic: OwnerProfileInfo.profile_pic,
                        title: rtitle,
                        content: rcomment,
                        commentImg: '/image/' + commentImg.name,
                        date: formattedDate,
                        likes: 0,
                        dislikes: 0,
                        rating: parseInt(rate),
                        replies: null
                    });
                    // Log success message
                    console.log('Review added successfully');
                }
            });
        } else {
            // Create the review without commentImg (if null)
            ReviewsModel.create({
                _id: newReviewId,
                shop: shop_name,
                username: req.user.username,
                profile_pic: profileInfo != null ? profileInfo.profile_pic: OwnerProfileInfo.profile_pic,
                title: rtitle,
                content: rcomment,
                commentImg: null,
                date: formattedDate,
                likes: 0,
                dislikes: 0,
                rating: parseInt(rate),
                replies: null
            });
            // Log success message
            console.log('Review added successfully without an image');
        }

        // Increment counter
        const shop = await LaundryShopModel.findOneAndUpdate (
            { shop_name: shop_name }, 
            { $inc: { totalNoRating: 1 } }, 
            { new: true } 
        );

        // REDIRECTING
        if(shop_name === "Weclean Laundry Shop")
            resp.redirect(`/Weclean`);
        else if (shop_name === "XYZ Laundry Service")
            resp.redirect("/XYZLaundryService");
        else if (shop_name === "7Folds Laundry Shop")
            resp.redirect("/7FoldsLaundry");
        else
            resp.redirect("/NonstopLaundryShopMalate");

    } catch (error) {
        console.error(error);
        resp.status(500).send('Internal Server Error');
    }
});

server.post('/submit_edit_profile', async function(req, resp) {
    try {
        console.log("Entering"); //debugging
        
        // Getting the data
        const { firstname, lastname, username, nUsername, email, mobnum, shortdesc } = req.body;
        const profile_pic = req.files && req.files.profile_pic;

        //checking if the new username, already exists
        const users = await User_accModel.find({}).lean();

        // Check if username already exists
        if(username === nUsername) {
            //do nothing
        }
        else if (users.some(user => user.username === nUsername)) {
            return resp.status(400).redirect('/edit_profile?=Username already exists');
        }

        // Image 
        let file;
        if(profile_pic) {
            profile_pic.mv(path.resolve(__dirname, 'public/image', profile_pic.name));
            file = '/image/'+ profile_pic.name;
        }
        else {
            const profile = await ProfileModel.findOne({username: username}).lean();
            const OwnerProfileInfo = await ShopOwnerModel.findOne({username: username}).lean();
            
            if(profile !== null) {
                file = profile.profile_pic;
            } else file = OwnerProfileInfo.profile_pic;
                
        }

        // Document Update
        await User_accModel.findOneAndUpdate(
            { username: username },
            { $set: { username: nUsername} },
            { new: true }
        );

        await ProfileModel.findOneAndUpdate(
            { username: username },
            {
                $set: {
                    firstname: firstname,
                    lastname: lastname,
                    username: nUsername,
                    email: email,
                    mobnum: mobnum,
                    shortdesc: shortdesc,
                    name: firstname + " " + lastname,
                    profile_pic: file
                }
            },
            { new: true }
        );
        
        //pa add sa server.post('/submit_edit_profile')
        //sa baba ng await ProfileModel.findOneAndUpdate
        await ShopOwnerModel.findOneAndUpdate(
            { username: username },
            {
                $set: {
                    firstname: firstname,
                    lastname: lastname,
                    username: nUsername,
                    email: email,
                    mobnum: mobnum,
                    shortdesc: shortdesc,
                    name: firstname + " " + lastname,
                    profile_pic: file
                }
            },
            { new: true }
        );

        await ReviewsModel.updateMany(
            { username: username },
            { 
                $set: { 
                    username: nUsername,
                    profile_pic: file
                } 
            }
        );

        await ReviewsModel.updateMany(
            { "replies.username": username },
            { 
                $set: { 
                    "replies.$.username": nUsername,
                    "replies.$.profile_pic": file
                } 
            }
        );

        await ReplyModel.updateMany(
            { username: username },
            { 
                $set: { 
                    username: nUsername,
                    profile_pic: file
                } 
            }
        );

        resp.redirect('/profile?=successful');

    } catch (error) {
        console.error(error);
        resp.status(500).send('Internal Server Error');
    }
}); 

server.post('/register', async function(req, resp) {
    try {
        console.log("Entering"); //debugging
        
        // Getting the data
        const { firstname, lastname, username, email, mobnum, shortdesc, password, confirmPassword } = req.body;
        const profile_pic = req.files && req.files.profile_pic;

        const users = await User_accModel.find({}).lean();
        // Check if username already exists
        if (users.some(user => user.username === username)) {
            return resp.status(400).redirect('/sign_up?=Username already exists');
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Document Creation
        profile_pic.mv(path.resolve(__dirname,'public/image',profile_pic.name),(error) => {
            if (error) {
                console.log("Error!");
            }
            else {
                ProfileModel.create({
                    ...req.body,
                    name: firstname + " " + lastname,
                    ratingCount: 0,
                    rating_ave: 0,
                    reviewsNo: 0,
                    reviews: null,
                    likes : [],
                    dislikes : [],
                    likesReply : [],
                    dislikesReply : [],
                    profile_pic:'/image/'+ profile_pic.name
                });
                User_accModel.create({
                    username : username,
                    password : hashedPassword,
                    isLoggedin : false,
                    rememberMe : false
                });
                resp.redirect('/homepage?=successful');
            }
        });
    } catch (error) {
        console.error(error);
        resp.status(500).send('Internal Server Error');
    }
});

server.delete('/reviews/:id/:shop', async (req, res) => {
    const reviewId = req.params.id;
    const name = req.params.shop;

    try {
        const deletedReview = await ReviewsModel.findByIdAndDelete(reviewId);

        if (!deletedReview) {
            // If the review with the given ID is not found, send a 404 status
            return res.status(404).json({ error: 'Review not found' });
        }

        const shop_name = await LaundryShopModel.findOneAndUpdate (
            { shop_name: name }, 
            { $inc: { totalNoRating: -1 } }, 
            { new: true } 
        );
        // Send a success response
        res.json({ message: 'Review deleted successfully' });
    } catch (error) {
        // If an error occurs, send a 500 status with the error message
        console.error('Error deleting review:', error);
        res.status(500).json({ error: 'Error deleting review' });
    }
});

// NEW ADDITON
server.post('/checkEqual', async (req, resp) => {
    const username = req.body.username;
    
    try {
        const result = await checkEqual(req, username);
        resp.send(result);
    } catch (error) {
        resp.status(500).send(error);
    }
});

server.post('/checkLogin', async (req, resp) => {
    let result = false;
    try {
        if(req.user) {
            result = true
        }
        resp.send(result);
    } catch (error) {
        resp.status(500).send(error);
    }
});

server.post('/checkLikeReview/:id', async (req, res) => {
    const reviewId = req.params.id;
    try {
        // Assuming req.user is available
        const liked = await checkLikeReview(req, reviewId);
        res.json(liked); // Send the result back to the client
    } catch (error) {
        console.error("An error occurred:", error);
        res.status(500).send("Internal Server Error"); // Handle errors
    }
});

server.post('/checkDislikeReview/:id', async (req, res) => {
    const reviewId = req.params.id;
    try {
        // Assuming req.user is available
        const disliked = await checkDislikeReview(req, reviewId);
        res.json(disliked); // Send the result back to the client
    } catch (error) {
        console.error("An error occurred:", error);
        res.status(500).send("Internal Server Error"); // Handle errors
    }
});

server.post('/checkLikeReply/:id', async (req, res) => {
    const replyId = req.params.id;
    try {
        // Assuming req.user is available
        const liked = await checkLikeReply(req, replyId);
        res.json(liked); // Send the result back to the client
    } catch (error) {
        console.error("An error occurred:", error);
        res.status(500).send("Internal Server Error"); // Handle errors
    }
});

server.post('/checkDislikeReply/:id', async (req, res) => {
    const replyId = req.params.id;
    try {
        // Assuming req.user is available
        const disliked = await checkDislikeReply(req, replyId);
        res.json(disliked); // Send the result back to the client
    } catch (error) {
        console.error("An error occurred:", error);
        res.status(500).send("Internal Server Error"); // Handle errors
    }
});

// PASSPORT.JS FOR LOGIN AUTHENTICATION
passport.use(new LocalStrategy(
    async function(username, password, done) {
        try {
            // Find the user in your database
            const user = await User_accModel.findOne({ username });
            if (!user) {
                // If user not found, return false
                return done(null, false, { message: 'Incorrect username.' });
            }
            // Check if password matches
            const isMatch = await bcrypt.compare(password, user.password);
            
            console.log(password);
            console.log(user.password);

            if (isMatch) {
                // If username and password are correct, return the user
                return done(null, user);
            }
            // If password doesn't match, return false
            // await User_accModel.updateOne({ username }, { $set: { isLoggedin: true } }); //debugging
            return done(null, false, { message: 'Incorrect password.' });
        } catch (error) {
            return done(error);
        }
    }
));

// Serialize user object to store in the session
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

// Deserialize user object from the session
passport.deserializeUser(async function(id, done) {
    try {
        const user = await User_accModel.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

// Log in route using Passport.js authentication
server.post('/log_in', passport.authenticate('local', {
    successRedirect: '/homepage?log_in=successful',
    failureRedirect: '/log_in?error=not_matched',
    failureFlash: true
}));

// FUNCTION
function checkAuthenticated (req, resp, next) {
    if(req.isAuthenticated()) {
        return next();
    }

    resp.render('login_alert', { layout: 'index' });
}

// update the number of likes and dislikes in REVIEWS
server.post('/like_review/:id', async (req, res) => {
    const reviewId = req.params.id;

    try {
        const updatedReview = await ReviewsModel.findByIdAndUpdate(
            reviewId, 
            { $inc: { likes: 1 } }, 
            { new: true } 
        );

        if (!updatedReview) {
            return res.status(404).json({ error: 'Review not found' });
        }

        // Update the user's profile to add the liked review to the likes array
        const updatedProfile = await ProfileModel.findOneAndUpdate(
            { username: req.user.username },
            { $push: { likes: { reviewId: reviewId } } }, // Assuming likes is an array of objects with reviewId field
            { new: true }
        );

        if (!updatedProfile) {
            return res.status(404).json({ error: 'User profile not found' });
        }

        console.log('Review liked');
        res.json({ message: 'Review liked successfully', review: updatedReview });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error liking review' });
    }
});

server.post('/unlike_review/:id', async (req, res) => {
    const reviewId = req.params.id;

    try {
        const updatedReview = await ReviewsModel.findByIdAndUpdate(
            reviewId, 
            { $inc: { likes: -1 } }, 
            { new: true } 
        );

        if (!updatedReview) {
            return res.status(404).json({ error: 'Review not found' });
        }

        const updatedProfile = await ProfileModel.findOneAndUpdate(
            { username: req.user.username },
            { $pull: { likes: { reviewId: reviewId } } }, // Remove the reviewId from likes array
            { new: true }
        );

        if (!updatedProfile) {
            return res.status(404).json({ error: 'User profile not found' });
        }

        console.log('Review liked');
        res.json({ message: 'Review liked successfully', review: updatedReview });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error liking review' });
    }
});

server.post('/dislike_review/:id', async (req, res) => {
    const reviewId = req.params.id;

    try {
        const updatedReview = await ReviewsModel.findByIdAndUpdate(
            reviewId, 
            { $inc: { dislikes: 1 } }, 
            { new: true } // update odocument
        );

        if (!updatedReview) {
            return res.status(404).json({ error: 'Review not found' });
        }

        const updatedProfile = await ProfileModel.findOneAndUpdate(
            { username: req.user.username },
            { $push: { dislikes: { reviewId: reviewId } } }, // Remove the reviewId from likes array
            { new: true }
        );

        if (!updatedProfile) {
            return res.status(404).json({ error: 'User profile not found' });
        }

        console.log('disliked review');
        res.json({ message: 'Review disliked successfully', review: updatedReview });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error disliking review' });
    }
});

server.post('/undislike_review/:id', async (req, res) => {
    const reviewId = req.params.id;

    try {
        const updatedReview = await ReviewsModel.findByIdAndUpdate(
            reviewId, 
            { $inc: { dislikes: -1 } }, 
            { new: true } // update odocument
        );

        if (!updatedReview) {
            return res.status(404).json({ error: 'Review not found' });
        }

        const updatedProfile = await ProfileModel.findOneAndUpdate(
            { username: req.user.username },
            { $pull: { dislikes: { reviewId: reviewId } } }, // Remove the reviewId from likes array
            { new: true }
        );

        if (!updatedProfile) {
            return res.status(404).json({ error: 'User profile not found' });
        }

        console.log('disliked review');
        res.json({ message: 'Review disliked successfully', review: updatedReview });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error disliking review' });
    }
});
// --------------------------------------------------



// update the number of likes and dislikes in REPLIES
server.post('/like_reply/:reviewId/:replyId', async (req, res) => {
    const reviewId = req.params.reviewId;
    const replyId = req.params.replyId;

    try {

        const review = await ReviewsModel.findOne({_id : reviewId});
        const reply = review.replies.find(reply => reply._id === replyId);

        // console.log(review);
        // console.log(reply);

        // Check if the reply exists
        if (!reply) {
            return res.status(404).json({ error: 'Reply not found' });
        }

        const updatedReply = await ReplyModel.findByIdAndUpdate(
            replyId, 
            { $inc: { likes: 1 } }, 
            { new: true } // update document
        );

        if (!updatedReply) {
            return res.status(404).json({ error: 'Reply not found' });
        }

        const updatedProfile = await ProfileModel.findOneAndUpdate(
            { username: req.user.username },
            { $push: { likesReply: { replyId: replyId } } }, // Assuming likes is an array of objects with reviewId field
            { new: true }
        );

        if (!updatedProfile) {
            return res.status(404).json({ error: 'User profile not found' });
        }

        // Increment the likes of the reply
        console.log(reply.likes);
        reply.likes++;

        // Save the updated review
        await review.save();

        console.log('Liked reply');
        res.json({ message: 'Reply liked', reply: updatedReply });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error liking reply' });
    }
});

server.post('/unlike_reply/:reviewId/:replyId', async (req, res) => {
    const reviewId = req.params.reviewId;
    const replyId = req.params.replyId;

    try {

        const review = await ReviewsModel.findOne({_id : reviewId});
        const reply = review.replies.find(reply => reply._id === replyId);

        // Check if the reply exists
        if (!reply) {
            return res.status(404).json({ error: 'Reply not found' });
        }

        const updatedReply = await ReplyModel.findByIdAndUpdate(
            replyId, 
            { $inc: { likes: -1 } }, 
            { new: true } // update document
        );

        if (!updatedReply) {
            return res.status(404).json({ error: 'Reply not found' });
        }

        const updatedProfile = await ProfileModel.findOneAndUpdate(
            { username: req.user.username },
            { $pull: { likesReply: { replyId: replyId } } }, // Remove the reviewId from likes array
            { new: true }
        );

        if (!updatedProfile) {
            return res.status(404).json({ error: 'User profile not found' });
        }

        // Increment the likes of the reply
        console.log(reply.likes);
        reply.likes--;

        // Save the updated review
        await review.save();

        console.log('Liked reply');
        res.json({ message: 'Reply liked', reply: updatedReply });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error liking reply' });
    }
});

server.post('/dislike_reply/:reviewId/:replyId', async (req, res) => {
    const reviewId = req.params.reviewId;
    const replyId = req.params.replyId;

    try {

        const review = await ReviewsModel.findOne({_id : reviewId});
        const reply = review.replies.find(reply => reply._id === replyId);

        // Check if the reply exists
        if (!reply) {
            return res.status(404).json({ error: 'Reply not found' });
        }

        const updatedReply = await ReplyModel.findByIdAndUpdate(
            replyId, 
            { $inc: { dislikes: 1 } }, 
            { new: true } // update document
        );

        if (!updatedReply) {
            return res.status(404).json({ error: 'Reply not found' });
        }

        const updatedProfile = await ProfileModel.findOneAndUpdate(
            { username: req.user.username },
            { $push: { dislikesReply: { replyId: replyId } } }, // Remove the reviewId from likes array
            { new: true }
        );

        if (!updatedProfile) {
            return res.status(404).json({ error: 'User profile not found' });
        }


        // Increment the likes of the reply
        console.log(reply.dislikes);
        reply.dislikes++;


        // Save the updated review
        await review.save();

        console.log('Liked reply');
        res.json({ message: 'Reply disliked', reply: updatedReply });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error disliking reply' });
    }
});

server.post('/undislike_reply/:reviewId/:replyId', async (req, res) => {
    const reviewId = req.params.reviewId;
    const replyId = req.params.replyId;

    try {

        const review = await ReviewsModel.findOne({_id : reviewId});
        const reply = review.replies.find(reply => reply._id === replyId);

        // Check if the reply exists
        if (!reply) {
            return res.status(404).json({ error: 'Reply not found' });
        }

        const updatedReply = await ReplyModel.findByIdAndUpdate(
            replyId, 
            { $inc: { dislikes: -1 } }, 
            { new: true } // update document
        );

        if (!updatedReply) {
            return res.status(404).json({ error: 'Reply not found' });
        }

        const updatedProfile = await ProfileModel.findOneAndUpdate(
            { username: req.user.username },
            { $pull: { dislikesReply: { replyId: replyId } } }, // Remove the reviewId from likes array
            { new: true }
        );

        if (!updatedProfile) {
            return res.status(404).json({ error: 'User profile not found' });
        }

        // Increment the likes of the reply
        reply.dislikes--;

        // Save the updated review
        await review.save();

        console.log('Liked reply');
        res.json({ message: 'Reply disliked', reply: updatedReply });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error disliking reply' });
    }
});
// --------------------------------------------------









// update the edit review 
server.post('/edit_review/:id', async (req, res) => {
    const reviewId = req.params.id;
    const { title, content, rating } = req.body;

    try {
        // Find by  ID and update 
        const updatedReview = await ReviewsModel.findByIdAndUpdate(
            reviewId,
            { title: title, content: content, rating: rating },
            { new: true } // updaate document
        );

        if (!updatedReview) {
            return res.status(404).json({ error: 'Review not found' });
        }

        console.log('Review updated successfully');
        res.json({ message: 'Review updated successfully', review: updatedReview });
    } catch (error) {
        console.error('Error updating review:', error);
        res.status(500).json({ error: 'Error updating review' });
    }
});

server.post('/reviews/:reviewId/replies', async (req, res) => {
    const reviewId = req.params.reviewId;
    const { title, content, username, profile_pic, date } = req.body;

    try {
        const review = await ReviewsModel.findById(reviewId);
        
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

         // date
         const currentDate = new Date();
         const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Adding 1 because months are zero-based
         const day = String(currentDate.getDate()).padStart(2, '0');
         const year = String(currentDate.getFullYear()).slice(-2); // Getting last two digits of the year
         const formattedDate = `${month}/${day}/${year}`;

        // _id
        const count = await ReplyModel.countDocuments();
        const newReplyId = `review_${count + 1}`;

        const profileInfo = await ProfileModel.findOne({username : req.user.username}).lean();
        const OwnerProfileInfo = await ProfileModel.findOne({username : req.user.username}).lean();

        // Add the new reply to the  array
        const newReply = {
            _id : newReplyId,
            username : req.user.username,
            profile_pic : profileInfo != null ? profileInfo.profile_pic: OwnerProfileInfo.profile_pic,
            review : reviewId,
            title : title,
            content : content,
            likes : 0,
            dislikes : 0,
            date : formattedDate,
        };
        review.replies.push(newReply);

        await review.save(); // save 

        ReplyModel.create({
            _id : newReplyId,
            username : req.user.username,
            profile_pic : profileInfo != null ? profileInfo.profile_pic: OwnerProfileInfo.profile_pic,
            review : reviewId,
            title : title,
            content : content,
            likes : 0,
            dislikes : 0,
            date : formattedDate,
        });

        res.status(201).json({ message: 'Reply posted successfully', reply: newReply });
    } catch (error) {
        console.error('An error occurred while posting reply:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// Start the server
const port = process.env.PORT || 3000;
server.listen(port, function(){
    console.log('Listening at port '+ port);
});
