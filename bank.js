/**
 * launchMenu
 *
 * A function that launches a menu using window.prompt, where the user can pick one option
 * by typing in the corresponding number
 *
 * @params
 *     menuOptions (array) - an array of objects, each with the following properties:
 *       name (string) - the name of the feature as it is to be displayed in the menu
 *       run (function) - a reference to the function which is to be executed when the user picks
 *           the given option
 *     intro (string, optional) - text to be added at the beginning of the dialog
 */
function launchMenu(menuOptions, intro) {
	/**
	* getChoice
	*
	* A launchMenu's inner function, which is responsible for displaying the menu
	* and obtaining user input
	*
	* @params
	*     menuOptions (array) - as in launchMenu - we could in fact omit it, because since getChoice is
	*         a sub-function within the launchMenu function, it also has direct access to launchMenu's
	*         parameters (which work like local variables). As it is, the getChoice function is defined
	*         within the scope of launchMenu only for clearer organization. If we took it out and declared
	*         it as an independent function in the global scope:
	*             // example A
	*             function getChoice(menuOptions) {
	*                 ... // do something with menuOptions
	*             }
	*             function launchMenu(menuOptions) {
	*                 var choice = getChoice(menuOptions);
	*                 ... // run the appropriate function based on choice
	*             }
	*         it would work just as well, because even though it couldn't directly see launchMenu's
	*         parameters, it would still be passed the necessary information when called via its parameter.
	*         On the other hand, if we remove the menuOptions parameter:
	*             // example B
	*             function launchMenu(menuOptions) {
	*                 function getChoice() {
	*                     ... // do something with menuOptions
	*                 }
	*                 var choice = getChoice();
	*                 ... // run the appropriate function based on choice
	*             }
	*         then the function works only as long as it can glance its enclosing function's (launchMenu's)
	*         parameter menuOptions. Taken out of the context:
	*             function getChoice() {
	*                 ... // do something with menuOptions... wait, with what?!
	*                     // As seen from here, a variable menuOptions doesn't exist
	*             }
	*             function launchMenu(menuOptions) {
	*                 var choice = getChoice();
	*                 ... // run the appropriate function based on choice
	*             }
	*         getChoice would produce an error, since it couldn't see menuOptions, which is launchMenu's
	*         parameters, which works like a local variable and is, therefore, invisible outside the function
	*         it was defined within. This would not necessarily be bad as getChoice probably won't be used
	*         anywhere outside launchMenu. I don't know yet which way is considered better but it
	*         did it the way I did just to make an example. I guess it depends on the paradigm:
	*              - in FUNCTIONAL programming, functions are supposed to be independent entities that don't know
	*                anything they weren't explicitly told (via arguments), so we would probably code it like
	*                in example A,
	*              - in PROCEDURAL programming functions are used just to group code, and there's no prohibition
	*                against them reading or modifying variables external to them, so either way would be acceptable
	*                but example B would be more natural.
	*         Below, in the actual code, I used something in between. Why? Because I felt like, and fuck you.
	*
	* @return option selected by user (a number within the range from 1 to menuOptions.length)
	*/
	function getChoice(menuOptions) {
		// Using a loop to repeat the process if user enters an invalid value
		do {
			// Initialize the message string
			var message = intro + 'Choose one of the following:\n';
			/*
			 * For each element in menuOptions, add its representation to message.
			 * This is equivalent to:
			 *     for (var index = 0; index < menuOptions.length; index++) {
	         *         var option = menuOptions[index];
	         *         ...
	         *     }
	         * or
	         *     for (var index in menuOptions) {
	         *         ...
	         *     }
	         */
			menuOptions.forEach(function (option, index) {
				// Append a line like '1) First option'
				message += (index + 1) + ') ' + option.name + '\n';
			});
			// Display the message and obtain user input (string), and try to convert it to a number
			var choice = Number(prompt(message));
		// Run as long as choice is not within the allowable range of numbers or isn't a number at all
		} while ((isNaN(choice)) || (choice < 1) || (choice > menuOptions.length));
		// When choice is finally valid, return its value to the caller
		return choice;
	}
	// Obtain user choice (number between 1 and menuOptions.length)
	var choice = getChoice(menuOptions);
	// Find the corresponding element in menuOptions (need to subtract 1 from choice because array
	// indices start with zero while the user chose a number from a list starting with 1)
	// and run the function associated with it.
	// The function should return true if it wants the menu not to show again after it ends.
	do {
		var stop = menuOptions[choice - 1].run();
	} while (!stop);
}

/**
 * randomInteger
 *
 * Generates a random integer within the specified range.
 *
 * @param
 *     min (number: integer) - minimum value (inclusive)
 *     max (number: integer) - maximum value (inclusive)
 *
 * @return random integer x where (min <= x <= max)
 */
 function randomInteger(min, max) {
 	// If the caller provided no arguments, assume range [0..1]
 	if (min == undefined) {
 		min = 0;
 		max = 1;
 	// If the called provided just one argument, assume it to be the max value, and default to min = 1
 	} else if (max == undefined) {
 		max = min;
 		min = 0;
 	}
 	// Generate the number and return it to the caller
 	return Math.floor(Math.random() * (max - min + 1) + min);
 }

