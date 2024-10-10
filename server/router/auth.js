const express = require("express");
const router = express.Router();
const axios = require('axios');
const requestIp = require('request-ip');
const User = require("../model/userSchema");


const getClientIP = (req) => {
    return req.headers['x-forwarded-for'] || req.connection.remoteAddress;
};

const getIPDetails = async (ip) => {
    try {
        const response = await axios.get(`https://ipinfo.io/${ip}/json?token=${process.env.IPINFO_API_KEY}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching IP details:', error);
        return null;
    }
};

router.post("/api/user", async (req, res) => {
    const { name, age, gender, phone, email } = req.body;
    if (!name || !age || !gender || !phone || !email) {
        return res.status(422).json({ error: "Fill all the fields" });
    }
    try {
        let ip = getClientIP(req);
        console.log("ip: ",ip);

        // if (ip === '::1' || ip === '127.0.0.1') {
        //     return res.json({ message: 'Localhost IP detected', ip });
        // }
    
        const ipDetails = await getIPDetails(ip);
        
        const { city, region, country } = ipDetails;
        // return res.status(201).json( {city,region,country} );

        const weatherRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.WEATHER_API_KEY}&units=metric`);

        return res.status(201).json({weatherRes});

        // if (!geoResponse.data.length) {
        //     return res.status(400).json({ msg: 'Unable to fetch location data.' });
        // }

        // const location = geoResponse.data[0];
        // const latitude = location.lat;
        // const longitude = location.lon;

        // const weatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
        //     params: {
        //         lat: latitude,
        //         lon: longitude,
        //         units: 'metric',
        //         appid: process.env.WEATHER_API_KEY
        //     }
        // });

        // const weatherData = weatherResponse.data;
        // const temperature = weatherData.main.temp;
        // const condition = weatherData.weather[0].description;

        // const address = {
        //     city,
        //     region,
        //     country,
        //     latitude,
        //     longitude
        // };

        // const weather = {
        //     temperature,
        //     condition
        // };

        // const address = {
        //     city: "Patna",
        //     region: "Bihar",
        //     country: "India",
        //     latitude: 456789,
        //     longitude: 456789,
        // };

        // const weather = {
        //     temperature: 37,
        //     condition: "Sunny",
        // };

        // const user = new User({ name, age, gender, phone, email, address, weather });
        // const userRegistered = await user.save();

        // if (userRegistered) {
            // return res.status(201).json({ message: "User registered successfully" });
        // }
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

        if (user) {
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
