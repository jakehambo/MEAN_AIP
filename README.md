# MEAN_AIP #
http://104.196.255.79
http://vinshcki.net

### PUBLIC API INFO ###
***GET***

Get all walks
http://localhost:8000/walksaip

Get one walk
http://localhost:8000/walksaip/{id}

***POST***

Add a walksaip
http://localhost:8000/{walk.body} (walk.body = stores all fields in form)

***PUT***

Update a walk
http://localhost:8000/walksaip/{id}

***DELETE***

Delete a walk
http://localhost:8000/walksaip/{id}

### CODE PRINCIPLES ###

1. All single line comments must be represented as '//foo' and all multi-line comments must be represented as '/*bar*/'.
2. If there are more than 100 characters on a single line then make a portion of that line into a new line.
3. Do not include multiple scripting/programming languages in the same file, put them in separate files and include the
file in the relevant file.
4. Code must not be commented out. It must be removed.
5. Every complex unit of code must be commented, it is optional to comment every unit.
6. Variable names and method/function names must be named appropriately. The names must be meaningful.
7. Add debug logs where necessary. Do not include these logs in every function.
8. No duplicate code is allowed. Put the code in a function or method and reuse it.
9. Braces must be on the same line of the function/method with one space before it.
10. Naming conventions for methods/functions must have a capital letter at the beginning of each following word. Variables
must be all lowercase. Constants must be capitalised with underscores separating each word.
11. A single statement that can fit on one line can only be put on the same line as the if statement without braces.
12. Empty blocks of code must be concise. There should be no new lines between the opening brace and closing brace. All braces
need to be on the same line.
13. Arrays can be on the same line or it can be an optional block like style with every array element on a new line.
14. Code in brackets should not be viewed as ( element ), no spaces are allowed in the brackets, it must be represented as (element).
15. Code will be indented using tabs not spaces.

### REFERENCES ###
Login
http://jasonwatmore.com/post/2015/12/09/mean-stack-user-registration-and-login-example-tutorial

Web service
https://developers.google.com/maps/documentation/javascript/examples/places-searchbox