/**
* generateRandomString
*
* Generates a string made of randomly chosen (can repeat) characters from a specified pool
*
* @params
*     length (number: integer) - the length of the string to generate
*     charactersToUse (array or string) - array of (supposedly) 1-character strings or just a string
*         containing all the characters that are to be used. Both will work without any need for
*         adjustments, since in JavaScript:
*         - array[0] is the first element of the array,
*         - string[0] is the first character in a string.
*         So if you want a 4-character string of letters randomly chosen from the pool of A, B, and C,
*         you can use either:
*             var myString = generateRandomString(4, ['A', 'B', 'C']);
*             // or
*             var myString = generateRandomString(4, 'ABC');
*         I'd go with the second option since there's less writing.
*/
function generateRandomString(length, charactersToUse) {
	// Initialize an empty string because otherwise the variable will be undefined, and:
	//     '' + 'str' == 'str'
	//     undefined + 'str' == 'undefinedstr'
	// because when adding a string to it, the value undefined is first converted to a string: 'undefined'
	var result = '';
	// save the maximum index in charactersToUse not to have to burder to CPU with the subtraction
	// in every loop iteration
	var maxIndex = charactersToUse.length - 1;

	for (var i = 0; i < length; i++) {
		result += charactersToUse[randomInteger(0, maxIndex)];
	}
	return result;
}

// a string of digits to use with generateRandomString as the charactersToUse argument
var digits = '0123456789';

/**
* bankApp
*
* This function launches the app and contains everything specific to the bank app.
* Note that e.g. launchMenu was declared outside of bankApp's scope because its a general
* functionality, not strictly related to the bank app - it could be used by any program.
*/
function bankApp() {
	/**
	* Account
	*
	* This is a constructor on the basis of which client accounts will be created.
	*/
	function Account(login) {
		this.login = login;
		this.password = ''; // will be assigned later
		this.owner = ''; // owner's name, will be assigned later
		this.balance = 0;
		// Run generateAccountNumber (function defined below) to assign a random
		// but unique number to the account
		this.accountNumber = generateAccountNumber(4 /* number of digits */);
	}

	/**
	 * accounts
	 *
	 * An array which is going to store references to all accounts in our bank.
	 * This is, of course, going to be an array of objects of the Account type (or class),
	 * i.e. objects created with the use of the constructor Account.
	 */
	var accounts = [];

	/**
	* accounts.find
	*
	* accounts is an array, but arrays are also objects, so we can add methods to them.
	* This method searches through the array for all objects that have a given property
	* equal to a given value, e.g.
	*     accounts.find('owner', 'John Doe');
	* returns an array of all accounts assigned to the name John Doe, or:
	*     accounts.find('login', 'killa123');
	* returns an array of accounts with the login 'killa123'. Of course, this array should
	* have only one element, since there shouldn't be more than one account with the same login.
	*
	* @params
	*     property (string) - the name of the property to filter the results by
	*     value (any) - the value that the property needs to have
	*
	* @return an array of objects (of type/class Account) for which this.property == value
	*     (if no matches were found, an empty array is returned)
	*/
	accounts.find = function(property, value) {
		console.log('Searching for account with ' + property + ' equal to ' + value);
		// The filter method, which all arrays have, goes through the entire array and launches
		// a given function passing the current element as an argument. It returns a sub-array
		// of all the elements for whom the function returned true.
		return accounts.filter(function (account) {
			console.log(account);
			// Here I'm using the alternative, array-like syntax to access an object's property,
			// i.e. I've written account[property] (which e.g. if property == 'login', translates to
			// account['login']) instead of account.property because if account actually had a
			// property called 'property', it would be ambiguous which one we mean
			return account[property] == value;
		})
	};

	/**
	* generateAccountNumber
	*
	* Create a random but unique sequence of digits that will serve as an account number
	*
	* @params
	*     length (number: integer) - how many digits the account number should consist of
	*
	* @return the generated account number
	*/
	function generateAccountNumber(length) {
		return generateRandomString(length, digits);
	}

	function signUp() {
		// Obtain user input for the login
		var login = prompt('Enter a login you\'d like to use to sign into our system:');
		// Search for an account with the given log in, and if you find one:
		if (accounts.find('login', login).length > 0) {
			// Tell the user the login's taken
			alert('Account with this login already exists.');
			// Break out of the signUp function
			return;
		}
		// Create a new Account object (without putting it in the accounts array yet)
		var account = new Account(login);
		// The get some more data
		account.owner = prompt('Enter your full name:');
		account.password = prompt('Define a password for signing in:');
		// Add the newly created account to the database
		accounts.push(account);
		// Inform the client what's her new account number using prompt with default value
		// so the user can easily copy the number to the clipboard.
		// (accountNumber has already been generated in the constructor)
		prompt('Great! Your new account number is: ', account.accountNumber);
	}

	function signIn() {
		// Obtain login from user and find the right account
		var account = accounts.find('login', prompt('Enter your login:'))[0];
		// If there's no account with this login, alert the user and quit the function
		if (account == undefined) {
			alert('Sorry, but there is no account with such login.');
			return;
		}
		// Obtain the password as check if it matches
		if (account.password == prompt('Enter you password:')) {
			// If so, go to account management
			manageAccount(account);
		} else {
			// If not, alert te user
			alert('Wrong password.');
		}
	}

	function manageAccount(account) {
		var accountMenu = [{
			name: ''
		}]
	}

	var mainMenu = [{
			name: 'Log into account',
			run: signIn
		},
		{
			name: 'Create new account',
			run: signUp
		},
		{
			name: 'Exit',
			run: function () {
				alert('See you next time!');
				// Return true so the menu that launched this function will know
				// not to show back again.
				return true; 
			}
		}
	];

	launchMenu(mainMenu);
}

bankApp();