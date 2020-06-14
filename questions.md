# Exam 2 Questions

* Answers should be roughly 2-5 sentences, and in your own words.  
* Some questions ask for a code sample - keep them short and to the point.
* Be sure to be clear - be careful not to use vague pronouns like "it" if I can't be completely sure what "it" is.
* I cannot assume knowledge you don't demonstrate, so be clear and explicit.

## Q1: The first rule I've given about REST services is that the URL should represent a resource.  What does that mean?  Give an example where a url DOES not represent a resource, then describe how to modify it so that it does.
URL represents a resource: means they often represent a noun (whereas the HTTP method is a verb). The Parameters can also be directly in the URL which depends on the type of the method

Example: /addStudent/ is  not a resourse because its no longer a thing you are interacting with it represents the action you want to perform, but URL is not the action you want to perform, it should be the target of the action.

It should be modified to represent the target for your action like -  /student/ - it should be something you interact with.

## Q2: If the service returns the username as a plain text string, what is wrong with the below and what would fix it? (Assume the service works without error) 
```
  const username = fetch('/username');
  console.log(`user is named ${username}`);
```
The fetch returns a promise, the promise resolves with a response object.
The below code will fix the error
const username = fetch('/username');
promise.then( () => console.log(`user is named ${username}`));


## Q3: What does it mean to "store your state in the DOM"?  Why shouldn't you do this?
"Store your state in the DOM" means - Relying on the data(values, innerHTML) in the DOM components(HTML components <P>, <Div>, <input> etc) to determine the current state of the apllication.
We should not use this because - it is not secure, it is fully visible to the user, it is fully alterable by the user.

## Q4: Explain the differences between a multiple-page-web application and single-page-web application.  Be sure to fully demonstrate your understanding.
Multiple-Page-Web application(MPA): Reloads the entire page and displays the new one when a user interacts with the web app. Each time when a data is exchanged back and forth, a new page is requested from the server to display in the web browser. This process takes time to generate pages on the server, sending it to a client and displaying in the browser which may affect the user experience. It couples the frontend and backend.

Single-Page-Web application(SPA): Consists of only one page, it presents the content in an easy, elegant and effective way as it reloads all the content on just one single page rather than navigating the user to multiple pages. SPAs are faster than MPAs because they execute the logic in the web browser rather than on the server, and after the initial page load, only data is sent back and forth instead of the entire HTML that reduces the bandwidth. They are less secure that MPAs because of its cross-site scripting.

## Q5: What is Progressive Enhancement?  What is the difference in an SPA that uses Progressive Enhancement compared to an SPA that doesn't use Progressive Enhancement?
Progressive Enhancement(PE) - Takes a non-client-side JS web app and augments it with JS, it remains working if no JS ( no client-side JS ).

SPA that uses PE ensures the backend is secure and it is great for accessibility and various devices.
Whereas SPA that doesn't use PE doesn't ensure that the backend is secure.

## Q6: Explain how a REST service is or is not similar to a dynamic asset.
REST service is a system which provides a function or resource to a client (or user). REST is simply a means to access the function or resource offered by the service. For most interactions the service is source of truth for the client. It can be said that clients view REST service as their remote asset. Any local assets (static and dynamic) are usually copies or views generated from this remote asset. Just as local dynamic assets change with events and time, the clients remote assets can also change at run time through various means - such as when client modifies state in the service, a third party interacts with the clients renote assets (e.g. services such as chat, email etc). In this way I believe REST service is similar to a dynamic asset.

## Q7: Give an example of a piece of information you should not store in a cookie, and why you should not store it that way.
Do not use cookies to store below information: 
--Sensitive data (Credit card numbers, passwords),
--Personal data(addresses, social security number),
--Application state,
--Big data,
--Data hard to represent in short bits of text.

The reason not to store information in cookies are:
---Cookies are just an HTTP header, special is how browsers treat them and browser send cookies along with each request.
---Cookies are text based key/value pairs, which are limited to a URL and descendent paths, might have expiration date, might require HTTPS, might not be      	accessible to JS and the data is shared between tabs.
## Q8: Explain why it is useful to separate a function that fetches data from the what you do with that data
The simple answer is seperation of concerns. The tasks and nuances associated with fetching data do not depend on the way the data is consumed by seperating these functions we can reuse the functions consuming data in different systems without worrying about how the data is fetched similarly the functions that fetch data can be reused in different places without worrying about how data is consumed. Separating the functions also reduces the overhead and the chances of error when either of these functions are updated or changed.

## Q9: Explain why try/catch is useless when dealing with asynchronous errors (assume you aren't using async/await)
In the try/catch all the code runs and the events in the callback are in queue, which then to happen
Example: 
try {
	Promise.resolve( )
	.then( ( ) => {
		console.log(1);
		throw new Error("poop");
	});
	} catch(err) {
		// Doesn't happen
		console.log(`caught ${err}`);
	}
	console.log(2);

Output: 2   1
The code on the 57th line runs first (which outputs 2) and then the events which are in queue is executed, and then the code on the 50th line runs(which outputs 1) and in the next line error is thrown but it cant be caught since its not in the try catch anymore, the try catch is already over
    
    
## Q10: Is separation of concerns a front end issue, a server-side issue, or both?  Describe an example the demonstrates your answer.
Separation of concern is both a front end and back end issue, the functions has to be separated in the server side code as well as on the client side code because it lets us change the code without disturbing rest of the system.
Example :
const addButton = document.querySelector('.add-task');
const taskList = document.querySelector('.tasks');

addButton.addEventListener('click', (e) => {
 e.preventDefault();
 const origText = setSpin({button: addButton, spin: true});
 const formData = gatherFormInfo();
 addTask(formData)
 .then( taskList => {
	 refreshList(taskList);
     resetNewTaskInput();
 })
 //...
});

addTask(formData)
.then( taskList => {
	refreshList(taskList);
	resetNewTaskInput();
})
.catch( err => {
   reportError(err);
})
.then( () => {
  setSpin({
     button: addButton, text: origText, spin:false
  });
});

function addTask( { taskText }) {
	return fetch('/tasks',
	  method: 'POST',
	  headers: new Headers({
	     'content-type': 'application/json'
	  }),
	  body: JSON.stringify({ text: taskText });
	})
	//... the rest
};
