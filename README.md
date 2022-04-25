# return_tests

Tests if a functions return value matches a regular expression, data type and data value in the row of the set or in the object of the file.

## How To Configure

Inside 'build.js', add file names to the configure.all_functions_to_test array. The file names come from the '/functions' folder. Each added file is the representation of a set of functions that need testing.

```js
const configure = {
  all_functions_to_test: [
    "./functions/example1.js",
    "./functions/example2.js",
    "./functions/example3.js",
  ],
};
```

## Where your functions live

Go to the '/functions' folder and see how the functions are formatted. Create a new file in that folder with the same format as the examples. The file you create is a supposed to represent all the functions in a directory in your application. Below are the parameters and the types allowed for each. (shimple shimple doo doo doo shimple shimple doo doo doo)

- [ ] tests: array: the array of objects that cotains the function and tests for that function
- [ ] function_called: object: the object that contains the functions configuration
- [ ] function_called.on: boolean: whether to skip this row or execute this row
- [ ] function_called.function_name: : the name of the function executed
- [ ] function_called.function_directory: string: the directory in your application where the function is
- [ ] function_called.function_description: string: the decription of the function
- [ ] function_called.base_param_names: string: the param names passed to the function
- [ ] function_called.function: the function to be called in execution
- [ ] unit: object: the object that contains the three tests
- [ ] unit.allowed_types: object: the allowed types the function must return
- [ ] unit.allowed_types.on: boolean: whether to run allowed types test on the function
- [ ] unit.allowed_types.values: array: the actual types being checked (you get it? Right?)
- [ ] unit.allowed_values: object: the allowed values your return value must match
- [ ] unit.allowed_values.on: boolean: whether to run allowed values check in execution
- [ ] unit.allowed_values.values: array: the values that must match the returned value from the function
- [ ] unit.regex_set: object: the regular expressions tested against
- [ ] unit.regex_set.on: boolean: whether to run the regular expressions check in execution
- [ ] unit.regex_set.values: array: the regular expressions the return value gets checked against
- [ ] index_of_set: integer: the index of the test. (when you multiply this becomes a shared index)
- [ ] parameters: object: the parameters passed in to the function
- [ ] function_set_multiplied: array: set of functions you will multiply each time with random parameters
- [ ] function_set_multiplied.randomized.parameters: array: the type of parameters passed randomly
- [ ] function_set_multiplied.randomized.when_obj_passed: object: when an obj is passed, additional config
- [ ] function_set_multiplied.randomized.when_arr_passed: object: when an array is passed, additional config
- [ ] function_set_multiplied.randomized.multiply_amount: integer: the amount of times to multiply

# Get started

Run 'npm i return_tests' in your application, then go to the '/src' folder and run npm start then go to localhost:3000 to see all the errors for each of the example functions listed in the build.js config object. Then you can add your own functions!
