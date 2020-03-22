"use strict";


function myFunct (){

    console.log("after 5 second")

}
function myFunct2(){
    console.log("after 6 second")
}


setTimeout(myFunct,5*1000);
setTimeout(myFunct2,6*1000);

console.log("BONASERA");