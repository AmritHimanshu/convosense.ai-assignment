const express = require("express");
const router = express.Router();
const User = require("../model/userSchema");

router.post("/api/user", async (req, res) => {
    const { name, age, gender, phone, email } = req.body;
    if (!name || !age || !gender || !phone || !email) {
        return res.status(422).json({ error: "Fill all the fields" });
    }
    try {
        // let clientIp = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
        // if (clientIp === "::1") {
        //   clientIp = "127.0.0.1";
        // }

        // const response = await axios.post(process.env.WEBHOOK_URL, {
        //   ip: clientIp
        // });

        const address = {
            city: "Patna",
            region: "Bihar",
            country: "India",
            latitude: 456789,
            longitude: 456789,
        };

        const weather = {
            temperature: 37,
            condition: "Sunny",
        };

        const user = new User({ name, age, gender, phone, email, address, weather });
        const userRegistered = await user.save();

        if (userRegistered) {
        return res.status(201).json({ message: "User registered successfully" });
        }
    } catch (error) {
        console.log("/adduser: ", error);
        return res.status(501).json({ error: "Internal server error" });
    }
});

router.put('/api/user/:id', async (req, res) => {
    const userID = req.params.id;

    const { name, age, gender, phone, email } = req.body;

    try {
        const user = await User.findByIdAndUpdate({ _id: userID }, {
            name: name,
            age: age,
            gender: gender,
            phone: phone,
            email: email
        }, { new: true });

        if(user){
            return res.status(201).json({ message: "Successfully updated" });
        }
    } catch (error) {
        console.log("/userUpdate: ", error);
        return res.status(501).json({ error: "Internal server error" });
    }
});

router.delete('/api/user/:id', async (req, res) => {
    const userID = req.params.id;
    try {
        const user = await User.findById({ _id: userID });
        if (user) {
            await user.deleteOne();
            return res.status(201).json({ message: "Successfully deleted" });
        }
    } catch (error) {
        console.log("/deleteuser: ", error);
        return res.status(501).json({ error: "Internal server error" });
    }
});

router.get('/api/user/:id', async (req, res) => {
    const userID = req.params.id;
    try {
        const user = await User.findById({ _id: userID });
        if (user) {
            return res.status(201).json(user);
        }
    } catch (error) {
        console.log("/user: ", error);
        return res.status(501).json({ error: "Internal server error" });
    }
});

router.get('/api/user', async (req, res) => {
    try {
        const user = await User.find().sort({ createdAt: -1 });
        if (user) {
            return res.status(201).json(user);
        }
    } catch (error) {
        console.log("/fetchuser: ", error);
        return res.status(501).json({ error: "Internal server error" });
    }
});

router.get("/", (req, res) => {
    res.json({ message: "I am from router" });
});

module.exports = router;
