const Slack = require('./slack');
const slack = new Slack();
const hora =  new Date();
const rp = require('request-promise');
const Run = require('./Run');
const run = new Run();


function callServiceGmail(){
    rp(`http://localhost:7000/api/funcionando`)
        .then(()=>{
            if(!run.runNotify){
                slack.envioSlack(`[${hora}]: El servicio NotifyEmail ha vuelto a la normalidad`);
                run.runNotify = true;
            }
        })
        .catch((error) =>{
            if(run.runNotify){
                slack.envioSlack(`[${hora}]: servicio NotifyEmail ha dejado de funcionar`);
                run.runNotify = false;
            } 
        });
};

function callServiceLoggly(){
  rp(`http://localhost:3800/api/funcionando`)
    .then(()=>{
        if(!run.runLoggly){
            slack.envioSlack(`[${hora}]: El servicio Loggly ha vuelto a la normalidad`);
            run.runLoggly = true;
        }
    })
    .catch((error) =>{
        if(run.runLoggly){
            slack.envioSlack(`[${hora}]: servicio Loggly ha dejado de funcionar`); 
            run.runLoggly = false;
        }
    });
};

function monitorNotyfy(){
    slack.envioSlack(`[${hora}]: Monitor continua notificando`);
}

function monitoreoServicios(){
    callServiceGmail();
    callServiceLoggly();
}

setInterval(monitoreoServicios, 5000);
//setInterval(monitorNotyfy, 30000)

