Here's my Redcar Founding Engineer Take-Home Assignment! 

The app is currently deployed at: https://aidan-lynott-redcar-project.vercel.app/

The GitHub with the code is: https://github.com/Aidan-Lynott/Redcar-Project/

It was a really fun experience learning to do this as I pretty much haven't done any of this before. 

I did, however, spend a lot more time than the recommended 4-6 hours. A lot more. It was still fun though!

Some notes on the site:
- To use it, register a username/password combo and then login with it.
- Ask a question in the question field. This question should explicitely include a web domain if you do not want to include it in the domain field.
- The AI will search exactly the domain you provide for info. For example, if a football question includes espn.com, it will only look at espn.com, NOT espn.com/nfl.
- The AI does NOT need any input in the domain field if said domain is in the question.
- If there is a different domain in the domain field than in the question, the AI will prioritize the domain in the domain field.

Potential Errors:
- Real time streaming with Google Gemini broke in the past 48 hours; it worked for me Tuesday and stopped working Wednesday.
The code is written so that once Google fixes this it should work on the app, but as of writing it does not.
I found multiple forum posts confirming this is an issue others are having as well:
https://x.com/danilo_torrisi/status/1877384939177439641
https://github.com/google-gemini/generative-ai-js/issues/324
https://discuss.ai.google.dev/t/gemini-using-1-5-flash-suddenly-throwing-invalid-error-argument-for-prompts-with-file-uri-input/59684 <-- Specifically the posts by Ryan_L and rajatrocks share that they are facing the same issue as I am
- Google Gemini's free tier only allows for 15 requests per minute.
If you do not use the domain field and instead only put your domain in your question, it takes 2 AI calls to answer your question.
Thus, in the worst case the site can only answer 7 questions per minute.
If I were in a situation where I felt more AI calls than this were needed, I would pay for more calls, but for now I'm keeping it free for me.

Choices:
- For the AI, I decided to use Google Gemini. I chose this AI service provider as it has a free tier (OpenAI, for example, does not)
Google Gemini also allows for real-time streaming of results, when it is working (as mentioned above it is broken right now)
Google Gemini was also easy to set up, as google provides some documentation: https://ai.google.dev/api/generate-content
- For the frontend deployment, I chose to use Vercel (vercel.com) since it was recommended online for frontend hosting, it was free, and it was easy to set up.
- For the backend deployment, I chose to use Railway (railway.com) since it was also recommended online for backend hosting, it was free, and it was easy to set up.

How to run the app locally:
1 - Download the code from github
  
2 - Add environment variables into the code's .env file:
You need a Gemini Api Key and to make a JWT secret key
Get a gemini api key here: https://aistudio.google.com/app/apikey
Add to the .env file:
GEMINI_API_KEY=[Your Gemini API key]
JWT_SECRET=[Your choice]

3 - Launch the backend:
cd into the backend-project directory
Run "npm run start"

4 - Launch the frontend:
cd into the backend-project directory
Run "npm start"

Then you should be able to use the app locally.

I hope you enjoy!

- Aidan

