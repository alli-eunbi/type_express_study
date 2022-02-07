const makeRamen = () => {
  setTimeout(() => {
    console.log("라면 끓이기");
  }, 3000);
};

const eatRamen = (resolve, reject) => {
  setTimeout(() => {
    console.log("라면 다 먹기");
  }, 3000);
};
makeRamen();
eatRamen();
