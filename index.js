'use strict';

    const Alexa = require('alexa-sdk');
    var AWS = require('aws-sdk');
    
    exports.handler = (event,context) => {
    const alexa = Alexa.handler(event, context);
    alexa.registerHandlers(handlers);
    alexa.execute();
};


 var speechoutput;
 var globalstate;
 var dataC1;
 var docClient = new AWS.DynamoDB.DocumentClient();

 function getShadowCube2(callback){
iotdata.getThingShadow({ thingName: 'esp32_2C95EC' }, (err, data) => {
      if (err) { 
            console.log(err, err.stack); 
            context.done(err);
            return;
      }
      var payload = JSON.parse(data.payload);
      //var state = payload.state.reported["door-closed"];
      var state = payload.state.reported.Face;
      var shadowID = payload.state.reported.ShadowID;
      console.log("state: ", state);
      console.log("shadowID: ", shadowID);
      callback(state,shadowID);
  
    });
 }
 
 function getShadowCube1(callback){
iotdata.getThingShadow({ thingName: 'ESP8266-1' }, (err, data) => {
      if (err) { 
            console.log(err, err.stack); 
            context.done(err);
            return;
      }
      var payload = JSON.parse(data.payload);
      //var state = payload.state.reported["door-closed"];
      var state = payload.state.reported.Face;
      var shadowID = payload.state.reported.ShadowID;
      console.log("state: ", state);
      console.log("shadowID: ", shadowID);
      callback(state,shadowID);

    });
 }
  
var iotdata = new AWS.IotData({
  endpoint: 'a39furswz813o0.iot.us-east-1.amazonaws.com',
  accessKeyId     : 'AKIAJKPGL374CGPDT3PA',
  secretAccessKey : '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',
  apiVersion: '2015-05-28'
});
//var iotdata = new AWS.IotData({endpoint: 'a39furswz813o0.iot.us-east-1.amazonaws.com'});
AWS.config.update({
         accessKeyId: "AKIAJKPGL374CGPDT3PA",
         secretAccessKey: "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",
         region: "us-east-1"
    });
    //var addition = ["John has two apples. If his brother gives him two more, how many does he have now lol. Place the cube on the correct answer and say done once completed","throw both cubes and add the face numbers. Make sure you place the green cube first then the black cube. Say done when completed"];
//global.eventText = "3";
var savedslot;
var random = [2];
var generated = 0;
var generatedIndex=0;

