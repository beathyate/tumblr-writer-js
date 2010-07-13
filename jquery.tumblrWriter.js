/* Copyright (c) 20089 Gustavo Beathyate (root@obviamente.pe)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *
 *
 * Requires: jQuery 1.3+
 *
 ****** CURRENTLY ONLY TESTED IN FF and Safari 3 *******
 */
 
(function ($) {
$.fn.writeTumblelog = function(options) {
  // extend defaults
  var $opts = $.extend({}, jQuery.fn.writeTumblelog.defaults, options); // set defaults
	
	// build JSON URL
	$jsonUrl = "http://"+$opts.tumblrUrl+"/api/read/json?callback=?"; // base URL
	$jsonUrl += "&start="+$opts.start; // set the offset
	$jsonUrl += "&num="+$opts.num; // set the post quantity
	if ($opts.tagged != null) $jsonUrl += "&tagged="+$opts.tagged; // set the tag filter
	if ($opts.type != null) $jsonUrl += "&type="+$opts.type; // set the post type filter

  // store the wrapper element in a variable
  var $postsContainer = $(this);
  // get the data and embed it
  $.getJSON($jsonUrl, function(data) { embedPosts(data); });

	function embedPosts(data) {
	  // iterate through posts
	  $.each(data.posts, function(i, item) {

      // set base post element and add the post type as a class
      var $post = $($opts.post);
      $post.addClass(item.type);

      // set the post meta
      var $meta = $($opts.meta);
      // format the post date and embed it
      formattedDate = formatDate(item["date"], $opts.dateFormat);
      $($opts.date).html(formattedDate).appendTo($meta);
      // build the post permalink and embed it
      permalink = '<a href="'+item["url-with-slug"]+'">'+$opts.permalinkText+'</a>';
      $($opts.permalink).html(permalink).appendTo($meta);
      // append the post meta to the post base elment
      $post.append($meta);

      // set the post data
      var $data = $($opts.data);
      // Render post content depending on post type
      switch(item.type) {
        case "regular":
          $($opts.regularTitle).html(item["regular-title"]).appendTo($data); // append regular post title
          $($opts.regularBody).html(item["regular-body"]).appendTo($data); // append regular post body
          break;
        case "photo":
          if (item["photos"].length > 0) { // this means it's a photoset
            $post.removeClass('photo').addClass('photoset'); // switch post type class from photo to photoset
            for (var j=0; j < item["photos"].length; j++) { // iterate thorugh post photos, add images and captions
              image = $($opts.photoImage).html('<img src="'+item["photos"][j]["photo-url-"+$opts.photosetImageWidth]+'" />'+"\n");
              caption = $($opts.photoCaption).html(item["photos"][j]["caption"]+"\n");
              $($opts.photoContainer).append(image).append(caption).appendTo($data);
            };
          } else { // it's a single photo, add image and caption
            image = $($opts.photoImage).html('<img src="'+item["photo-url-"+$opts.photoImageWidth]+'" />'+"\n");
            caption = $($opts.photoCaption).html(item["photo-caption"]+"\n");
            $($opts.photoContainer).append(image).append(caption).appendTo($data);
          };
          break;
        case "quote":
          $($opts.quoteText).html(item["quote-text"]).appendTo($data); // append quote post text
          $($opts.quoteSource).html(item["quote-source"]).appendTo($data); // append quote post source
          break;
        case "link":
          link = '<a href="'+item["link-url"]+'">'+item["link-text"]+'</a>'; // build link
          $($opts.linkContainer).html(link).appendTo($data); // append link post link
          $($opts.linkDescription).html(item["link-description"]).appendTo($data); // append link post description
          break;
        case "conversation":
          $($opts.conversationTitle).html(item["conversation-title"]).appendTo($data); // append converstation post title
          $conversationContainer = $($opts.conversationContainer); // set conversation containing element
          for (var j=0; j < item["conversation"].length; j++) { // iterate through conversation lines
            $($opts.conversationLabel).addClass(item["conversation"][j]["label"]).html(item["conversation"][j]["label"]).appendTo($conversationContainer);
            $($opts.conversationPhrase).addClass(item["conversation"][j]["label"]).html(item["conversation"][j]["phrase"]).appendTo($conversationContainer);
          }; 
          $conversationContainer.appendTo($data);
          break;
        case "video":
          $($opts.videoPlayer).html(item["video-player"]).appendTo($data); // append video post player
          $($opts.videoCaption).html(item["video-caption"]).appendTo($data); // append video post caption
          break;
        case "audio":
          $($opts.audioPlayer).html(item["audio-player"]).appendTo($data); // append video post player
          $($opts.audioCaption).html(item["audio-caption"]).appendTo($data); // append video post caption
          break;
        default:
          break;
      };
      // append post data to the post base elment
      $post.append($data);
      // appenda base element to containing element
      $postsContainer.each(function() {
        $(this).append($post);
      });
      
      eval($opts.callback);
    });
	};

  function formatDate(date, dateFormatString) {

    _d = new Date(date);

    a = $opts.shortWeekDays[_d.getDay()];
  	A = $opts.longWeekDays[_d.getDay()];
  	b = $opts.shortMonths[_d.getMonth()];
  	B = $opts.longMonths[_d.getMonth()];
  	d = (_d.getDate() < 10 ? '0' + _d.getDate().toString() : _d.getDate().toString());
  	H = _d.getHours();
  	y = _d.getYear();
  	Y = _d.getFullYear();
  	m = (_d.getMonth() < 10 ? '0' + _d.getMonth().toString() : _d.getMonth().toString());
  	M = _d.getMinutes();

  	if(!dateFormatString) dateFormatString = '%d/%m/%Y';

    $dateOutput = "";
  	for (var i=0; i < dateFormatString.length; i++) {
  		if (dateFormatString[i] == '%') {		
  			$dateOutput += eval(dateFormatString[++i]);	  
  		} else {
  			$dateOutput += dateFormatString[i];
  		};
  	};
    return $dateOutput;
  };
    
};

$.fn.writeTumblelog.defaults = {

  // JSON data filters
  tumblrUrl: null,
  start: 0,
  num: 20,
  tagged: null,
  type: null,
  
  // post container elements
  post: '<article></article>',
  meta: '<div class="meta"></div>',
  data: '<div class="data"></div>',
  
  // permalink options
  permalink: '<p class="permalink"></p>',
  permalinkText: '&infin;',
  
  // date options
  date: '<p class="date"></p>',
  dateFormat: '%d-%m-%Y', // set the date format a-la-strftime (available: %a %A %b %B %d %H %y %Y %m %M)
  longWeekDays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  shortWeekDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  longMonths: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  shortMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  
  // regular post options
  regularTitle: '<h1></h1>',
  regularBody: '<div></div>',
  
  // photo post options
  photoContainer: '<div class="photo-item"></div>',
  photoImage: '<p></p>',
  photoCaption: '<p class="caption"></p>',
  photoImageWidth: 400, // set the image size in pixels (options: 75, 100, 250, 400, 500)
  photosetImageWidth: 75,
  
  // quote post options
  quoteText: '<blockquote></blockquote>',
  quoteSource: '<p class="quote-source"></p>',
  
  // link post options
  linkContainer: '<p></p>',
  linkDescription: '<p class="caption"></p>',
  
  // conversation post options
  conversationTitle: '<h1></h1>',
  conversationContainer: '<dl></dl>',
  conversationLabel: '<dt></dt>',
  conversationPhrase: '<dd></dd>',
  
  // video post options
  videoPlayer: '<div class="video-player"></div>',
  videoCaption: '<p class="caption"></p>',
  
  // audio post options
  audioPlayer: '<div class="video-player"></div>',
  audioCaption: '<p class="caption"></p>',
  
  callback: null

};
})(jQuery);