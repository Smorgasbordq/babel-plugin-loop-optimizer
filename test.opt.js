let _r;

if ("checkMe") {
  let _L = arTest.length;
  _r = new Array(_L);

  for (let index = 0; index < _L; index++) {
    let item = arTest[index];
    _r[index] = console.log("item: " + item);
  }
}

// TODOs:
// √ (kinda) conditional/logical fastPath? test/consequent or 
// √ return x -> arr[i]=x; continue;
// √ returns, if needed, label loop and continue from that
// √ optimize conditionals into maps, to alter path upwards?
// √ new Array() and arr[i] instead of [] and .push()
// √ fix block statement, probably need to end up at Program or something
// x migrate to faster.js
var arTest = [];
"checkMe" && _r;

var aFun = null || function () {
  let _r5;

  let _r4;

  let ar = [1, 2, 3];
  var t;
  let _L2 = ar.length;

  let _r2 = new Array(_L2);

  for (let _i = 0; _i < _L2; _i++) {
    let e = ar[_i];
    _r2[_i] = e;
  }

  let _L3 = b.length;

  let _r3 = new Array(_L3);

  for (let _i2 = 0; _i2 < _L3; _i2++) {
    let x = b[_i2];
    _r3[_i2] = x;
  }

  if (!((t = "test0") && (t = "acall") || (t = "derp"))) {
    let _a = ar.prop.o;
    let _L4 = _a.length;
    _r4 = new Array(_L4);

    for (let b = 0; b < _L4; b++) {
      let a = _a[b];
      _r4[b] = b;
    }
  }

  var b = _r2,
      c = _r3;

  if (!"strFalse0" && !("strFalse1" && "str1")) {
    let _L5 = ar.length;
    _r5 = new Array(_L5);

    for (let b = 0; b < _L5; b++) {
      let a = ar[b];

      // if(1) return "broke";
      // for(let i=0; i<10; i++) return "broken for loop";
      // while(3+0<2)return "broken while loop";
      // function test(){
      //     return "hm";
      // }
      // () => { return "x"; }
      // do{ return "x" }while(false);
      if (1 === 1) {
        // ef = ar.map((item, index)=> console.log(item));
        var unused;
        _r5[b] = "BROKE";
        continue;
      } // for(let i=0; i<10; i++){
      //     return "broken for loop";
      // }
      // while(3+0<2){
      //     return "broken while loop";
      // }
      // switch(3+0){ case 2: return "LOL"; }
      // return "hm";

    }
  }

  (t = "test0") && (t = "acall") || (t = "derp") ? null : _r4; // "test1" ? ar.map((a,b)=>b) : null;
  // "testx" ?? ar.map((a,b)=>b);
  // "test2" && null || ar.map((a,b)=>b);
  // "test3" && null && ar.map((a,b)=>b);
  // "test4" || "test5" || "test6" || ar.map((a,b)=>b) || null && null;
  // "test_4x" && "derba" || "lol" && "Xx" || "tEt" && ar.map((a,b)=>b) && null || null && "ef";
  // "test5" || ar.map((a,b)=>b) || null;

  var btest = "strFalse0" ? "AMP" : "strFalse1" && "str1" || _r5;
};

{
  let _r6;

  var ar = [1, 2, 3];
  var results = [];

  if (!"test0" && !("test1" && false)) {
    let _L6 = ar.length;
    _r6 = true;

    for (let _i3 = 0; _i3 < _L6; _i3++) {
      let e = ar[_i3];

      if (!(e >= 0.05)) {
        _r6 = false;
        break;
      }
    }
  }

  var FN = () => {}; // EVERY


  "test0" ? true : {
    b: "test1" && false || {
      a: _r6
    }
  }; //FILTER
  // ar.filter((e, i) => false );

  let _L7 = ar.length;

  let _r7;

  for (let i = 0; i < _L7; i++) {}

  let _L8 = ar.length;
  let _r8 = [];

  for (let i = 0; i < _L8; i++) {
    let e = ar[i];
    if (i % 2 === 0) _r8.push(e);
  }

  let _L9 = ar.length;

  for (let i = 0; i < _L9; i++) {
    let e = ar[i];
    results.push({
      e,
      i
    });
  }

  let _L10 = ar.length;

  let _r9 = new Array(_L10);

  for (let i = 0; i < _L10; i++) {
    let e = ar[i];
    _r9[i] = e + i;
  }

  let _L11 = ar.length;
  let acc = 0;

  for (let i = 0; i < _L11; i++) {
    let e = ar[i];
    acc = acc + e + i;
  }

  let _L12 = ar.length;
  let acc = 0;

  for (let i = _L12; i--;) {
    let e = ar[i];
    acc = acc + e + i;
  }

  let _L13 = ar.length;
  let _r10 = false;

  for (let _i4 = 0; _i4 < _L13; _i4++) {
    let e = ar[_i4];

    if (e < 0.05) {
      _r10 = true;
      break;
    }
  }

  let _L14 = ar.length;
  let _r11 = true;

  _l: for (let _i5 = 0; _i5 < _L14; _i5++) {
    let e = ar[_i5];

    switch (e) {
      case 2:
        _r11 = false;
        break _l;

      case 1:
        continue;
    }

    if (!(e > 1)) {
      _r11 = false;
      break;
    }
  }

  let _L15 = ar.length;
  let _r12 = [];

  for (let _i6 = 0; _i6 < _L15; _i6++) {
    let e = ar[_i6];

    switch (e) {
      case 2:
        continue;

      case 1:
        _r12.push(e);

        continue;
    }

    if (e > 1) _r12.push(e);
  }

  let _L16 = ar.length;

  let _r13;

  _l2: for (let _i7 = 0; _i7 < _L16; _i7++) {
    let e = ar[_i7];

    switch (e) {
      case 2:
        continue;

      case 1:
        _r13 = e;
        break _l2;
    }

    if (e > 1) {
      _r13 = e;
      break;
    }
  }
}
{
  console.log("nothing");
  let ar = [1, 2, 3]; // nothing

  let _L17 = ar.length;

  let _r14 = new Array(_L17);

  for (let _i8 = 0; _i8 < _L17; _i8++) {
    let a = ar[_i8];
    _r14[_i8] = console.log(a);
  }
}
{
  var ar = [1, 2, 3]; // var result1 = ar.map((x)=>x+1).reduceRight((acc, item, index)=>acc + item + index, 10);

  if (0) {
    let _L18 = ar.length;

    let _r15 = new Array(_L18);

    for (let myi = 0; myi < _L18; myi++) {
      let x = ar[myi];
      _r15[myi] = x + 1;
    }
  }

  for (let i = 0; i < 1; i++) {
    let _L19 = ar.length;

    let _r16 = new Array(_L19);

    for (let myi2 = 0; myi2 < _L19; myi2++) {
      let y = ar[myi2];
      _r16[myi2] = y + 1;
    }
  }

  while (0 > 1) {
    let _L20 = ar.length;

    let _r17 = new Array(_L20);

    for (let myi3 = 0; myi3 < _L20; myi3++) {
      let y = ar[myi3];
      _r17[myi3] = y + 2;
    }
  }

  const fn = () => {
    let _L21 = ar.length;

    let _r18 = new Array(_L21);

    for (let myi4 = 0; myi4 < _L21; myi4++) {
      let z = ar[myi4];
      _r18[myi4] = z + 3;
    }

    return _r18;
  };

  let _L22 = ar.length;
  let _r19 = false;

  for (let index = 0; index < _L22; index++) {
    let item = ar[index];

    if (item === 2) {
      _r19 = true;
      break;
    }
  }

  var result2 = _r19;
}
