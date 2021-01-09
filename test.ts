var arTest = [];
"checkMe" && arTest.map((item, index)=>{
    console.log("item: " + item);
})
var aFun = null || function() {
    let ar = [1,2,3]
    var t;

    var b = ar.map((e)=>e), c = b.map((x)=>x);

    (t="test0") && (t="acall") || (t="derp") ? null : ar.prop.o.map((a,b)=>b);

    // "test1" ? ar.map((a,b)=>b) : null;

    // "testx" ?? ar.map((a,b)=>b);

    // "test2" && null || ar.map((a,b)=>b);

    // "test3" && null && ar.map((a,b)=>b);

    // "test4" || "test5" || "test6" || ar.map((a,b)=>b) || null && null;

    // "test_4x" && "derba" || "lol" && "Xx" || "tEt" && ar.map((a,b)=>b) && null || null && "ef";

    // "test5" || ar.map((a,b)=>b) || null;

    var btest = "strFalse0" ? "AMP" : ("strFalse1" && "str1" || ar.map(function(a, b){
        // if(1) return "broke";
        // for(let i=0; i<10; i++) return "broken for loop";
        // while(3+0<2)return "broken while loop";
        // function test(){
        //     return "hm";
        // }
        // () => { return "x"; }

        // do{ return "x" }while(false);

        if(1===1) {
            // ef = ar.map((item, index)=> console.log(item));
            var unused;
            return "BROKE";
        }
        // for(let i=0; i<10; i++){
        //     return "broken for loop";
        // }
        // while(3+0<2){
        //     return "broken while loop";
        // }
        // switch(3+0){ case 2: return "LOL"; }

        // return "hm";
    }));
}

{
    var ar = [1, 2, 3];
    var results = [];
    var FN = () => {};
    // EVERY
    "test0" ? true : {b: "test1" && false || {a: ar.every(e => e >= 0.05) }};
    //FILTER
    function doFilter(x) { return !!x; }
    ar.filter(/* doFilter */ doFilter);
    ar.find(/** find */(e, i) => true );
    ar.filter(/** filter */(e, i) => i % 2 === 0);
    //FOREACH
    ar.forEach((e, i) => { /** for each */ results.push({ e, i }); });
    ar.forEach((e, i) => /** for each1 */ results.push({ e, i }) );
    ar.forEach(function (listener) {
        return listener.apply(void 0, args);
      });
    //MAP
    ar.map((e, i) => { e + i });
    //REDUCE
    ar.reduce((acc, e, i) => acc + e + i, 0);
    //REDUCE RIGHT
    ar.reduceRight((acc, e, i) => acc + e + i, 0);
    //SOME
    ar.some(e => e < 0.05);

    ar.every((e) => {
        switch(e) {
            case 2: return false;
            case 1: return true;
        }
        return e>1;
    })
    ar.filter((e) => {
        switch(e) {
            case 2: return false;
            case 1: return true;
        }
        return e>1;
    })

    ar.find((e) => {
        switch(e) {
            case 2: return false;
            case 1: return true;
        }
        return e>1;
    })
}

{
    console.log("nothing")
    let ar = [1,2,3]
    // nothing
    ar.map((a)=>console.log(a))
}

{
    var ar = [1,2,3];
    // var result1 = ar.map((x)=>x+1).reduceRight((acc, item, index)=>acc + item + index, 10);
    if(0) ar.map((x, myi)=>x+1);
    for(let i=0;i<1;i++) ar.map((y, myi2)=>y+1)
    while(0>1) ar.map((y, myi3)=>y+2)
    const fn = () => ar.map((z, myi4)=>z+3)
    var result2 = ar.some((item, index) => item === 2);
}