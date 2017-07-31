var tweetIndex = 0;

var tweets = [];
var tweetDates = [];
var updatesFinal = "";

function navScroll() {
  var $nav = $("#nav");
  var isMouseIn = false;

  // run after initialization of navbar
  $(window).scroll(function() {

    // HANDLE NAVBAR
    if ($(document).scrollTop() > 50 && !isMouseIn) {
      $nav.removeClass('navbar-lg');
      $nav.addClass('navbar-md');
    } else {
      $nav.removeClass('navbar-md');
      $nav.addClass('navbar-lg');
    }

    // MOUSEOVER NAVBAR EFFECT
    $nav.mouseenter(function() {
      $nav.removeClass('navbar-md');
      $nav.addClass('navbar-lg');
      isMouseIn = true;
    });

    $nav.mouseleave(function() {
      if ($(document).scrollTop() > 50) {
        $nav.removeClass('navbar-lg');
        $nav.addClass('navbar-md');
      }
      isMouseIn = false;
    });

    timelineScroll();
  });
}

// hide and reveal timeline elements by scroll
function timelineScroll() {
  var $timeline_block = $('.cd-timeline-block');
  // run after initialization of navbar

  //hide timeline blocks which are outside the viewport
  $timeline_block.each(function() {
    if ($(this).offset().top > $(window).scrollTop() + $(window).height() * 0.75) {
      $(this).find('.cd-timeline-img, .cd-timeline-content, .pointer').removeClass('bounce-in').addClass('is-hidden');
    }
  });

  // reveal timeline blocks inside viewport
  $timeline_block.each(function() {
    if ($(this).offset().top <= $(window).scrollTop() + $(window).height() * 0.75 && $(this).find('.cd-timeline-img').hasClass('is-hidden')) {
      $(this).find('.cd-timeline-img, .cd-timeline-content, .pointer').removeClass('is-hidden').addClass('bounce-in');
    }
  });
}

/**
 * Parse Twitter feed through retrieving tweets using custom Google Script that generates xml sheet.
 */
function parseTwitterRSS() {

  $.get('https://script.google.com/macros/s/AKfycbzu7bVSXrtsFL63OFkPPH5XwI3V8XzOm6JAiNf6zr1gac8y4Xg/exec?520445386310164480', function(data) {
    // find each item (tweet)
    $(data).find("item").each(function() {

      // limit to past 20 tweets
      if (tweets.length > 20)
        return;

      // reference to found item (tweet)
      var el = $(this);
      var title = el.find("title").text();
      var dateText = el.find("pubDate").text().split(' ');
      var date = "";

      // console.log(title);

      // date = day of the week, and date
      for (var index = 0; index < 4; index += 1)
        date = date + dateText[index] + " ";

      // add dash
      date += "- ";

      // save tweet text
      tweets[tweets.length] = title;
      tweetDates[tweetDates.length] = date;
    });

    // setup feed
    setupTwitterFeed();
    scrollUpdates();
  });
}

// set up text in #updates
function setupTwitterFeed() {
  for (var i = 0; i < tweets.length; i++) {
    // add date
    updatesFinal += tweetDates[i];

    // add message minus bar separator if last
    if (i != tweets.length - 1)
      updatesFinal += tweets[i] + "  |  ";
    else
      updatesFinal += tweets[i];
  }

  $("#update").html("<div id=\"update-inner\"><code>" + updatesFinal + "</code></div>");
}

// scroll #updates div with twitter feed
function scrollUpdates() {
  $updateInner = $("#update-inner");
  var marginLeft = $updateInner.width();
  $updateInner.css("margin-left", marginLeft);
  var boolEnter = false;
  $("#update").hover(function() {
    boolEnter = true;
  }, function() {
    boolEnter = false;
  });

  setInterval(function() {
    if (!boolEnter) {
      $updateInner.css("margin-left", marginLeft + "px");
      marginLeft -= 3;
      // console.log(marginLeft);
    }
  }, 20);
}

// allow smooth scroll on anchors
smoothScroll.init({
  speed: 500, // Integer. How fast to complete the scroll in milliseconds
  easing: 'easeOutCubic', // Easing pattern to use
  updateURL: false, // Boolean. Whether or not to update the URL with the anchor hash on scroll
  offset: 30, // Integer. How far to offset the scrolling anchor location in pixels
  callbackBefore: function(toggle, anchor) {}, // Function to run before scrolling
  callbackAfter: function(toggle, anchor) {} // Function to run after scrolling
});

$(document).ready(function() {
  navScroll();
  parseTwitterRSS();
  // scrollUpdates();
});