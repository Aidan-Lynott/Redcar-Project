import { Controller, Sse, Query, Post, Body, Get } from '@nestjs/common';
import { Observable } from 'rxjs';
import { QuestionService } from './question.service';
import { Question } from './question.entity';
import { Readable } from 'stream';
import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';
import * as cheerio from 'cheerio';

@Controller('questions')
export class QuestionController {

  private readonly apiKey: string;

  constructor(
    private readonly questionService: QuestionService
  ) {
    this.apiKey = process.env.GEMINI_API_KEY; // Ensure your .env file is correctly set up
    console.log(process.env.GEMINI_API_KEY);  // Log for debugging (you may want to remove this in production)
  }

  @Sse('stream')
  async streamQuestion(@Query('question') question: string, @Query('domain') domain: string): Promise<Observable<MessageEvent>> {
    const context = `Context for domain ${domain}`;

    const genAI = new GoogleGenerativeAI(this.apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt_start = `
      You are an AI model on a website where the user can ask questions
      about companies. In the question, the user is meant to reference
      a website where one could go to get information about that business.
      Do not mention scraping html or html in your response, if you want to 
      mention html refer to it as the text on the website. Like "scraping 
      html" could be "getting the website's text" instead. Keep your answer 
      at 3 sentences or less, and if the question can be answered in less 
      definitely answer in less. Also do not mention the html provided to 
      you, just refer to it as the text on the website. Also only return plain text, 
      do not try to bold anything or something like that.
      `;
    let prompt = ''

    if (domain == '') {
      const new_prompt = prompt_start + `
      In the following sentence, please, in one word, identify the website that is in the question.
      The website can take many forms. Here are come example questions and what you should return:
      "where is redcar.io located?" should output redcar.io
      "omg the world is ending.co please help me" should output ending.co
      "I need cabbage from webkinz.qqq/cabbage" should output webkinz.qqq/cabbage
      "The big man at espn.espn/espn/espn/espn" should output espn.espn/espn/espn/espn
      If there are multiple websites please return the one you think is most relevant to the conversation
      If there is no website, type only the word 'None'. 
      Here is the question from the user: ` + question;
      const result = await model.generateContent(new_prompt);
      domain = result.response.text();
    }

    let cleanHTML = 'None'
    // Scrape the website
    if (domain != 'None') {

      let html = '';
      if (domain && domain !== 'None') {
        try {
          // Ensure the URL has a valid protocol
          if (!domain.startsWith('http://') && !domain.startsWith('https://')) {
            domain = `https://${domain}`; // Default to HTTPS
          }
      
          const response = await axios.get(domain); // Fetch the HTML content
          html = response.data;
      
          if (!html) {
            console.log('No HTML returned from the website.');
            domain = 'Invalid Domain';
          } else {
            console.log('Successfully scraped the website.');
          }
        } catch (error) {
          console.error('Error scraping website:', error.message);
          domain = 'Error Scraping Website'; // Handle errors gracefully
        }
      }

      // Process the HTML if valid
      if (html && domain !== 'Invalid Domain' && domain !== 'Error Scraping Website') {
        try {
          const $ = cheerio.load(html);

          // Remove all <script> tags
          $('script').remove();

          // Extract plain text and remove all brackets
          cleanHTML = $('body').text().replace(/[\[\]<>]/g, '').trim();

          if (cleanHTML.length === 0) {
            console.log('HTML processed, but no meaningful text found.');
            domain = 'No Content Found';
          } else {
            console.log('HTML successfully processed:', cleanHTML);
            // Use cleanText for further processing or as part of your application logic
          }
        } catch (error) {
          console.error('Error processing HTML:', error.message);
          domain = 'Error Processing HTML';
        }
      }
    }

    console.log(cleanHTML)

    // Set up the prompts
    // Prompts if there was an identified domain
    if (domain != 'None') {
      if (domain == 'Invalid Domain') {
        prompt = prompt_start + `
        The user previously identified the domain they were interested in as ` + domain + `.
         However, there was no html returned from the website, indicating 
         that it's an invalid domain. Apologize to the user, and tell them to 
         check for spelling mistakes in their domain. Here is their original question: ` + question;

      }
      else if (domain == 'Error Scraping Website') {
        prompt = prompt_start + `
        The user previously identified the domain they were interested in as ` + domain + `.
         However, there was an error scraping the website so the information about 
         the business could not be found. Apologize to the user for this, make it clear
          that the website may just not allow robots/ai/whatever to access it, 
          but also tell them they can try again in case it is a one time error.
          Also encourage the user to check the spelling of their domain in case they 
          spelt it wrong. Here is the user's question: ` + question;
      }
      else if (domain == 'No Content Found') {
        prompt = prompt_start + `
        The user previously identified the domain they were interested in as ` + domain + `.
        However, there was no relevant htlm (visible text in paragraphs and the sort) to 
        give information about the business. Apologize to the user for this and encourage
         them to try a different domain. Here's the user's original question: ` + question;
      }
      else if (domain == 'Error Processing HTML') {
        prompt = prompt_start + `
        The user previously identified the domain they were interested in as ` + domain  + `.
        However, there was an error processing the html of the website so the information about 
        the business could not be found. Apologize to the user for this, and tell them 
        to try again as this may be a one time error. Here is the user's question: ` + question;
      }
      else {
        prompt = prompt_start + `
        The user previously identified the domain they were interested in as ` + domain + `
         and upon scraping the website the relevant HTML and thus information about 
         the business looks like ` + cleanHTML + `. Please use that information from 
         the website of the company to answer the following question for the user: ` + question;
         console.log('print!!!!!!')        
      }

    } 
    // Prompts if there was no identified domain
    else {
      prompt = prompt_start + `
      Unfortunately, in their question yuou were previously unable to 
      identify what domain they were asking about, and there may not have been
      a domain in their question at all. Tell the user that you are likely 
      not able to provide them with an accurate result without this domain.
      Provide them with your best guess, but emphasize that it is just a guess,
      and they should provide a website for better information. Here is the 
      user's original question: ` + question;
    }

    // Create a readable stream
    const stream = new Readable({
      read() {},  // Necessary to avoid "not implemented" error
    });

    // Create an Observable to handle SSE streaming
    return new Observable<MessageEvent>((subscriber) => {
      (async () => {
        try {
          // Await the promise to get the result
          console.log(prompt)
          const result = await model.generateContentStream(prompt);  // Await here to get the stream

          // Iterate over chunks and push them to the SSE client as soon as they are received
          for await (const chunk of result.stream) {  // Access 'stream' after awaiting the result
            const chunkText = chunk.text();
            console.log('Received chunk:', chunkText);  // Log for debugging

            // Push chunk to the SSE client immediately
            subscriber.next(new MessageEvent('message', { data: chunkText }));
          }

          // When the stream ends, complete the SSE stream
          subscriber.next(new MessageEvent('end', { data: 'Streaming complete' }));
          subscriber.complete();
        } catch (error) {
          console.error('Error calling Google Gemini:', error.message);
          subscriber.error(error);  // Propagate error to SSE client
        }
      })();  // Call the async function immediately
    });
  }

  // Endpoint to save a new question and result
  @Post()
  async addQuestion(
    @Body('question') question: string,
    @Body('domain') domain: string,
    @Body('result') result: string,
  ): Promise<Question> {
    return this.questionService.addQuestion(question, domain, result);
  }

  // Endpoint to fetch all questions and results
  @Get()
  async getAllQuestions(): Promise<Question[]> {
    return this.questionService.getAllQuestions();
  }
}