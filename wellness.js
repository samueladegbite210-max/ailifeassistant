"use strict";

/*=========================
AI WELLNESS
=========================*/

let wellness =

JSON.parse(

localStorage.getItem("wellness")

) || {

mood:"🙂",

energy:"😐",

sleep:7,

water:0

};
