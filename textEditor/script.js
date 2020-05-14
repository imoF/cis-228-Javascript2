'use strict'

/* Common variables *////////////////////////////////////////////////////////

let text = document.getElementById('writing');
let copyHere = document.getElementById('copy');
let search = document.getElementById('searchBox');
let repl = document.getElementById('replaceBox');
let replaceThis = document.getElementById('replaceNext');
let replaceAll = document.getElementById('replaceAll');
let next = document.getElementById('next');
let prev = document.getElementById('prev');
let caseSen = document.getElementById('caseSens');
let act = 0;//will decide what to do with case sensitivity
let aNewArr = [];

/* Main *///////////////////////////////////////////////////////////////////

function main() {

    document.addEventListener('DOMContentLoaded', (evnt) => {
        copyHere.innerHTML = text.value //same as below
        looking(); //to accommodate firefox devBrowser keeping text in textarea after refresh

        text.addEventListener('input', (evnt) => {
            copyHere.innerHTML = text.value
            looking()
        }); //end EL to make text the same for copy div & text

        text.addEventListener('scroll', (evnt) => { copyHere.scrollTop = evnt.target.scrollTop; });//end EL to make scroll the same for copy div & text

        copyHere.addEventListener('scroll', (evnt) => { text.scrollTop = evnt.target.scrollTop; });//end EL to make scroll the same for copy div & text when searching for a match

        caseSen.addEventListener('change', sense);

        search.addEventListener('input', look);
        search.addEventListener('click', () => { let copyData = copyHere.textContent; });

        next.addEventListener('click', nextMatch);
        prev.addEventListener('click', prevMatch);

        replaceThis.addEventListener('click', replace);
        replaceAll.addEventListener('click', replaceA);

    });//end ready

}//end main

/* Other Functions *////////////////////////////////////////////////////////

function look(evnt) {
    evnt.preventDefault();
    looking()
} //end function to deal w/ found matches

function looking() {
    let find = search.value
    if (find !== "") {
        let arr = buildAwithCopyLetters()

        aNewArr = makeArr(aNewArr, find)

        underlineMatches(arr, aNewArr, find)

        if (aNewArr.length === 0) {
            nONE('None')
        } else {
            highlight('first')
            nONE(aNewArr.length)
        }//lets the user know the word isn't there or highlights it

    } else {
        copyHere.innerHTML = text.value;
        nONE('');
    }//end if else for finding in text
} // end function looking to show the user the matches

function buildAwithCopyLetters() {
    let arr = []
    let copyData = copyHere.textContent;
    for (let letter = 0; letter < copyData.length; letter++) {
        let letters = copyData[letter]
        arr.push(letters);
    }//adds all letters to array
    return arr
} //builds array with letters from copy data

function makeArr(aNewArr, find) {
    aNewArr = [];
    let data = text.value;
    let letterPlace = 0;
    let regex = makeRegex(find)

    while (letterPlace !== null) {
        letterPlace = regex.exec(data); //this is the main part it saves the location of the last found
        if (letterPlace !== null && letterPlace !== 0) {
            let theLocation = letterPlace['index']
            aNewArr.push(theLocation);
        }
    }//while loop that puts the location of the letters of a search into the aNewArr array

    return aNewArr
}//puts the locations in the new array

function underlineMatches(arr, aNewArr, find) {
    let update = 0;
    copyHere.innerHTML = '';
    for (let letter = 0; letter < arr.length; letter++) {
        let yes = aNewArr.includes(letter);
        if (yes) {
            let span = document.createElement('span');
            span.textContent = search.value;
            copyHere.appendChild(span);
            update = letter + find.length
        } else if (update === letter) {
            copyHere.innerHTML += arr[letter]
            update++
        }//end if else-if
    }//end for to underline all matches
} //end function to underine matches

function nONE(value) {
    document.getElementById('matched').textContent = value;
} // end function none to display amount of matches

function highlight(origin) {
    let highlighted;
    let lastOne = copyHere.lastElementChild;
    let firstOne = copyHere.firstElementChild;

    if (origin === "first") {
        highlighted = copyHere.firstElementChild;
    } else {
        highlighted = document.getElementById('highlightMe')
        highlighted.id = ''
    }//end 

    if (origin === "next") {

         highlighted = (highlighted === lastOne)? copyHere.firstElementChild : highlighted.nextElementSibling;

    } else if (origin === "prev") {

        highlighted = (highlighted === firstOne) ? copyHere.lastElementChild : highlighted.previousElementSibling;

    } else if (typeof origin === 'number') {
        
        highlighted = (origin >= copyHere.children.length) ? copyHere.firstElementChild : copyHere.children[origin];
        
    } // end if else if else if to figure out which function is highlighting

    highlighted.id = 'highlightMe';
    highlighted.scrollIntoView(false);
}//end highlight function to highlight the text found

