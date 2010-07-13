# Tumblr Writer

This is a jQuery plugin that I use to embed my tumblr posts on a webpage. It's still very very alpha.    

Example using div elements:

    <!DOCTYPE html>
    <html>
    	<head>
    	  <meta charset="utf-8" />
    	  <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js"></script>
    	  <script src="jquery.tumblrWriter.js"></script>
    	  <script>
    	    $(document).ready(function() {

            $("#posts").writeTumblelog({
              tumblrUrl: 'blog.diegomolina.pe'
            });

    	    });
    	  </script>
    	</head>
    	<body>
    	  <div id="posts">

    	  </div>
    	</body>
    </html>
    
Example using list elements:

    <!DOCTYPE html>
    <html>
    	<head>
    	  <meta charset="utf-8" />
    	  <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js"></script>
    	  <script src="jquery.tumblrWriter.js"></script>
    	  <script>
    	    $(document).ready(function() {

            $("#posts").writeTumblelog({
              tumblrUrl: 'blog.diegomolina.pe',
              post: '<li class="post"></li>'
            });

    	    });
    	  </script>
    	</head>
    	<body>
    	  <ol id="posts">

    	  </ol>
    	</body>
    </html>