var cheerio = require('cheerio');
var request = require('request');
var fs = require('fs');

import {fakesites} from './fakesites.js'

// var trainingFake = fakesites.map(function(current){
//   featureArray = [];
//   featureDict = extractFeatures("http://" + current.url);
//   for (key in featureDict){
//     featureArray.push(featureDict[key]);
//   }
//   return {input: featureArray, output: [1]};
// });
output = input.join("\n\n\n\n\n\n\n\n\n");

__ROOT_APP_PATH__ = '/Users/Karan/Projects/fakenewsgenerator/generator/server';

fs.writeFileSync(__ROOT_APP_PATH__  + '/output.txt', output);

// var trainingReal = realsites.map(function(current){
//   featureArray = [];
//   featureDict = extractFeatures(current);
//   for (key in featureDict){
//     featureArray.push(featureDict[key]);
//   }
//   return {input: featureArray, output: [0]};
// });
//
// var training = trainingReal.concat(trainingFake);
// training.filter(function(curr){
//   return curr.input.length > 0;
// });

// trainingString = JSON.stringify(training);
// console.log(trainingString);


