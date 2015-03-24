Utils = {
  // event.type должен быть keypress
  getChar: function(event) {
    if (event.which == null) {  // IE
      if (event.keyCode < 32)
        return null; // спец. символ
      return String.fromCharCode(event.keyCode) 
    }

    if (event.which!=0 && event.charCode!=0) { // все кроме IE
      if (event.which < 32) return null; // спец. символ
        return String.fromCharCode(event.which); // остальные
    }

    return null; // спец. символ
  },
  
  // использование Math.round() даст неравномерное распределение!
  getRandomInt: function(min, max)
  {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
  
  text: function(str){
    console.log(str);
  }
}