function bt(char) {
  if (char === "=") {
    try {
      document.getElementById("display").value = eval(
        document.getElementById("display").value
      );
    } catch (error) {
      alert("Invalid Expression");
      document.getElementById("display").value = " ";
    }
  } else if (char === "clear") {
    document.getElementById("display").value = " ";
  } else {
    document.getElementById("display").value =
      document.getElementById("display").value + char;
  }
}

document.addEventListener("keydown", (abc) => {
  console.log(abc.key);

  if (abc.key === "Enter") {
    bt("=");
  } else if (
    abc.key === "1" ||
    abc.key === "2" ||
    abc.key === "3" ||
    abc.key === "4" ||
    abc.key === "5" ||
    abc.key === "6" ||
    abc.key === "7" ||
    abc.key === "8" ||
    abc.key === "9" ||
    abc.key === "10" ||
    abc.key === "+" ||
    abc.key === "-" ||
    abc.key === "*" ||
    abc.key === "/"
  ) {
    bt(abc.key);
  } else if (abc.key === "Backspace") {
    bt("clear");
  }
});