const handlers = {
    //By having a single 'Unhandled' handler, we ensure all requests are route to it
   
    'GameSetup': function () {
       
        //log the event sent by the Alexa Service in human readable format
    
        console.log(JSON.stringify(this.event));
        let skillId, requestType, dialogState, intent ,intentName, intentConfirmationStatus, slotArray, slots, count;

        try {
            //Parse necessary data from JSON object using dot notation
            //build output strings and check for undefined
            skillId = this.event.session.application.applicationId;
            requestType = "The request type is, "+this.event.request.type+" .";
            dialogState = this.event.request.dialogState;
            intent = this.event.request.intent;
            if (intent != undefined) {
                intentName = " The intent name is, "+this.event.request.intent.name+" .";
                slotArray = this.event.request.intent.slots;
                intentConfirmationStatus = this.event.request.intent.confirmationStatus;

                if (intentConfirmationStatus != "NONE" && intentConfirmationStatus != undefined ) {
                    intentConfirmationStatus = " and its confirmation status is "+ intentConfirmationStatus+" . ";
                    intentName = intentName+intentConfirmationStatus;
                }
            } else {
                intentName = "";
                slotArray = "";
                intentConfirmationStatus = "";
            }

            slots = "";
            count = 0;

            if (slotArray == undefined || slots == undefined) {
                slots = "";
            }

            //Iterating through slot array
            for (let slot in slotArray) {
                count += 1;
                let slotName = slotArray[slot].name;
                let slotValue = slotArray[slot].value;
                let slotConfirmationStatus = slotArray[slot].confirmationStatus;
                slots = slots + "The <say-as interpret-as='ordinal'>"+count+"</say-as> slot is, " + slotName + ", its value is, " +slotValue;
           
                if (slotConfirmationStatus!= undefined && slotConfirmationStatus != "NONE") {
                  slots = slots+" and its confirmation status is "+slotConfirmationStatus+" . ";
                } else {
                  slots = slots+" . ";
                }
                 if(slotValue == 'addition' || slotValue=='subtraction' || slotValue == 'multiplication') savedslot = slotValue;
            
            }

            //Delegate to Dialog Manager when needed
            //<reference to docs>
            if (dialogState == "STARTED" || dialogState == "IN_PROGRESS") {
              this.emit(":delegate");
            }
        } catch(err) {
            console.log("Error: " + err.message);
        }

        let speechOutput = "Your end point received a request, here's a breakdown. " + requestType + " " + intentName + slots;
        let cardTitle = "Skill ID: " + skillId;
        let cardContent = speechOutput;

        this.response.cardRenderer(cardTitle, cardContent);
        this.response.speak(speechOutput);
        this.emit(':responseReady');
        
        
  },
  
    'GamingScenario': function (){

        generated = Math.floor(Math.random() * random.length);
        console.log("generated:",generated);
        generatedIndex= random[generated];
    
        if(savedslot=='addition' && generatedIndex==1)
        {
              var params1 = {
        topic: '$aws/things/esp32_2C95EC/shadow/update',
        payload: 'blink',
        qos: 1
        };
  
      iotdata.publish(params1, (err, data) => {
        if(err){
            console.log(err);
        }
        else{
            console.log("success for cube 1");
            console.log(data);
            //context.succeed(event);
        }
    });
       setTimeout(()=> {this.emit(':ask',' karim has 4 apples, if he buys three, how many does he have ? Please Place the cube on the correct answer and say done <break time="1s"/> ');},6000);
        }
     
        else if(savedslot=='addition' && generatedIndex==2)
        {
             var params2 = {
        topic: '$aws/things/ESP8266-1/shadow/update',
        payload: 'blink',
        qos: 1
        };
  
      iotdata.publish(params2, (err, data) => {
        if(err){
            console.log(err);
        }
        else{
            console.log("success for cube 1");
            console.log(data);
            //context.succeed(event);
        }
    });
           var params3 = {
        topic: '$aws/things/esp32_2C95EC/shadow/update',
        payload: 'blink',
        qos: 1
        };
  
      iotdata.publish(params3, (err, data) => {
        if(err){
            console.log(err);
        }
        else{
            console.log("success for cube 1");
            console.log(data);
            //context.succeed(event);
        }
    });
         setTimeout(()=> {this.emit(':ask',' Throw the first cube <break time="2s"/> , Now throw the second cube <break time="2s"/> Add the face value of cube 1 and cube 2 <break time="3s"/>. When you are ready say the answer <break time="1s"/>'); }, 6000);
        }
        
        else if(savedslot=='multiplication' && generatedIndex == 1){
            
        var params4 = {
        topic: '$aws/things/esp32_2C95EC/shadow/update',
        payload: 'blink',
        qos: 1
        };
  
      iotdata.publish(params4, (err, data) => {
        if(err){
            console.log(err);
        }
        else{
            console.log("success for cube 1");
            console.log(data);
            //context.succeed(event);
        }
    });
       setTimeout(()=> {this.emit(':ask',' Andrew started making mini sandwiches for a party. If he has 3 friends coming over and he made 3 sandwiches for each one of them, how many sandwiches did he make? Please place the cube on the correct answer and say done once you are finished  <break time="3s"/> ');},6000);
        }
        
        else if(savedslot=='multiplication' && generatedIndex == 2)
        {
         var params5 = {
        topic: '$aws/things/ESP8266-1/shadow/update',
        payload: 'blink',
        qos: 1
        };
  
      iotdata.publish(params5, (err, data) => {
        if(err){
            console.log(err);
        }
        else{
            console.log("success for cube 1");
            console.log(data);
            //context.succeed(event);
        }
    });
           var params6 = {
        topic: '$aws/things/esp32_2C95EC/shadow/update',
        payload: 'blink',
        qos: 1
        };
  
      iotdata.publish(params6, (err, data) => {
        if(err){
            console.log(err);
        }
        else{
            console.log("success for cube 1");
            console.log(data);
            //context.succeed(event);
        }
    });
         setTimeout(()=> {this.emit(':ask',' Throw the first cube <break time="3s"/> , Now throw the second cube <break time="3s"/> Multiply the face value of cube 1 and cube 2 <break time="3s"/>. When you are ready say the answer <break time="3s"/>'); }, 6000);

        }
        else if(savedslot=='subtraction' && generatedIndex==1){
             var params7 = {
        topic: '$aws/things/esp32_2C95EC/shadow/update',
        payload: 'blink',
        qos: 1
        };
  
      iotdata.publish(params7, (err, data) => {
        if(err){
            console.log(err);
        }
        else{
            console.log("success for cube 1");
            console.log(data);
            //context.succeed(event);
        }
    });
       setTimeout(()=> {this.emit(':ask','Keith had 8 kittens. He gave 3 to his friends. How many kittens does he have now ? Please place the cube on the correct answer and say done once you are finished  <break time="3s"/> ');},6000);
        }
        
        else if(savedslot=='subtraction' && generatedIndex==2){
            var params8 = {
        topic: '$aws/things/ESP8266-1/shadow/update',
        payload: 'blink',
        qos: 1
        };
  
      iotdata.publish(params8, (err, data) => {
        if(err){
            console.log(err);
        }
        else{
            console.log("success for cube 1");
            console.log(data);
            //context.succeed(event);
        }
    });
           var params9 = {
        topic: '$aws/things/esp32_2C95EC/shadow/update',
        payload: 'blink',
        qos: 1
        };
  
      iotdata.publish(params9, (err, data) => {
        if(err){
            console.log(err);
        }
        else{
            console.log("success for cube 1");
            console.log(data);
            //context.succeed(event);
        }
    });
         setTimeout(()=> {this.emit(':ask',' Throw the first cube <break time="2s"/> , Now throw the second cube <break time="3s"/> Subtract the larger face value from the smaller face value <break time="2s"/>. When you are ready say the answer <break time="1s"/>'); }, 6000);
        }
        console.log('savedslot: ', savedslot);
    },
    
    'Completed': function (){
           //this.emit(':tell',"yaaay");
        console.log("Completed intent got called");
    
      
        if(savedslot=='addition' && generatedIndex==1){
  
      var params1 = {
        topic: '$aws/things/ESP8266-1/shadow/update',
        payload: 'throwcube',
        qos: 1
        };
  
      iotdata.publish(params1, (err, data) => {
        if(err){
            console.log(err);
        }
        else{
            console.log("success for cube 1");
            console.log(data);
            //context.succeed(event);
        }
    });

            
     setTimeout(()=> { getShadowCube1((data,data1)=>{
            
                      if(data == 3){
                          console.log("yes");
                         speechoutput = "your answer is correct";
        
                          this.emit(":ask",'<break time="1s"/>Your answer is correct, <amazon:effect name="whispered"> high five little genius ! </amazon:effect>  <break time="1s"/> if you want to play again just say: I am ready ');
                        }
                        else {
                            console.log("no");
                            //speechoutput = '';
                             //console.log("speech:",speechoutput);
                             this.emit(":ask",'<break time="1s"/> <amazon:effect name="whispered"> OOH ! That was sooo close! </amazon:effect> but your answer is incorrect  <break time="1s"/> if you want to play again just say: I am ready ');
                            
                             
                          }})}, 6000);
                
                        
        }
        
        else if(savedslot=='multiplication' && generatedIndex==1){
                 var params2 = {
        topic: '$aws/things/ESP8266-1/shadow/update',
        payload: 'throwcube',
        qos: 1
        };
  
      iotdata.publish(params2, (err, data) => {
        if(err){
            console.log(err);
        }
        else{
            console.log("success for cube 1");
            console.log(data);
            //context.succeed(event);
        }
    });
     setTimeout(()=> { getShadowCube1((data,data1)=>{
            
                      if(data == 9){
                          console.log("yes");
                         speechoutput = "your answer is correct";
        
                          this.emit(":ask",'<break time="1s"/> Your answer is correct, <amazon:effect name="whispered"> high five little genius ! </amazon:effect>  <break time="1s"/> if you want to play again just say: I am ready ');
                        }
                        else {
                            console.log("no");
                            //speechoutput = '';
                             //console.log("speech:",speechoutput);
                             this.emit(":ask",'<break time="1s"/> <amazon:effect name="whispered"> OOH ! That was sooo close! </amazon:effect> but your answer is incorrect  <break time="1s"/> if you want to play again just say: I am ready ');
            }})}, 6000);
        }
        
        else if(savedslot=='subtraction' && generatedIndex==1){
            var params3 = {
        topic: '$aws/things/ESP8266-1/shadow/update',
        payload: 'throwcube',
        qos: 1
        };
  
      iotdata.publish(params3, (err, data) => {
        if(err){
            console.log(err);
        }
        else{
            console.log("success for cube 1");
            console.log(data);
            //context.succeed(event);
        }
    });
     setTimeout(()=> { getShadowCube1((data,data1)=>{
            
                      if(data == 5){
                          console.log("yes");
                         speechoutput = "your answer is correct";
        
                          this.emit(":ask",' <break time="1s"/> Your answer is correct, <amazon:effect name="whispered"> high five little genius ! </amazon:effect>  <break time="1s"/> if you want to play again just say: I am ready ');
                        }
                        else {
                            console.log("no");
                            //speechoutput = '';
                             //console.log("speech:",speechoutput);
                             this.emit(":ask",'<break time="1s"/> <amazon:effect name="whispered"> OOH ! That was sooo close! </amazon:effect> but your answer is incorrect  <break time="1s"/> if you want to play again just say: I am ready ');
            }})}, 6000);
        }
                          /*
                while(true){
                    getShadow((data,data1)=>{
                        if(globalshadow == data1){
                            console.log("initialized");
                        }
                        else{
                          
                      if(data == 7){
                          console.log("yes");
                         speechoutput = "your answer is correct";
        
                          this.emit(":ask","your answer is correct");
                        }
                        else {
                            console.log("no");
                            speechoutput = "your answer is incorrect";
                             //console.log("speech:",speechoutput);
                             this.emit(":ask","your answer is incorrect");
                             
                          }
                          return;
                         }
                    });
                       // }*/
                     
},


    'Answer': function ()
    {
        console.log("Answer intent got called");
      
        if(savedslot=='addition' && generatedIndex==2){
  
 var params1 = {
        topic: '$aws/things/ESP8266-1/shadow/update',
        payload: 'throwcube',
        qos: 1
        };
  
      iotdata.publish(params1, (err, dataC1) => {
        if(err){
            console.log(err);
        }
        else{
            console.log("success for cube 1");
            console.log(dataC1);
        }
    });
    
          var params2 = {
        topic: '$aws/things/esp32_2C95EC/shadow/update',
        payload: 'throwcube',
        qos: 1
        };
  
      iotdata.publish(params2, (err, dataC2) => {
        if(err){
            console.log(err);
        }
        else{
            console.log("success for cube 2");
            console.log(dataC2);
        }
    });
                 // var globalshadow = 1;
    var answerslot = this.event.request.intent.slots.Number.value;
    console.log("answerslot:",answerslot);
     setTimeout(()=> { getShadowCube1((data,data1) =>{

                       getShadowCube2((data2,data3) =>{
                        if(answerslot == (data + data2)){
                            this.emit(":ask",'<break time="1s"/> Your answer is correct, <amazon:effect name="whispered"> high five little genius ! </amazon:effect>   <break time="1s"/> if you want to play again just say: I am ready ');
                        }
                        else{
                            this.emit(":ask",'<break time="1s"/> <amazon:effect name="whispered"> OOH ! That was sooo close! </amazon:effect> but your answer is incorrect  <break time="1s"/> if you want to play again just say: I am ready ');
                        }
                        console.log("concatenated = ", data + data2);
                       });
                       
                        })}, 6000);
        }
        
        else if(savedslot=='multiplication' && generatedIndex==2){
            var params3 = {
        topic: '$aws/things/ESP8266-1/shadow/update',
        payload: 'throwcube',
        qos: 1
        };
  
      iotdata.publish(params3, (err, dataC1) => {
        if(err){
            console.log(err);
        }
        else{
            console.log("success for cube 1");
            console.log(dataC1);
            //context.succeed(event);
        }
    });
    
          var params4 = {
        topic: '$aws/things/esp32_2C95EC/shadow/update',
        payload: 'throwcube',
        qos: 1
        };
  
      iotdata.publish(params4, (err, dataC2) => {
        if(err){
            console.log(err);
        }
        else{
            console.log("success for cube 2");
            console.log(dataC2);
            //context.succeed(event);
        }
    });
                 // var globalshadow = 1;
    var answerslot1 = this.event.request.intent.slots.Number.value;
    console.log("answerslot:",answerslot1);
     setTimeout(()=> { getShadowCube1((data,data1) =>{

                       getShadowCube2((data2,data3) =>{
                        if(answerslot1 == (data * data2)){
                            this.emit(":ask",'<break time="1 s"/> Your answer is correct, <amazon:effect name="whispered"> high five little genius ! </amazon:effect>   <break time="1s"/> if you want to play again just say: I am ready ');
                        }
                        else{
                            this.emit(":ask",'<break time="1s"/> <amazon:effect name="whispered"> OOH ! That was sooo close! </amazon:effect> but your answer is incorrect  <break time="1s"/> if you want to play again just say: I am ready ');
                        }
                        console.log("concatenated = ", data * data2);
                       });
                       
                 })}, 6000);
        }
        
         else if(savedslot=='subtraction' && generatedIndex==2){
             var params5 = {
        topic: '$aws/things/ESP8266-1/shadow/update',
        payload: 'throwcube',
        qos: 1
        };
  
      iotdata.publish(params5, (err, dataC1) => {
        if(err){
            console.log(err);
        }
        else{
            console.log("success for cube 1");
            console.log(dataC1);
            //context.succeed(event);
        }
    });
    
          var params6 = {
        topic: '$aws/things/esp32_2C95EC/shadow/update',
        payload: 'throwcube',
        qos: 1
        };
  
      iotdata.publish(params6, (err, dataC2) => {
        if(err){
            console.log(err);
        }
        else{
            console.log("success for cube 2");
            console.log(dataC2);
            //context.succeed(event);
        }
    });
                 // var globalshadow = 1;
    var answerslot2 = this.event.request.intent.slots.Number.value;
    console.log("answerslot:",answerslot2);
     setTimeout(()=> { getShadowCube1((data,data1) =>{

                       getShadowCube2((data2,data3) =>{
                           var diff;
                           if(data>data2){
                               diff = data-data2;
                           }
                           else if(data2>data){
                               diff = data2 -data;
                           }
                        if(answerslot2 == diff){
                            this.emit(":ask",'<break time="1s"/> Your answer is correct, <amazon:effect name="whispered"> high five little genius ! </amazon:effect>   <break time="1s"/> if you want to play again just say: I am ready ');
                        }
                        else{
                            this.emit(":ask",'<break time="1s"/> <amazon:effect name="whispered"> OOH ! That was sooo close! </amazon:effect> but your answer is incorrect  <break time="1s"/> if you want to play again just say: I am ready ');
                        }
                        console.log("concatenated = ", data * data2);
                       });
                       
                 })}, 6000);
         }
    }

};            
                          
                          
        
        

    

