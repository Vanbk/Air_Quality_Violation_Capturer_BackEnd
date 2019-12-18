const express = require('express');
const router = express.Router();

var currentPara = {
    id: 10,
    temperature: 30,
    humidity: 80,
    pm25: 50,
    pm10: 60
};

var act = {
    id: 0, 
    act1State: 0,
    act2State: 0
}

var newPara = {
    deviceId: 11,
    deviceName: 'DeviceX',
    sampleId: 1,
    timeStamp: 0,
    temperature: 30,
    humidity: 80,
    pm25: 50,
    pm10: 80,
    act1State: 0,
    act2State: 0
};

var timestamp = new Date().getTime()
var date = new Date(timestamp)
console.log(timestamp)
console.log(date.getHours().toString(),":",date.getMinutes().toString())

var chartData = {
    labels: [1, 2, 3, 4, 5, 6, 7],
    values: [15, 20, 26, 20, 25, 29, 28]
};
var allData = []
//allData.push(currentPara)
//allData.push(newPara)

// http://localhost:9000/data/currentdata?id=109
// return the current values of all parameter at an location specified by "id"
router.get('/currentdata', (req, res, next)=>{
    var id = req.query.id;
    var currentData = {};
    allData.forEach(function(item, i){
        if(id = item.deviceId){
            currentData= item
        }
    });
    //console.log(newestValue)
    res.status(200).json({
        currentData
    });
   
});

//http://localhost:9000/data/chart?id=100&type=0&start=1575728492010&stop=1575728506715
// Return the values of a parameter (specified by "type") in a specific duration
router.get('/chart', (req, res, next)=>{
    var id = req.query.id;
    var typeOfData = req.query.type; // type = 0/1/2/3 <=> tem / hum/ pm25/ pm10
    var timeStart = req.query.start;
    var timeEnd   = req.query.stop;
    var extractedData = {
        labels: [],
        values: []
    };
    allData.forEach(function(item, i){
        if(id = item.deviceId && timeStart <= item.timeStamp && item.timeStamp <= timeEnd){
            extractedData.labels.push(item.timeStamp);
            if (typeOfData == 0) { extractedData.values.push(item.temperature) }
            if (typeOfData == 1) { extractedData.values.push(item.humidity) }
            if (typeOfData == 2) { extractedData.values.push(item.pm25) }  
            if (typeOfData == 3) { extractedData.values.push(item.pm10) }
        }
    });
    //console.log(newestValue)
    res.status(200).json({
        extractedData
    });
   
});

// Return all values of a parameter and recorded time (specified by "type") in a specific duration
router.get('/chart/all', (req, res, next)=>{
    var id = req.query.id;
    var typeOfData = req.query.type; // type = 0/1/2/3 <=> tem / hum/ pm25/ pm10
    var extractedData = {
        labels: [],
        values: []
    };
    allData.forEach(function(item, i){
        var date = new Date(item.timeStamp)
        extractedData.labels.push(date.getHours().toString()+ ":" + date.getMinutes().toString()+ ":" + date.getSeconds().toString());
        if (typeOfData == 0) { extractedData.values.push(item.temperature) }
        if (typeOfData == 1) { extractedData.values.push(item.humidity) }
        if (typeOfData == 2) { extractedData.values.push(item.pm25) }  
        if (typeOfData == 3) { extractedData.values.push(item.pm10) }
    });
    //console.log(newestValue)
    res.status(200).json({
        extractedData
    });
   
});

router.get('/chartData', (req, res, next)=>{
    chartData.values[0] = chartData.values[0] + 0.2;
    chartData.values[3] = chartData.values[3] + 0.2;
    res.status(200).json({
        chartData
    });
});

// return whole data 
router.get('/all', (req, res, next)=>{
    res.status(200).json({
        allData
    });
});

router.post('/', (req, res, next)=>{
    const endDeviceData = {
        deviceId: req.body.deviceId,
        deviceName: 'Device' + req.body.deviceId.toString(),
        sampleId: allData.length,
        timeStamp: new Date().getTime(),
        temperature: req.body.temperature,
        humidity: req.body.humidity,
        pm25: req.body.pm25,
        pm10: req.body.pm10,
        act1State: req.body.act1State,
        act2State: req.body.act2State
    };
    allData.push(endDeviceData)
    //console.log('temperature: ', allData)
    //console.log('JSON from End Device', req.body)
    //console.log('Parsed Data', allData)
    if (req.body.deviceId == act.id) {
        res.status(201).json({
            message: 'Successfully',
            act1State: act.act1State,
            act2State: act.act2State,
        });
    }
    
});

router.get('/control', (req, res, next)=>{
    // temporary use
    act.id = req.query.id;
    act.act1State = req.query.bt1State;
    act.act2State = req.query.bt2State;
    console.log(act)
    res.status(201).json({
        message: 'Control Request have been sent'
    });
});

module.exports = router;