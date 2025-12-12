let randomNum = Math.floor(Math.random() * 10) + 1;
console.log("Random Number:", randomNum);

function Check() {
  const guess = Number(document.getElementById("guess").value);

  if (!guess) {
    document.getElementById("result").innerText = "Please Enter a Number!";
    return;
  }

  if (guess > randomNum) {
    document.getElementById(
      "result"
    ).innerHTML = `<i class="bi bi-emoji-surprise-fill"></i> OOPS! SORRY!!! TRY A SMALLER NUMBER.`;
  } else if (guess < randomNum) {
    document.getElementById(
      "result"
    ).innerHTML = `<i class="bi bi-emoji-surprise-fill"></i> OOPS! SORRY!!! TRY A LARGER NUMBER.`;
  } else {
    document.getElementById(
      "result"
    ).innerHTML = `<i class="bi bi-emoji-laughing-fill"></i> CONGRATULATIONS!!! YOU GUESSED IT RIGHT!`;
  }
}
