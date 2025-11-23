function submit() {
  //   const batch = document.querySelectorAll("input[name='batch']:checked");
  //   console.log(batch);

  let selectedBatchTiming = [];
  document
    .querySelectorAll("input[name='batch']:checked")
    .forEach((element) => {
      selectedBatchTiming.push(element.value);
    });

  console.log(selectedBatchTiming);

//   const selectedBatch = document.querySelector("input[name=timing']:checked").value;
  
//   console.log(selectedBatch)

  
}


