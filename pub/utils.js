function assert(condition, message) {
    if (!condition) {
        throw message || "Assertion failed";
    }
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}

removeFromArray = function(array,obj)
{

    for (var i=array.length-1; i>=0; i--)
    {
        if (array[i]==obj)
        {
            array.splice(i,1);
            return;
        }
    }
}

//remove with "swap and pop" , order of objects will change
removeFromArray2 = function(array,obj)
{

    for (var i=0; i < array.length; ++i)
    {
        if (array[i]==obj)
        {
           let temp = array[i];
           array[i] = array[array.length-1];
           array[array.length-1] = temp;
           array.pop();
           return;

        }
    }
}




function g_shuffle(array) {
    let counter = array.length;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        let index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        let temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
}

module.exports.removeFromArray2 = removeFromArray2;
