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

var input = [];
for (var i = 0; i < fakesites.length; i++){
  url = "http://" + fakesites[i].url;
  html = extractHTML(url);
  if (html){
    input.push(html);
  }
}

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


function isNumeric(obj) {
    return !isNaN(parseInt(obj));
}

// return false if it errors
function extractHTML(url){
  console.log(url);

  wrappedRequest = Meteor.wrapAsync(request);
  try {
    res = wrappedRequest({url: url, timeout: 10000});
    if (res.statusCode == 200){
      html = res.body;
    } else {
      console.log("bad status code", res, url);
      return false;
    }
  } catch(e) {
    console.log("error", e, url);
    return false;
  }

  $ = cheerio.load(html);
  links = $("body a").filter(lengthTest);
  median = Math.floor(links.length / 2);
  console.log(links.eq(median).text());
  url = links.eq(median).attr('href');
  if (!url){
    console.log('bad url', links.eq(median).text());
    return false;
  }
  // console.log(body);
  wrappedRequest = Meteor.wrapAsync(request);
  try {
    res = wrappedRequest({url: url, timeout: 10000});
    if (res.statusCode == 200){
      html = res.body;
    } else {
      console.log("bad status code in loading article", res, url);
      return false;
    }
  } catch(e) {
    console.log("error in loading article", e, url);
    return false;
  }
  $ = cheerio.load(html);
  article = $("article p").text();
  if (!article){
    article = $("div.entry-content p").text();
  }
  if (!article){
    article = $("div.entry-content").text();
  }
  console.log(article);
  return article;

}


function lengthTest(ind, elm){
  linkText = $(this).text().trim();
  link = $(this).attr('href');
  if (linkText.length < 20 || linkText.length > 130 || !link || link.length < 30) return false;
  // console.log(linkText);
  return true;
}
