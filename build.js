
/*
  @param {all_functions_to_test: array}: Functions stored in each folder.
*/

const configure = { 

    all_functions_to_test: [
      './functions/example1.js',
    ],

  }

  /*
    @param {developer_input: object}: imported data
    @param {tests: array}: array of objects to run tests
    @param {allowed_types: object}: allowed return types
    @param {allowed_values: object}: allowed return values
    @param {regex_set: object}: allowed regular expressions
    @param {function_called: function}: function passed 
    @param {error_sets: array}: exported set of objects that did not pass test
  */

  var error_sets = [];
          
  for(let i = 0; i < configure.all_functions_to_test.length; i++) {

    try {

      var developer_input = require(configure.all_functions_to_test[i]); 

      if(developer_input.replace_tests_with_multiplied_on_load === true) { 
        developer_input.tests = multiply_function_set(
          developer_input.db === true ? fetch_content(developer_input.db.file_path) : developer_input.function_set_multiplied, //make sure returned value is in same format as original
          developer_input.tests, 
          configure.all_functions_to_test[i]
        );
      }

      run_tests(
        developer_input.tests, 
        developer_input.allowed_types, 
        developer_input.allowed_values, 
        developer_input.regex_set, 
        developer_input.function_called, 
        configure.all_functions_to_test[i],
        developer_input.function_name, 
        developer_input.function_directory,
        developer_input.function_description,
        developer_input.base_param_names
      );

    } catch(err) {

      console.log(err.message);

    }

  }

  /*
    fetch from database
  */

  function fetch_content(file_path) { }

  /*
    multiply on multiply_amount
  */

  function multiply_function_set(multiply_function_set, original_tests, folder) { 

    var new_tests_array = [];

    try { 

      for(let i = 0; i < multiply_function_set.length; i++) { 
        new_tests_array = new_tests_array.concat(arrays_returned(multiply_function_set[i]));
      }

      return new_tests_array;

    } catch(err) { 

      console.log(`
        error: multplying did not work on index ${i} - 
        please see function_set_multiplied in folder: ${folder}`
      );

      return original_tests;

    }

  }

  /*
    The array of objects returned 
  */

  function arrays_returned(multiply_and_returned_set) {

    var returned_set = [];

    for(let i = 0; i < multiply_and_returned_set.randomized.parameters.multiply_amount; i++) { 

      returned_set.push(create_single_randomized_object(
        multiply_and_returned_set,
        multiply_and_returned_set.randomized.parameters,
      ));

    }

    return returned_set;

  }

  /*
    creates and returns a single randomized object
  */

  function create_single_randomized_object(attach_here, allowed_random_parameters) { 

    var params = {};

    for(let i = 0; i < allowed_random_parameters.length; i++) { 

      var current_parameter = allowed_random_parameters[i]; 

      if(current_parameter === 'string') { 
        params[`test-param-string-${i}`] = create_random_inner_param_string();
      }

      else if(current_parameter === 'number') { 
        params[`test-param-number-${i}`] = create_random_inner_param_number();
      }

      else if(current_parameter === 'BigInt') { 
        params[`test-param-BigInt-${i}`] = create_random_inner_param_BigInt();
      }

      else if(current_parameter === 'object') { 
        params[`test-param-object-${i}`] = create_random_inner_param_object(attach_here.randomized.when_obj_passed); // (string, number, both) - p count
      }

      else if(current_parameter === 'array') { 
        params[`test-param-array-${i}`] = create_random_inner_param_array(attach_here.randomized.when_arr_passed); //(string, number, both) - p count
      }

      else if(current_parameter === 'undefined') { 
        params[`test-param-undefined-${i}`] = undefined;
      }

      else if(current_parameter === 'boolean') { 
        params[`test-param-boolean-${i}`] = create_random_inner_param_boolean();
      }

      else { 

        console.log(
          `error: please pass in a string, number,
           BigInt, object, array, undefined, or boolean. 
           defaulting to number.`
        );

        params[`test-param-number-${i}`] = create_random_inner_param_number();

      }

    }

    attach_here.params = params;

    return attach_here;

  }

  function create_random_inner_param_string()  { 
    return require('./random/string');  
  }

  function create_random_inner_param_number()  { 
    return require('./random/number');  
  }

  function create_random_inner_param_BigInt()  { 
    return require('./random/BigInt');  
  }

  function create_random_inner_param_object(config_and_build)  {
     return require('./random/object');  
  }

  function create_random_inner_param_array(config_and_build)   { 
    return require('./random/array');  
  }

  function create_random_inner_param_boolean() { 
    return require('./random/boolean'); 
  }

  /*
    check tests... (get rid of file name and fix som params passed in...) (if the fall back isnt good, get out cause it needs to be set... if fallback not set, check main.. if main not good, continue)
  */
          
  function run_tests(tests, allowed_types, allowed_values, regex_set, function_called, file_name, function_name, function_directory, function_description, base_param_names, type_of_error_check = 'fallback') {

    if(!main_or_fallback_errors(
      tests, 
      allowed_types, 
      allowed_values, 
      regex_set, 
      function_called, 
      file_name, 
      function_name, 
      function_directory, 
      function_description, 
      base_param_names, 
      type_of_error_check
    )) { 
      return;
    };
  
    for(let i = 0; i < tests.length; i++) { 

      if(
        (typeof(tests[i]) !== 'object') || 
        (typeof(tests[i]) === 'object' && typeof(tests[i].unit) !== 'object') || 
        (typeof(tests[i]) === 'object' && typeof(tests[i].index_of_set) !== 'number')
      ) {

        console.log(`
          (tests) need to be defined as an object with object
          (unit: object) and (index_of_set: index)
          ${i}: ${typeof(tests[i].index_of_set) !== 'undefined' ? tests[i].index_of_set : 'index not found'}
        `);

        continue;

      }
  
      var params = [];
  
      for (const [key, value] of Object.entries(tests[i].parameters)) {
        params.push(value);
      }

      var main_or_fallback = 'main';

      typeof(tests[i].function_called) === 'object' && tests[i].function_called.on === true && typeof(tests[i].function_called.function) === 'function' ? (function_called = tests[i].function_called.function, main_or_fallback = 'main') : (function_called = function_called, main_or_fallback = 'fallback');

      if(main_or_fallback === 'main') { 
        if(!main_or_fallback_errors(
          tests, 
          tests[i].unit.allowed_types, 
          tests[i].unit.allowed_values, 
          tests[i].unit.regex_set, 
          tests[i].function_called.function, 
          file_name, 
          tests[i].function_called.function_name, 
          tests[i].function_called.function_directory, 
          tests[i].function_called.function_description, 
          tests[i].function_called.base_param_names, 
          main_or_fallback
        )) { 
          continue;
        };
      }
  
      var return_value = function_called(...params);
      var err_object = tests[i];
      var error_count = 0;

      var allowed_types_unit_or_single = ( //check main on these
        typeof(tests[i].unit.allowed_types) !== 'undefined' && tests[i].unit.allowed_types.on === true && Array.isArray(tests[i].unit.allowed_types.values) ?
        { on: true, test: 'unit', v: tests[i].unit.allowed_types } : allowed_types.on === true ?
        { on: true, test: 'single', v: allowed_types } : 
        { on: false, test: 'off' }
      );
  
      if(allowed_types_unit_or_single.on === true) {
  
        if(allowed_types_unit_or_single.v.values.includes(typeof(return_value)) !== true) {
  
          err_object.error_type = true;
  
          err_object.error_type_message = `The value returned is not within the allowed types.`;
  
          err_object.error_type_rtype = typeof(return_value);
  
          err_object.error_type_value = return_value;
  
          error_count++;
  
        }
  
      }

      var allowed_values_unit_or_single = ( //check main on these
        typeof(tests[i].unit.allowed_values) !== 'undefined' && tests[i].unit.allowed_values.on === true && Array.isArray(tests[i].unit.allowed_values.values) ? 
        { on: true, test: 'unit', v: tests[i].unit.allowed_values } : allowed_values.on === true ? 
        { on: true, test: 'single', v: allowed_values } : 
        { on: false, test: 'off' }
      );
  
      if(allowed_values_unit_or_single.on === true) {
  
        if(
          typeof(return_value) === 'number' || 
          typeof(return_value) === 'BigInt' || 
          typeof(return_value) === 'string' ||  
          typeof(return_value) === 'undefined' ||  
          typeof(return_value) === 'boolean'
        ) {
  
          if(allowed_values_unit_or_single.v.values.includes(return_value) !== true) {  
  
            err_object.error_value = true;
  
            err_object.error_value_message = `The value returned is not within the allowed values.`;
  
            err_object.error_value_rvalue = return_value;
  
            err_object.error_value_type = typeof(return_value);
  
            error_count++;
  
          }
  
         } else if(typeof(return_value) === 'object') { 
  
           var match = false;
  
           for(let i = 0; i < allowed_values_unit_or_single.v.values.length; i++) { 
             if(typeof(allowed_values_unit_or_single.v.values[i]) === 'object') { 
              if(JSON.stringify(allowed_values_unit_or_single.v.values[i]).toLowerCase().trim() === JSON.stringify(return_value).toLowerCase().trim()) { 
                match = true;
                break;
              }
             }
           }
  
           if(match === false) { 
  
              err_object.error_value = true;
  
              err_object.error_value_message = `The value returned is not within the allowed values.`;
  
              err_object.error_value_rvalue = return_value;
  
              err_object.error_value_type = typeof(return_value);
  
              error_count++;
  
           }
  
         } else { 
  
           console.log(`
            error: the only allowed types are number, BigInt, string, boolean, undefined and object
           `);
  
         }
  
      }

      var allowed_regex_unit_or_single = ( //check main on these
        typeof(tests[i].unit.regex_set) !== 'undefined' && tests[i].unit.regex_set.on === true && Array.isArray(tests[i].unit.regex_set.values) ? 
        { on: true, test: 'unit', v: tests[i].unit.regex_set } : regex_set.on === true ? 
        { on: true, test: 'single', v: regex_set } : 
        { on: false, test: 'off' }
      );
    
      if(allowed_regex_unit_or_single.on === true) {

        var regex_pass = false;
  
        for(let i = 0; i < allowed_regex_unit_or_single.v.values.length; i++) {  
  
          var test_regex = test(allowed_regex_unit_or_single.v.values[i], return_value); 
  
          if(test_regex !== true) { 
  
            if(regex_pass === false) { 
              err_object.error_regex = true;
              regex_pass = true; 
            };
  
            err_object[`error_regex_message-${i}`] = `The value returned does not pass`;
  
            err_object[`error_regex_regular_expression-${i}`] = allowed_regex_unit_or_single.v.values[i];
  
            err_object[`error_regex_return_value-${i}`] = return_value;
  
            err_object[`error_regex_returned_rejex-${i}`] = test_regex;
  
            error_count++;
  
          }
  
        }
  
      }
  
      if(error_count > 0) { //fix this

        if(main_or_fallback === 'fallback') { 

          err_object.function_name = function_name; 

          err_object.function_directory = function_directory; 

          err_object.function_description = function_description;

          err_object.base_param_names = base_param_names;

          //pass testing info

        } else { 

          err_object.function_name = tests[i].function_called.function_name;

          err_object.function_directory = tests[i].function_called.function_directory

          err_object.function.function_description = tests[i].function_called.function_description;

          err_object.base_param_names = tests[i].function_called.base_param_names;

          //pass testing info

        }

        //file name

        err_object.index_of_error_set = typeof(tests[i].index_of_set) !== 'undefined' ? tests[i].index_of_set : 'index not found';

        error_sets.push(err_object);

      }
  
    }
         
  }

  /*
    Testing the input of main and fallback errors (running errors twice on tests in some cases)
  */

  function main_or_fallback_errors(tests, allowed_types, allowed_values, regex_set, function_called, file_name, function_name, function_directory, function_description, base_param_names, type_fallback_or_main) { 

    var init_errors = {};

    if((typeof(tests) !== 'object') || Array.isArray(tests) === false) {
      init_errors.tests = '(tests) need to be defined as an array with object (unit: object) and (index_of_set: index)';
    }
    

    if(
      (typeof(allowed_types) !== 'object') || 
      (typeof(allowed_types) === 'object' && typeof(allowed_types.on) !== 'boolean') || 
      (typeof(allowed_types) === 'object' && (typeof(allowed_types.values) !== 'object' || Array.isArray(allowed_types.values) === false))) {
      init_errors.allowed_types = '(allowed_types) must be an object with paramters (on: boolean) and (values: array)';
    }

    if(
      (typeof(allowed_values) !== 'object') || 
      (typeof(allowed_values) === 'object' && typeof(allowed_values.on) !== 'boolean') || 
      (typeof(allowed_values) === 'object' && (typeof(allowed_values.values) !== 'object' || Array.isArray(allowed_values.values) === false))) {
      init_errors.allowed_values = '(allowed_values) must be an object with parameters (on: boolean) and (values: array)';
    }

    if(
      (typeof(regex_set) !== 'object') || 
      (typeof(regex_set) === 'object' && typeof(regex_set.on) !== 'boolean') || 
      (typeof(regex_set) === 'object' && (typeof(regex_set.values) !== 'object' || Array.isArray(regex_set.values) === false))) {
      init_errors.regex_set = '(regex_set) must be an object with parameters (on: boolean) and (values: array)';
    }

    if(typeof(function_called) !== 'function') {
      init_errors.function_called = '(function_called) must be a function';
    }

    if(typeof(file_name) !== 'object' && typeof(file_name) !== 'string') {
      init_errors.file_name = '(file_name) must be null or a string';
    }

    if(typeof(function_name) !== 'object' && typeof(function_name) !== 'string') {
      init_errors.function_name = '(function_name) must be null or a string';
    }

    if(typeof(function_directory) !== 'object' && typeof(function_directory) !== 'string') {
      init_errors.function_directory = '(function_directory) must be null or a string';
    }

    if(typeof(function_description) !== 'object' && typeof(function_description) !== 'string') {
      init_errors.function_description = '(function_description) must be null or a string';
    }

    if(typeof(base_param_names) !== 'object' && typeof(base_param_names) !== 'string') {
      init_errors.base_param_names = '(base_param_names) must be null or a string';
    }

    var size = Object.keys(init_errors).length;

    if(size > 0) { 

      console.log(`Error Main or Fallback: ${type_fallback_or_main} --- Directory of Error: ${typeof(function_directory) !== 'undefined' ? function_directory : 'undefined'} ---------------- /n`);

      for (const [key, value] of Object.entries(init_errors)) {
        console.log(`${key}: ${value} /n`);
       }    

       return false;

    }

    return true;

  }
  
  /*
    @param {regular_expression: string}: regular expression being tested
    @param {return_value: BigInt, number, string, undefined, null, object, boolean}: the value being tested against
  */
  
  function test(regular_expression, return_value) { 
    try {
      return new RegExp(regular_expression).test(return_value);
    } catch(err) { 
      return false;
    } 
  }

  /*
    export the error set
  */

  exports.errors = error_sets;

  