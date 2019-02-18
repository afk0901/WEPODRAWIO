//Loads a select list with some optional range, starting with the optional range
function loadNumbersSelect(maxNumber, range = 1, id) {

for(var i = range; i <= maxNumber; i+= range){
    $(id).append('<option>' + i + '</option>');
}
}


//Loads strings to select, takes in a string array
function loadStringsSelect(id, stringArray) {
    for(var i = 0; i < stringArray.length; i++){
        console.log(stringArray[i]);
        console.log(stringArray.length);
        $(id).append('<option>'+ stringArray[i] + '</option>');
    }
}