function nextMatch(evnt) {
    evnt.preventDefault()
    moveToNext('nfunc')
}//end function to highlight next match

function moveToNext(origin) {
    let spans = copyHere.getElementsByTagName('span');
    (spans.length !== 0 && origin === 'nfunc') ? highlight('next') :
    (spans.length !== 0) ? highlight(origin) : nONE('None');
}//end actual next function

function prevMatch(evnt) {
    evnt.preventDefault()
    let spanner = copyHere.getElementsByTagName('span');
    (spanner.length !== 0) ? highlight('prev') : nONE('None');
}//end function to highlight prev match

function sense(evnt) {
    let sign = document.getElementById('enOrDis')    
    sign.textContent = (caseSen.checked) ? "On" : "Off";
    act = (caseSen.checked) ? 1 : 2;
    
    looking() //for automatic updates
}//end case sensitivity function

function makeRegex(find) {
    let regex;

    find = escapeSpecial(find);//function to id and replace special characters for regex functionality

    if (act === 0) {
        regex = new RegExp(find, 'ig')//for off case sens the i turns it off

    } else {
        regex = new RegExp(find, 'g')//for on w/o i

    }//end case sensitivity regexp - works!

    return regex
}//end func to give regexp based on case checkbox

function escapeSpecial(find) {
    let sum = 0;
    let obj = {};

    obj['a'] = ['.', '\\.', find.indexOf('.')]
    obj['b'] = ['\\', '\\\\', find.indexOf('\\')]
    obj['c'] = ['+', '\\+', find.indexOf('+')]
    obj['d'] = ['*', '\\*', find.indexOf('*')]
    obj['e'] = ['$', '\\$', find.indexOf('$')]
    obj['f'] = ['^', '\\^', find.indexOf('^')]
    obj['g'] = ['(', '\\(', find.indexOf('(')]
    obj['h'] = [')', '\\)', find.indexOf(')')]
    obj['i'] = ['[', '\\[', find.indexOf('[')]
    obj['j'] = ['?', '\\?', find.indexOf('?')]
    obj['k'] = ['|', '\\|', find.indexOf('|')]
    obj['l'] = ['{', '\\{', find.indexOf('{')]

    for (let item in obj) {
        let num = obj[item][2]
        sum = sum + num
    } // end for to calculate the sum of special letters in find

    if (sum !== -12) {
        let keys = Object.keys(obj);
        for (let spec of keys) {
            let numInObj = obj[spec][2];
            while (numInObj !== -1) {
                let rep = obj[spec][0];
                let repWith = obj[spec][1];
                find = find.replace(rep, repWith)
                numInObj = -1;
            }// end while to address each special character
        }//end for to escape special characters
    } // end if to escape and reassign special characters in find

    return find
} // end function to address special characters that need to be escaped

function replace(evnt) {
    evnt.preventDefault();
    let data = text.value;
    let change = repl.value
    let item = search.value;

    let atThisLoc = copyHere.children
    let replacedText = '';
    let goTo;
    let now;
    let aNA = [];
    console.log(copyHere.children)
    if (atThisLoc.length !== 0) {

        for (let i = 0; i < data.length; i++) {
            aNA.push(data[i])
        }//putting all letters in a new array

        for (let i = 0; i < atThisLoc.length; i++) {
            let thisOne = copyHere.children[i].id
            if (thisOne === 'highlightMe') {
                goTo = i
                now = aNewArr[i]
            }//end if
        }//end for to find location of text to replace

        aNA.splice(now, (item.length - 1)) //removes text

        for (let i = 0; i < aNA.length; i++) {
            if (i === now) {
                for (let j = 0; j < change.length; j++) {
                    replacedText += change[j]
                }//end for
            } else {
                replacedText += aNA[i]
            }//end if else-if
        }//end for - to insert replaced text

        text.value = replacedText
        copyHere.textContent = text.value;

        looking() //triggered to reset all the set things like number of matches to none etc
        moveToNext(goTo)
    }//end if to fix firefox error

}//end function to replace one by one - they are a bit counter intuitive 


function replaceA(evnt) {
    evnt.preventDefault();

    let data = text.value;
    let change = repl.value;
    let item = search.value;
    let regexAll = makeRegex(item);

    text.value = data.replace(regexAll, change)
    copyHere.textContent = text.value

    looking()
}//end function to replace all occurences


main()
