console.log('Properties....');

class A {
  print() { console.log('toto') };
}

let a = new A();

for(let i in a) {
  console.log(i);
}
