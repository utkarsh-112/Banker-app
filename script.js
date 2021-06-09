'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Utkarsh Kharkwal',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ]
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ]
};

const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements= function(acc,sort= false) {
  //emptying the container
  containerMovements.innerHTML='';

  const movs= sort ? acc.movements.slice().sort(function(a,b) {
    if(a>b)
      return 1;
    else
      return -1;
  }) : acc.movements;
  movs.forEach( function(mov, i) {
    const type= mov >0 ? 'deposit' : 'withdrawal';

    const date=new Date(acc.movementsDates[i]);
    const day=`${date.getDate()}`.padStart(2,0);
    const month=`${date.getMonth() + 1}`.padStart(2,0); //month is 0 based
    const year=date.getFullYear();
    const displayDate=`${day}/${month}/${year}`;

    //html template
    const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${i+1} ${type}</div>
          <div class="movements__date">${displayDate}</div>
          <div class="movements__value">₹ ${mov.toFixed(2)}</div>
        </div>
        </div>
        `
        //adding this html to webpage
        containerMovements.insertAdjacentHTML('afterbegin',html);
  });
}

//display total balance on the right hand top side
const calcDisplaybalance=function(acc) {
  const balance =acc.movements.reduce(function(acc,mov) {
    return acc+mov;
  },0);
  acc.balance=balance; //creating new property in account
  labelBalance.textContent=`₹ ${balance.toFixed(2)}`;
};

const calcDisplaySummary= function(acc) {
  const incomes=acc.movements.filter(function(mov){
    return mov>0;
  }).reduce(function(acc,mov) {
    return acc+mov;
  },0);
  labelSumIn.textContent=`₹ ${incomes.toFixed(2)}`;

  const outcome=acc.movements.filter(function(mov){
    return mov<0;
  }).reduce(function(acc,mov) {
    return acc+mov;
  },0);
  labelSumOut.textContent=`₹ ${Math.abs(outcome).toFixed(2)}`;

  const interest=acc.movements.filter(function(mov){
    return mov>0;
  }).map(function(deposits) {
    return (deposits*acc.interestRate)/100;
  }).reduce(function(acc,mov){
    return acc+mov;
  },0);
  labelSumInterest.textContent=`₹ ${interest.toFixed(2)}`;
}

const rupeetoUsd=73.15;

//creating usernames
const createUsernames=function(accs) {
  accs.forEach(function(acc){
    acc.username=acc.owner
    .toLowerCase()
    .split(' ')
    .map(function(name) {
      return name[0];
    })
    .join('');
  });
};
createUsernames(accounts);

const updateUI=function(currentAccount){
  //display movements
    displayMovements(currentAccount);
    //display balance
    calcDisplaybalance(currentAccount);
    //display summary
    calcDisplaySummary(currentAccount);
}

//Event handlers
//login functionality
let currentAccount ,timer;

//FAKE ALWAYS LOG IN
// currentAccount=account1;
// updateUI(currentAccount);
// containerApp.style.opacity=100;

//date
const now=new Date();
const day=`${now.getDate()}`.padStart(2,0);
const month=`${now.getMonth() + 1}`.padStart(2,0); //month is 0 based
const year=now.getFullYear();
const hour=`${now.getHours()}`.padStart(2,0);
const minute=`${now.getMinutes()}`.padStart(2,0);

labelDate.textContent=`${day}/${month}/${year}, ${hour}:${minute}`;
//date/month/year

//logout timer
const startLogoutTimer=function(){
  //setting the time to 5 minutes
  let time= 300;
  
  const tick= function(){
  const min = String(Math.trunc(time / 60)).padStart(2,0);
  const sec = String(time % 60).padStart(2,0);
  //in each call, print the remaining time to UI 
  labelTimer.textContent=` ${min}:${sec} `;

  //when 0 sec, stop timer and logout user
  if(time===0){
    clearInterval(timer);

    //logging out user OR hiding UI
    labelWelcome.textContent=`Log in to get started`;
    containerApp.style.opacity=0;
  }

  //decrease 1 sec
  time--;
  }
  
  //call the timer every second
  tick();
  const timer=setInterval(tick,1000);

  //to make timer for multiple users
  return timer;
}

btnLogin.addEventListener( 'click', function(e) {
  //this prevents from from submitting so we can see console log 
  //prevents the default behaviour i.e. reloading the page
  e.preventDefault();

  currentAccount=accounts.find(function(acc){
    return acc.username===inputLoginUsername.value;
  });
  if(currentAccount?.pin===Number(inputLoginPin.value)){   //?.--> optional chaining pin will only be read if it exists
    //display UI and welcome message
    labelWelcome.textContent=`Welcome back, ${currentAccount.owner.split(' ')[0]}`;

    containerApp.style.opacity=100;
    //clear input fields
    inputLoginUsername.value=inputLoginPin.value='';
    inputLoginPin.blur();

    //logout timer
    if(timer)  clearInterval(timer); //checking if timer exist then clear current timer before starting another
    
    timer= startLogoutTimer();  
    
    updateUI(currentAccount);

  }
  // else{
  //       labelWelcome.textContent=`Wrong credentials`;
  // }
});

//implementing transfers
btnTransfer.addEventListener('click',function(e){
  e.preventDefault();
  const amount=Number(inputTransferAmount.value);
  const receiverAcc=accounts.find(function(acc){
    return acc.username===inputTransferTo.value;
  });

  inputTransferTo.value=inputTransferAmount.value='';  

  //checking if user has enough amount to transfer and amount is >0
  if(amount > 0 && 
    receiverAcc && 
    currentAccount.balance >= amount && 
    receiverAcc?.username !== currentAccount.username){

    //doing the transfer    
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    //adding transer date
    currentAccount.movementsDates.push(new Date());
    receiverAcc.movementsDates.push(new Date());

    //Update UI
    updateUI(currentAccount);

    //reset the timer
    clearInterval(timer);
    timer=startLogoutTimer();

  }
});

//loan
btnLoan.addEventListener('click',function(e){
  e.preventDefault();

  const amount=Math.floor(inputLoanAmount.value);

  if(amount>0 && currentAccount.movements.some(mov => mov>=amount*0.1)){
    setTimeout(function(){//add movement
    currentAccount.movements.push(amount);

    //add loan date
    currentAccount.movementsDates.push(new Date().toISOString());

    updateUI(currentAccount);
  },2500);
}
  inputLoanAmount.value='';

  //reset the timer
  clearInterval(timer);
  timer=startLogoutTimer();
})

//close account 
btnClose.addEventListener('click',function(e){
  e.preventDefault();
  
  //checking credentials
  if(inputCloseUsername.value===currentAccount.username && Number(inputClosePin.value)===currentAccount.pin){
    const index=accounts.findIndex(function(acc){
      return acc.username===currentAccount.username;
    });

    //deleting object(account)
    accounts.splice(index,1);

    //Hide UI
    containerApp.style.opacity=0;
  }
  inputClosePin.value=inputCloseUsername.value='';
});

let sorted=false;
btnSort.addEventListener('click',function(e){
  e.preventDefault();
  displayMovements(currentAccount ,!sorted); 
  sorted=!sorted;   //if we click on sort again it will bring array back to nrml
})

/////////////////////////////////////////////////

