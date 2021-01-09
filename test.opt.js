var arTest = [];

let _r;

if ("checkMe") {
  let _L = arTest.length;
  _r = new Array(_L);

  for (let index = 0; index < _L; index++) {
    let item = arTest[index];
    _r[index] = console.log("item: " + item);
  }
}

"checkMe" && _r;

var aFun = null || function () {
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

  var b = _r2,
      c = _r3;

  let _r4;

  if (!((t = "test0") && (t = "acall") || (t = "derp"))) {
    let _a = ar.prop.o;
    let _L4 = _a.length;
    _r4 = new Array(_L4);

    for (let b = 0; b < _L4; b++) {
      let a = _a[b];
      _r4[b] = b;
    }
  }

  (t = "test0") && (t = "acall") || (t = "derp") ? null : _r4; // "test1" ? ar.map((a,b)=>b) : null;
  // "testx" ?? ar.map((a,b)=>b);
  // "test2" && null || ar.map((a,b)=>b);
  // "test3" && null && ar.map((a,b)=>b);
  // "test4" || "test5" || "test6" || ar.map((a,b)=>b) || null && null;
  // "test_4x" && "derba" || "lol" && "Xx" || "tEt" && ar.map((a,b)=>b) && null || null && "ef";
  // "test5" || ar.map((a,b)=>b) || null;

  let _r5;

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

  var btest = "strFalse0" ? "AMP" : "strFalse1" && "str1" || _r5;
};

{
  var ar = [1, 2, 3];
  var results = [];

  var FN = () => {}; // EVERY


  let _r6;

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

  "test0" ? true : {
    b: "test1" && false || {
      a: _r6
    }
  }; //FILTER

  function doFilter(x) {
    return !!x;
  }

  let _L7 = ar.length;
  let _r7 = [];

  for (let _i4 = 0; _i4 < _L7; _i4++) {
    let _n = ar[_i4];
    if (
    /* doFilter */
    doFilter(_n, _i4, ar)) _r7.push(_n);
  }

  let _L8 = ar.length;

  let _r8;

  for (let i = 0; i < _L8; i++) {
    let e = ar[i];
    _r8 = e;
    break;
  }

  let _L9 = ar.length;
  let _r9 = [];

  for (let i = 0; i < _L9; i++) {
    let e = ar[i];
    if (i % 2 === 0) _r9.push(e);
  }

  let _L10 = ar.length;

  for (let i = 0; i < _L10; i++) {
    let e = ar[i];

    /** for each */
    results.push({
      e,
      i
    });
  }

  let _L11 = ar.length;

  for (let i = 0; i < _L11; i++) {
    let e = ar[i];

    /** for each1 */
    results.push({
      e,
      i
    });
  }

  let _L12 = ar.length;

  for (let _i5 = 0; _i5 < _L12; _i5++) {
    let listener = ar[_i5];
    listener.apply(void 0, args);
  }

  let _L13 = ar.length;

  let _r10 = new Array(_L13);

  for (let i = 0; i < _L13; i++) {
    let e = ar[i];
    _r10[i] = e + i;
  }

  let _L14 = ar.length;
  let acc = 0;

  for (let i = 0; i < _L14; i++) {
    let e = ar[i];
    acc = acc + e + i;
  }

  let _L15 = ar.length;
  let acc = 0;

  for (let i = _L15; i--;) {
    let e = ar[i];
    acc = acc + e + i;
  }

  let _L16 = ar.length;
  let _r11 = false;

  for (let _i6 = 0; _i6 < _L16; _i6++) {
    let e = ar[_i6];

    if (e < 0.05) {
      _r11 = true;
      break;
    }
  }

  let _L17 = ar.length;
  let _r12 = true;

  _l: for (let _i7 = 0; _i7 < _L17; _i7++) {
    let e = ar[_i7];

    switch (e) {
      case 2:
        _r12 = false;
        break _l;

      case 1:
        continue;
    }

    if (!(e > 1)) {
      _r12 = false;
      break;
    }
  }

  let _L18 = ar.length;
  let _r13 = [];

  for (let _i8 = 0; _i8 < _L18; _i8++) {
    let e = ar[_i8];

    switch (e) {
      case 2:
        continue;

      case 1:
        _r13.push(e);

        continue;
    }

    if (e > 1) _r13.push(e);
  }

  let _L19 = ar.length;

  let _r14;

  _l2: for (let _i9 = 0; _i9 < _L19; _i9++) {
    let e = ar[_i9];

    switch (e) {
      case 2:
        continue;

      case 1:
        _r14 = e;
        break _l2;
    }

    if (e > 1) {
      _r14 = e;
      break;
    }
  }
}
{
  console.log("nothing");
  let ar = [1, 2, 3]; // nothing

  let _L20 = ar.length;

  let _r15 = new Array(_L20);

  for (let _i10 = 0; _i10 < _L20; _i10++) {
    let a = ar[_i10];
    _r15[_i10] = console.log(a);
  }
}
{
  var ar = [1, 2, 3]; // var result1 = ar.map((x)=>x+1).reduceRight((acc, item, index)=>acc + item + index, 10);

  if (0) {
    let _L21 = ar.length;

    let _r16 = new Array(_L21);

    for (let myi = 0; myi < _L21; myi++) {
      let x = ar[myi];
      _r16[myi] = x + 1;
    }
  }

  for (let i = 0; i < 1; i++) {
    let _L22 = ar.length;

    let _r17 = new Array(_L22);

    for (let myi2 = 0; myi2 < _L22; myi2++) {
      let y = ar[myi2];
      _r17[myi2] = y + 1;
    }
  }

  while (0 > 1) {
    let _L23 = ar.length;

    let _r18 = new Array(_L23);

    for (let myi3 = 0; myi3 < _L23; myi3++) {
      let y = ar[myi3];
      _r18[myi3] = y + 2;
    }
  }

  const fn = () => {
    let _L24 = ar.length;

    let _r19 = new Array(_L24);

    for (let myi4 = 0; myi4 < _L24; myi4++) {
      let z = ar[myi4];
      _r19[myi4] = z + 3;
    }

    return _r19;
  };

  let _L25 = ar.length;
  let _r20 = false;

  for (let index = 0; index < _L25; index++) {
    let item = ar[index];

    if (item === 2) {
      _r20 = true;
      break;
    }
  }

  var result2 = _r20;
}
