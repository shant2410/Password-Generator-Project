const inputSlider=document.querySelector("[data-lengthSlider]");
const lengthDisplay=document.querySelector("[data-lengthNumber]");

const passowardDisplay=document.querySelector("[data-passwordDisplay]");
const copyBtn=document.querySelector("[data-copy]");
const copyMsg=document.querySelector("[data-copyMsg]");
const uppercaseCheck=document.querySelector("#uppercase");
const lowercaseCheck=document.querySelector("#lowercase");
const numbersCheck=document.querySelector("#numbers");
const symbolsCheck=document.querySelector("#symbols");
const indicator=document.querySelector("[data-indicator]");
const genrateBtn=document.querySelector(".generateButton");
const allCheckBox=document.querySelectorAll("input[type=checkbox]");
const symbols='~!@#%$&(^)<:;?/{|}.<,>*-+="'

//defult values

let password="";
let passwordLength=10;
let checkCount=0;
// handSlider();


setIndicator("#ccc");
//set password length through slider
function handSlider(){
    inputSlider.value=passwordLength;
    lengthDisplay.innerHTML=passwordLength;
    const min=inputSlider.min;
    const max=inputSlider.max;
    inputSlider.style.backgroundSize=((passwordLength-min)*100/(max-min))+"% 100";

    

}
function setIndicator(color){
    indicator.style.backgroundColor=color;
    indicator.style.boxShadow='0px 0px 12px 1px $(color)';
}

function getRndInteger(min,max){

    //math.random giving random value on range [0,1)
    //*(max-min) getting in that range
  return  Math.floor(Math.random()*(max-min))+min;

}
function generateRandomNumber(){
    return getRndInteger(0,9);
}
function generateLowercase(){
    //he ASCII values of lowercase letters range from 97 to 122
    //String.fromCharCode() -->converts acii value to char 
    return String.fromCharCode(getRndInteger(97,122));


}

function generateUppercase(){
    //he ASCII values of lowercase letters range from 65 to 90
    //String.fromCharCode() -->converts acii value to char 
    return String.fromCharCode(getRndInteger(65,90));
}
function generateSymbol(){
 const randNum=getRndInteger(0,symbols.length);
 return symbols.charAt(randNum);
}

function calcStrength(){
    let hasUpper=false;
    let hasLower=false;
    let hasNum=false;
    let hasSymbol=false;

    if(uppercaseCheck.checked) hasUpper=true;
    if(lowercaseCheck.checked) hasLower=true;
    if(numbersCheck.checked) hasNum=true;
    if(symbolsCheck.checked) hasSymbol=true;

    if(hasUpper && hasLower && (hasNum || hasSymbol) && passwordLength>=8)
        {
            setIndicator("#0f0");
        }
        else if((hasLower || hasUpper) && 
        (hasNum || hasSymbol) && passwordLength>=6
        ) 
            {
                setIndicator("#ff0");

            }
            else{
                setIndicator("#f00");
            }
        
}
//for copying password (use async function)


async function copyContent(){
    //to copy clipboard
    //error hndling
    try{
   await navigator.clipboard.writeText(passowardDisplay.value);
    //copy hone ke baad
    copyMsg.innerText="copied";
   }
   //for error

   catch(e){
    copyMsg.innerText="Failed";
   }
   //to make copy wala span visible
   copyMsg.classList.add('active');

   setTimeout(()=>{
    copyMsg.classList.remove("active");
   },2000);
}

//for shuffling password
function shufflePassword(array){
    //fisher yates method for shuffling apply on array
    for(let i=array.length-1;i>0;i--)
        {
            //find the random integer in range of 0 to i+1; (i+1 is exclude)
            const j=Math.floor(Math.random()*(i+1));
            //then performing swapping operation between i and j
            const temp=array[i];
            array[i]=array[j];
            array[j]=temp;
        }
        let str="";
        array.forEach((el)=>(str+=el));
        return str;
}


//for checkbox operations
function handleCheckBoxChange(){
    checkCount=0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked)
            {
                checkCount++;

            }

    });
    //special case
    if(passwordLength<checkCount)
        {
            passwordLength=checkCount;
            handSlider();

        }

}
allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener('change',handleCheckBoxChange);
})

inputSlider.addEventListener('input',(e)=>{
    passwordLength=e.target.value;
    handSlider();

})
//to activate copy btn using event listener
copyBtn.addEventListener('click',()=>{
    if(passowardDisplay.value)
        {
            copyContent();

        }  
})

//main function for generate password
genrateBtn.addEventListener('click',()=>{
    //none of the checkbox are selected 
    if(checkCount<=0)
        {
            return;
        }
        if(passwordLength<checkCount)
            {
                passwordLength=checkCount;
                handSlider();
            }
        //lets's start the journey to find new password
        //remove old password
        password="";
        //let's put the stuff mentioned by checkboxes
        // if(uppercaseCheck.checked)
        //     {
        //         password+=generateUppercase();
        //     }
        //     if(lowercaseCheckk.checked)
        //         {
        //             password+=generateLowercase();
        //         }
        //     if(numbersCheck.checked)
        //             {
        //                 password+= generateRandomNumber();
        //             }
        //     if(symbolsCheck.checked)
        //          {
        //              password+=generateSymbol();
        //          }
        let funcArr=[];
        if(uppercaseCheck.checked)
            {
                funcArr.push(generateUppercase);
            }
         if(lowercaseCheck.checked)
            {
                 funcArr.push(generateLowercase);

            }
        if(numbersCheck.checked)
            {
                funcArr.push(generateRandomNumber);
            } 
        if(symbolsCheck.checked)
             {
                 funcArr.push(generateSymbol);
             }
            
             //compulsory addition
             for(let i=0;i<funcArr.length;i++)
                {
                    
                    password+=funcArr[i]();
                }
                
                //remaining addition
                for(let i=0;i<passwordLength-funcArr.length;i++)
                    {
                        let randIndex=getRndInteger(0,funcArr.length);
                        password+=funcArr[randIndex]();

                    }
                    
                    //now shuffle the password
                    password=shufflePassword(Array.from(password));
                  
                    //show in ui
                    passowardDisplay.value=password;
                    
                    
                    //calculation strength
                    calcStrength();



});














