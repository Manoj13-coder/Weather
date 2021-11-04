const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const fs = require('fs');
const url = require('url');
const app = express();
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'./views'));
app.use(express.urlencoded());
app.use(express.static(path.join(__dirname,'./style')));
app.get('/',(req,res)=>{
    return res.status(200).render('home',{
        icon : "https://toppng.com/uploads/preview/image-setpng256x256-pxweather-icon-weather-flat-icon-115631356009rpwtrjbjj.png"
    });
})
const func = async (state) =>{
    const fetchData = await fetch(`http://api.weatherapi.com/v1/current.json?key=aadb845b553c4ffdac082253210411&q=${state}&aqi=no`);
    const data = await fetchData.json();
    return data;
}
app.post('/find',async(req,res)=>{
    const {state} = req.body;
    const ans = await func(state);
    if(ans){
        return res.status(200).render('index',{
            icon : ans.current.condition.icon,
            last_updated : ans.current.last_updated,
            name : ans.location.name,
            region : ans.location.region,
            country : ans.location.country,
            temperature : ans.current.temp_c,
            localtime : ans.location.localtime,
            condition : ans.current.condition.text
        });
    }else{
        return res.status(400).send('Data Not Available');
    }
});
app.listen('5000',()=>{
    console.log('Server listening on port 5000');
})
