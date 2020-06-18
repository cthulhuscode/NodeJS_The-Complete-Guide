// --------------- Arrow functions ---------------
let helloWorld = () => console.log('Hi');

//this
//console.log(helloWorld.bind(this)); //bind indica de dónde tomar el this, es útil por ejemplo en addEventListener

// ----------------- Spread & Rest ------------------
//Spread
let hobbies = ['Programming', 'Reading'];
let moreHobbies = ['Exercise', 'Listening to music']
let copiedHobbies = [...hobbies];
console.log(copiedHobbies);

//adding more at array
copiedHobbies.push(...moreHobbies);
console.log(copiedHobbies);

let person = {
    name: 'Enri',
    age: 19
}

let copiedPerson = {...person};
console.log(copiedPerson);

//Rest
let toArray = (...args) => args;
console.log(toArray(1,2,3,4));

//difference between primitive values vs referenced values
/*Valores primitivos: Son copiados completamente, éstos son
String, Float, Bool, etc.

Valores referenciados: Al copiar uno a otro se pasa su referencia (dirección en memoria)
no el valor, por lo tanto, el modificar a uno también modificaría a los demás.
Una solución es usar:

Object.assign({}, object);

*/

/* ---------- Destructuring ------------- */
//normal arrow function
let printName = (personData) => console.log(person.name);
printName(person);

//using destructuring - take the property name directly
let onlyName = ({name}) => console.log(name);
onlyName(person);

//Esto crea dos constantes con los valores en person
const { name, age } = person;
console.log(name, age)

let [hobby1, hobby2] = copiedHobbies;
console.log(hobby1, hobby2);

// ---------- Async & Promises ---------