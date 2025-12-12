function Submit() {
  const nm = document.getElementById("name").value.trim();
  const em = document.getElementById("email").value.trim();
  const mn = document.getElementById("mobileNo").value.trim();
  const dob = document.getElementById("date").value.trim();

  const date = {
    FullName: nm,
    Email: em,
    MobileNo: mn,
    DateOfBirth: dob,
  };
  if (!/^[A-Za-z ] + $/.test(nm)) {
    alert("Wrong Name");
    return;
  }

  if (!/^[\w\.]+@(gmail|outlook)\.(com|in) $/.test(em)) {
    alert("Wrong Email");
    return;
  }

  if (!/^[6-9]\d{9}$/.test(mobileNo)) {
  }

  const currentDate = new Date().getFullYear();
  
  const birthYear = 

  console.log(date);
}
