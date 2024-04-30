const users = require("../models/usersSchema");
const moment = require("moment");
 const csv = require("fast-csv");
// const csv = require('csv-parser');
const path=require('path')
const fs = require("fs");
const BASE_URL = process.env.BASE_URL

// register user
exports.userpost = async (req, res) => {
    // Check if req.file exists
    if (!req.file) {
        return res.status(400).json("File upload is required");
    }

    const file = req.file.filename;
    const { name, category, location, email, mobile, price, status } = req.body;

    if (!name || !category || !location || !email || !mobile || !price || !status) {
        return res.status(400).json("All Inputs are required");
    }

    try {
        const preuser = await users.findOne({ email: email });

        if (preuser) {
            return res.status(401).json("This user already exists in our database");
        } else {
            const datecreated = new Date();
            const userData = new users({
                name, category, location, email, mobile, price, status, profile: file, datecreated
            });
            await userData.save();
            return res.status(200).json(userData);
        }
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json("Internal Server Error");
    }
};

// usersget
exports.userget = async (req, res) => {

    const search = req.query.search || ""
    const price = req.query.price || ""
    const status = req.query.status || "" 
    const sort = req.query.sort || ""
    const page = req.query.page || 1
    const ITEM_PER_PAGE = 6;


    const query = {
        name: { $regex: search, $options: "i" }
    }

    if (price !== "All") {
        query.price = price
    }

    if (status !== "All") {
        query.status = status
    }

    try {

        const skip = (page - 1) * ITEM_PER_PAGE  // 1 * 4 = 4

        const count = await users.countDocuments(query);

        const usersdata = await users.find(query)
            .sort({ datecreated: sort == "new" ? -1 : 1 })
            .limit(ITEM_PER_PAGE)
            .skip(skip);

        const pageCount = Math.ceil(count/ITEM_PER_PAGE);  // 8 /4 = 2

        res.status(200).json({
            Pagination:{
                count,pageCount
            },
            usersdata
        })
    } catch (error) {
        res.status(401).json(error)
    }
}

// single user get
exports.singleuserget = async (req, res) => {

    const { id } = req.params;

    try {
        const userdata = await users.findOne({ _id: id });
        res.status(200).json(userdata)
    } catch (error) {
        res.status(401).json(error)
    }
}

// user edit
exports.useredit = async (req, res) => {
    const { id } = req.params;
    const { name, category, location, email, mobile, price, status, profile } = req.body;

    // Check if req.file exists
    const file = req.file ? req.file.filename : profile;

    if (!name || !category || !location || !email || !mobile || !price || !status)  {
        return res.status(400).json("All Inputs are required");
    }
    const dateUpdated = moment(new Date()).format("YYYY-MM-DD hh:mm:ss");

    try {
        const updateuser = await users.findByIdAndUpdate({ _id: id }, {
            name, category, location, email, mobile, price, status, profile: file
        }, { new: true });

        await updateuser.save();
        return res.status(200).json(updateuser);
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json("Internal Server Error");
    }
};
// delete user
exports.userdelete = async (req, res) => {
    const { id } = req.params;
    try {
        const deletuser = await users.findByIdAndDelete({ _id: id });
        res.status(200).json(deletuser);
    } catch (error) {
        res.status(401).json(error)
    }
}

// chnage status
exports.userstatus = async (req, res) => {
    const { id } = req.params;
    const { data } = req.body;

    try {
        const userstatusupdate = await users.findByIdAndUpdate({ _id: id }, { status: data }, { new: true });
        res.status(200).json(userstatusupdate)
    } catch (error) {
        res.status(401).json(error)
    }
}

// export user
exports.userExport = async (req, res) => {
    try {
        const usersdata = await users.find();

        const csvStream = csv.format({ headers: true });

        if (!fs.existsSync("public/files/export/")) {
            if (!fs.existsSync("public/files")) {
                fs.mkdirSync("public/files/");
            }
            if (!fs.existsSync("public/files/export")) {
                fs.mkdirSync("./public/files/export/");
            }
        }

        const writablestream = fs.createWriteStream(
            "public/files/export/users.csv"
        );

        csvStream.pipe(writablestream);

        writablestream.on("finish", function () {
            res.json({
                downloadUrl: `${BASE_URL}/files/export/users.csv`,
            });
        });
        if (usersdata.length > 0) {
            usersdata.map((user) => {
                csvStream.write({
                    Name: user.name ? user.name : "-",
                    Category: user.category ? user.category : "-",
                    Email: user.email ? user.email : "-",
                    Mobile: user.mobile ? user.mobile : "-",
                    Price: user.price ? user.price : "-",
                    Status: user.status ? user.status : "-",
                    Profile: user.profile ? user.profile : "-",
                    Location: user.location ? user.location : "-",
                    DateCreated: user.datecreated ? user.datecreated : "-",
                    DateUpdated: user.dateUpdated ? user.dateUpdated : "-",
                });
                
            })
        }
        csvStream.end();
        writablestream.end();

    } catch (error) {
        res.status(401).json(error)
    }
}

 

exports.userImport = async (req, res) => {
    try {
         const filePath = req.file.path; // Assuming you're using multer for file upload
        
        const results = [];

        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', async () => {
                // Iterate over each row in the CSV file
                for (const row of results) {
                    // Create a new user instance using the data from the CSV row
                    const newUser = new users({
                        name: row.Name || null,
                        category: row.Category || null,
                        email: row.Email || null,
                        mobile: row.Mobile || null,
                        price: row.Price || null,
                        status: row.Status || null,
                        profile: row.Profile || null,
                        location: row.Location || null,
                        datecreated: row.DateCreated || null,
                        dateUpdated: row.DateUpdated || null,
                    });

                    // Save the user to the database
                    await newUser.save();
                }

                // Remove the uploaded CSV file
                fs.unlinkSync(filePath);

                // Send a response indicating success
                res.status(200).json({ message: 'CSV file imported successfully' });
            });
    } catch (error) {
        // Handle any errors that occur during the import process
        console.error('Error during CSV import:', error);
        res.status(500).json({ error: 'An error occurred during CSV import' });
    }
};
