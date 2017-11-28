/**
 * launchMenu
 *
 * A function that launches a menu using window.prompt, where the user can pick one option
 * by typing in the corresponding number. launchMenu doesn't just get user input but it
 * also expects you to provide information what function to run if user picks a each option
 * and then runs the appropriate one based on user choice.
 *
 * @params
 *     menuOptions (array) - an array of objects, each with the following properties:
 *       name (string) - the name of the feature as it is to be displayed in the menu
 *       run (function) - a reference to the function which is to be executed when the user picks
 *           the given option
 *     intro (string, optional) - text to be added at the beginning of the dialog
 *
 * @return Object {
 *         choice (number: integer): which option the user chose
 *         returnedValue (any): whatever the called function returned
 *     }
 */
function launchMenu(menuOptions, intro = 'Choose one of the following:\n') {
	/**
	* getChoice
	*
	* A launchMenu's inner function, which is responsible for displaying the menu
	* and obtaining user input. It doesn't take any arguments, since because it sits
	* inside launchMenu, it can directly see and use launchMenu's parameters.
	*
	* @return the number of the option the user picked
	*/
	function getChoice() {
		// Using a loop to repeat the process if user enters an invalid value
		do {
			// Initialize the message string
			var message = intro;
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

	// Here begins launchMenu's code execution
	
	// launchMenu will return an object with information on what happened
	return {
		// Obtain user choice (number between 1 and menuOptions.length) and return it as .choice
		choice: getChoice(),
		// run the appropriate function and pass on its returned value via .returnedValue
		returnedValue: menuOptions[choice - 1].run();
	};
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
		var accountMenu = [
			{
				name: 'Make a transfer',
				run: function () {
					if (account.balance == 0) alert('Nothing you could transfer :-(');
				}
			},
			{
				name: 'Make some money magically appear in my account!',
				run: function () {
					var amount = Number(prompt('Ok, how much would you like to get?'));
					if (isNaN(amount)) {
						alert('Doesn\'t seem like a valid number, bro.');
					} else {
						account.balance += amount;
					}
				}
			},
			{
				name: 'Log out',
				run: function () {
					// Just return true so the account menu stops
					return true;
				}
			}
		];
		launchMenu(accountMenu, 'Hello, ' + account.owner + '!\nYour current balance is: ' + account.balance + '\n\n' +
			'What would you like to do?\n');
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
				return 'exit'; 
			}
		}
	];

	do {} while (launchMenu(mainMenu).returnedValue != 'exit');
}

bankApp();