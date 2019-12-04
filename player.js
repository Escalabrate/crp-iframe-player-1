window.addEventListener("message", function(e) {

		console.log(e);
		console.log(e.currentTarget.document.referrer);

		var video_config_media = JSON.parse(e.data.video_config_media);
		var user_lang = e.data.lang;
		var video_stream_url = "";
		var video_id = video_config_media['metadata']['id'];
		var rows_number = 0;
		var video_m3u8_array = [];
		var video_m3u8= "";
		var episode_title = "";

	    for(var i = 0; i < video_config_media['streams'].length; i++)
		{
		  if(video_config_media['streams'][i].format == 'trailer_hls' && video_config_media['streams'][i].hardsub_lang == user_lang)
		  {
		    if(rows_number <= 5){
			video_m3u8_array.push(video_config_media['streams'][i].url.replace("clipTo/120000/", "clipTo/" + video_config_media['metadata']['duration'] + "/"));
    		    	rows_number++;
		    }
		  }
		  if(video_config_media['streams'][i].format == 'adaptive_hls' && video_config_media['streams'][i].hardsub_lang == user_lang)
		  {
		    video_stream_url = video_config_media['streams'][i].url;
		    break;
		  }
		}
		//console.log(video_m3u8_array);
		
		video_m3u8 = '#EXTM3U' +
		             '\n#EXT-X-STREAM-INF:PROGRAM-ID=1,BANDWIDTH=4112345,RESOLUTION=1280x720,FRAME-RATE=23.974,CODECS="avc1.640028,mp4a.40.2"' +
			     '\n' + video_m3u8_array[0] +
			     '\n#EXT-X-STREAM-INF:PROGRAM-ID=1,BANDWIDTH=8098235,RESOLUTION=1920x1080,FRAME-RATE=23.974,CODECS="avc1.640028,mp4a.40.2"' +
			     '\n' + video_m3u8_array[1] +
			     '\n#EXT-X-STREAM-INF:PROGRAM-ID=1,BANDWIDTH=2087088,RESOLUTION=848x480,FRAME-RATE=23.974,CODECS="avc1.4d401f,mp4a.40.2"' +
			     '\n' + video_m3u8_array[2] +
			     '\n#EXT-X-STREAM-INF:PROGRAM-ID=1,BANDWIDTH=1090461,RESOLUTION=640x360,FRAME-RATE=23.974,CODECS="avc1.4d401e,mp4a.40.2"' +
			     '\n' + video_m3u8_array[3] +
			     '\n#EXT-X-STREAM-INF:PROGRAM-ID=1,BANDWIDTH=559942,RESOLUTION=428x240,FRAME-RATE=23.974,CODECS="avc1.42c015,mp4a.40.2"' +
			     '\n' + video_m3u8_array[4] +
			     '\n#EXT-X-STREAM-INF:PROGRAM-ID=1,BANDWIDTH=193544,RESOLUTION=144x80,FRAME-RATE=23.974,CODECS="avc1.42c00c,mp4a.40.2"' +
			     '\n' + video_m3u8_array[5];
	
		if(video_stream_url == ""){
		    var blob = new Blob([video_m3u8], {type: "text/plain; charset=utf-8"});
		    video_stream_url = URL.createObjectURL(blob) + "#.m3u8";
		}
		
		if(video_config_media['metadata']['up_next'] == undefined){
		   episode_title = 'Episódio ' + video_config_media['metadata']['display_episode_number'];
		}else{
		   var prox_ep_number = video_config_media['metadata']['up_next']['display_episode_number'];
		   episode_title = video_config_media['metadata']['up_next']['series_title'] + ' - ' + prox_ep_number.substring(0, prox_ep_number.length - 1) + video_config_media['metadata']['display_episode_number'];
		}
		var playerInstance = jwplayer("player_div")
		playerInstance.setup({
			title: episode_title,
			description: video_config_media['metadata']['title'],
		        file: video_stream_url,
		        image: video_config_media['thumbnail']['url'],
		        width: "100%",
		        height: "100%"
		});

		jwplayer().on('ready', function(e) {
			if(localStorage.getItem(video_id) != null){
				document.getElementsByTagName("video")[0].currentTime = localStorage.getItem(video_id);
			}
			document.body.querySelector(".loading_container").style.display = "none";
		});
		const interval = setInterval(function() {
			if(jwplayer().getState() == "playing"){
   				localStorage.setItem(video_id, jwplayer().getPosition());
   			}
 		}, 5000);
});
