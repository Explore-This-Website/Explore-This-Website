var flipped = false;

function submit(){
    var inputVal = document.getElementsByName('inputBox')[0].value;

    switch(inputVal){
        case "do a flip":
            if (!flipped){
            document.getElementById('body').style.rotate = '180deg'
            flipped = true;
            } else {
            document.getElementById('body').style.rotate = '0deg'
            flipped = false;
            }
    }

    document.getElementsByName('inputBox')[0].value = '';

}