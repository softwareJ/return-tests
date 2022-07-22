var type_test = require('./helpers/typeTest');
var format = require('./helpers/stringFormatters');

/**
 * makes sure the return value matches at least one of test.unit.must_be_value.values (array)
 * 
 * @param {object} test The object containing the function which was just tested
 * @param {Number} return_value The return value from the function which was just tested
 * @param {Number} i the index of the function
 * @param {Number} j the parameter index that was just executed
*/

function test(test, return_value, i, j) { 

 if(!type_test(
  test.unit.must_be_value, 
  test.unit.must_be_value.on, 
  test.unit.must_be_value.values, 
  test.unit.must_be_value.index_exact
 )) { 
  throw new Error(`
   function index: ${i}\n
   error: (unit.must_be_value) must be an object 
   with parameters (on: boolean) (values: array) 
   (index_exact: boolean)`
  );
 } 

 if(test.unit.must_be_value.on === true) {

  if(
    return_value === null || 
    typeof(return_value) !== 'object'
   ) {

   if(
    test.unit.must_be_value.index_exact === false && 
    test.unit.must_be_value.values.includes(return_value) !== true
   ) { 
    return format({
     id: 'valueErrorAll', 
     return_value: return_value, 
     compared_to: JSON.stringify(test.unit.must_be_value.values)
    }); 
   }

   if(
    test.unit.must_be_value.index_exact === true && 
    test.unit.must_be_value.values[j] !== return_value
   ) { 
    return format({
     id: 'valueErrorOne', 
     return_value: return_value, 
     compared_to: typeof(test.unit.must_be_value.values[j]) === 'object' ? 
     JSON.stringify(test.unit.must_be_value.values[j]) : 
     test.unit.must_be_value.values[j]
    }); 
   }

  } 

  if(typeof(return_value) === 'object') { 

   if(test.unit.must_be_value.index_exact === false) {
    var found = false;
    for(let k = 0; k < test.unit.must_be_value.values.length; k++) { 
     if(typeof(test.unit.must_be_value.values[k]) === 'object') { 
      if(compare(test.unit.must_be_value.values[k], return_value) === true) { //will change JSON.stringify(test.unit.must_be_value.values[k]) === JSON.stringify(return_value)
       found = true;
       break;
      }
     }
    }
    if(found === false) { 
     return format({
      id: 'valueErrorAllObject', 
      return_value: JSON.stringify(return_value), 
      compared_to: JSON.stringify(test.unit.must_be_value.values)
     });
    }
   }

   if(
    test.unit.must_be_value.index_exact === true && 
    compare(test.unit.must_be_value.values[j], return_value) === false  //JSON.stringify(test.unit.must_be_value.values[j]) !== JSON.stringify(return_value)
   ) { 
    return format({
     id: 'valueErrorOneObject', 
     return_value: JSON.stringify(return_value), 
     compared_to: typeof(test.unit.must_be_value.values[j]) === 'object' ? 
     JSON.stringify(test.unit.must_be_value.values[j]) : 
     test.unit.must_be_value.values[j]
    });
   }

  }

 }

 return 'PASSED';

}

/**
 * deep comparing two objects. 
 * recursively going in on objects and arrays 
 * pushing values to the components array, iterating and comparing.
 * There are more types to check in the else statement...
 * if you want to add to this just pull and 
 * say what to do. (worked on first try... huh, no kiddin)
*/

var components = [];

function compare(av, rv) { 

 components = [];

 if(av === rv) { 
  return true;
 }

 if(
  typeof(av) !== 'object' || 
  typeof(rv) !== 'object'
 ) { 
  return false;
 }

 if(
  (Array.isArray(av) === true && Array.isArray(rv) === false) || 
  (Array.isArray(av) === false && Array.isArray(rv) === true)
 ) { 
  return false;
 } 

 /*
  making sure to always pass in two objects 
  the only things that should come in here is an object or array... 
  if something else then ill have to check for that later
 */

 if(
  Array.isArray(av) === true &&
  Array.isArray(rv) === true
 ) { 

  av = { 
   array: av
  }

  rv = { 
   array: rv
  }

 }

 var avkeys = Object.keys(av);
 var rvkeys = Object.keys(rv);

 if(avkeys.length !== rvkeys.length) { 
  return false;
 }

 const compare_av = deep_check_object(av, avkeys); components = [];
 const compare_rv = deep_check_object(rv, rvkeys);

 if(compare_av.length !== compare_rv.length) { 
  return false; 
 }

 for(let i = 0; i < compare_av.length; i++) { 
  if(compare_av[i] !== compare_rv[i]) { 
   return false;
  }
 }

 return true;

}

function deep_check_object(obj, keys) { 

 keys.forEach((key, index) => {

  if(
   typeof(obj[key]) === 'object' && 
   Array.isArray(obj[key]) === false && 
   obj[key] !== null
  ) {
   components.push(`${key}-object-${obj[key]}`);
   push_proto(obj[key]);
   deep_check_object(obj[key], Object.keys(obj[key]));
  }

  else if(
   typeof(obj[key]) === 'object' && 
   Array.isArray(obj[key]) === true
  ) {
   components.push(`${key}-array-${obj[key]}`);
   push_proto(obj[key]);
   deep_array_check(key, obj[key]);
  }

  else { 
   components.push(`${key}-single-${obj[key]}`);
   push_proto(obj[key]);
  }

 });

 return components;

}

function deep_array_check(key, arr) { 

 for(let i = 0; i < arr.length; i++) { 

  if(
   typeof(arr[i]) === 'object' && 
   Array.isArray(arr[i]) === false && 
   arr[i] !== null
  ) { 
   components.push(`${key}-object-${arr[i]}`);
   push_proto(arr[i]);
   deep_check_object(arr[i], Object.keys(arr[i]));
  }

  else if(
   typeof(arr[i]) === 'object' && 
   Array.isArray(arr[i]) === true
  ) {
   components.push(`${key}-array-${arr[i]}`);
   push_proto(arr[i]);
   deep_array_check(key, arr[i]);
  }

  else { 
   components.push(`${key}-single-${arr[i]}`);
   push_proto(arr[i]);
  }

 }

} 

function push_proto(v) { //if there are some attachments, go through and push
 return;
}

module.exports = test;