"use strict";

 let a = ["ciaoa", "buonasera", "holac","A"];
 let b = [];
 let c = ' '

a.forEach(x => {
    if(x.length>=2){
        c = x[0]+x[1]+x[x.length-2]+x[x.length-1];
        console.log(c);
    }
    else{
        c = '';
    }
    b.push(c);
});
a = [...b];
console.log(a);