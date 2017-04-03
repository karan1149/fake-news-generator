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
// for (var i = 0; i < fakesites.length; i++){
//   url = "http://" + fakesites[i].url;
//   html = extractArticle(url);
//   if (html){
//     input.push(html);
//   }
// }

var selectedSites = ['breitbart.com',  'infowars.com',  'newsbreakshere.com','dailyleak.org','conservativedailypost.com',  'libertywriters.com', 'beforeitsnews.com', 'thelastlineofdefense.org', 'empirenews.net', 'thedcgazette.com','100percentfedup.com', '70news.wordpress.com','americannews.com', 'yournewswire.com','christiantimes.com'  ];

for (var j = 0; j < selectedSites.length; j++){
  // console.log(selectedSites.length);
  url = "http://" + selectedSites[j];
  articles = extractArticles(url);
  if (articles){
    input.push(articles);
  }
}

output = joinInput(input);

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
function extractArticle(url){
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
  originalUrl = url;
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






function extractArticles(url){
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
  articles = [];
  titles = new Set();
  links = $("body a").filter(lengthTest);
  originalUrl = url;
  for (i = 0; i < links.length; i++){

    if (titles.has(links.eq(i).attr('href')) || links.eq(i).text().toLowerCase().includes("terms and conditions")|| links.eq(i).text().toLowerCase().includes("terms of service")){
      continue;
    }
    titles.add(links.eq(i).attr('href'));
    console.log(links.eq(i).text());
    url = links.eq(i).attr('href');
    if (!url){
      console.log('bad url', links.eq(median).text());
      return false;
    }
    if (!url.startsWith("http")){
      url = originalUrl + url;
    }
    // console.log(body);
    wrappedRequest = Meteor.wrapAsync(request);
    try {
      res = wrappedRequest({url: url, timeout: 10000});
      if (res.statusCode == 200){
        html = res.body;
      } else {
        console.log("bad status code in loading article", res, url);
        continue;
      }
    } catch(e) {
      console.log("error in loading article", e, url);
      continue;
    }

    $ = cheerio.load(html);
    article = $("article p").text();
    if (!article){
      article = $("div.entry-content p").text();
    }
    if (!article){
      article = $("div.entry-content").text();
    }
    if (!article){
      article = $("#story_wrapper #body p").text();
    }
    // console.log(article.substring(0, 150));
    if (article){
      articles.push(article);
    }
  }


  return joinInput(articles);

}


function joinInput(input){
  input = input.filter(function(elm){
    return elm.trim().length > 0;
  });
  input = input.map(function(elm){
    beginLength = "SIGN UP FOR OUR NEWSLETTER".length;
    begin = elm.indexOf("SIGN UP FOR OUR NEWSLETTER");
    if (begin != -1){
      elm = elm.substring(begin + beginLength);
    }
    beginLength = "Views ".length;
    begin = elm.indexOf("Views ");
    if (begin != -1 && begin < 85 && begin > 55){
      elm = elm.substring(begin + beginLength);
    }
    elm = elm.replace(/To view this video please enable JavaScript, and consider upgrading to a web browser that supports HTML5 video \(.{0,100}\)/g, "");
    elm = elm.replace(/To view this video please enable JavaScript, and consider upgrading to a web browser that supports HTML5 video/g, "");
    elm = elm.replace(/\w{3,12} \d{1,2}, 20\d{2}\n.{0,100}\n.{0,100}\n\d{1,6}/g, "");
    elm = elm.replace(/by [\w ]{3,100} \d{1,3} .{3,7} ago\d/g, "");
    elm = elm.replace(/\nPosted By: .{5,50}\n\d{1,2}\/\d{1,2}\/\d{4}\n/g, "");
    elm = elm.replace(/\n.{3,30}\n.{3,100}\n\d{1,6}\n/g, "");
    elm = elm.replace(/\(Before It's News\).\d{1,2}-\d{1,2}-\d{2}/, "");
    elm = elm.replace(/\(Before It's News\)/, "");
    elm = elm.replace(/Posted by .{3,23} \| .{1,10}, 20\d\d \| .{0,35}Advertisement/, "");
    // elm = elm.replace(/.{3,15}\n.?\n.?.?\n.?.?.{4,11}ago.?\n.{0,1}.{4,35}\n.{0,1}\n\d{1,7} Views /, "");
    elm = elm.trim();
    console.log(elm.substring(0, 150));
    return elm;
  });
  return input.join("\n\n\n\n\n\n\n\n\n");
}

function lengthTest(ind, elm){
  linkText = $(this).text().trim();
  link = $(this).attr('href');
  if (linkText.length < 20 || linkText.length > 130 || !link || link.length < 30) return false;
  // console.log(linkText);
  return true;
}
