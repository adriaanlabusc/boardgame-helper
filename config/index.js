if (process.env.NODE_ENV === 'production') {
	module.exports = {
    port: 8080,
    kik: {
    	// ENV variable work flow:
    	// 		set a secret key: now secrets add kikprodapikey "api-key-goes-here"
    	//		expose the secret as an ENV variable: now -e KIK_PROD_API_KEY=@kikprodapikey  NOTE: this deploys the app
    	//    for help: now help secret
      apiKey: process.env.KIK_PROD_API_KEY,
      botUsername: 'boardgamehelper', // [Non functional example] startkitbot
      baseUrl: 'https://boardgame-helper.now.sh' // [Non functional example] http://4b7e3c1e.ngrok.io
    }
  };
} else {
	module.exports = {
    port: 8080,
    kik: {
      apiKey: process.env.KIK_DEV_API_KEY, // [Non functional example] 0a275f34-31da-4ds1-b3c9-d4576f38bac8
      botUsername: 'boardgamehelper', // [Non functional example] startkitbot
      baseUrl: 'http://e33e3df1.ngrok.io' // [Non functional example] http://4b7e3c1e.ngrok.io
    }
  };
}
