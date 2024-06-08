import tap from 'tap'

import sinon from 'sinon'


import * as utilityFunctions from "../utils/helperFunctions"


///test not in array function


tap.test('tests the notInArrayFunction', (t) => {


    t.test("tests the happy path", t => {
    

        const response = utilityFunctions.notInArray(5,[1,2,9,10])
    
    
        t.same(response,[3,4,5])

        t.end()
    
    
    })


    
    t.test("tests that the array contains all elements happy path", t => {
    

        const response = utilityFunctions.notInArray(5,[1,2,3,4,5])
    
    
        t.same(response,[])

        t.end()
    
    
    })


    t.test("tests an edge case with target 0", (t) => {
        const response = utilityFunctions.notInArray(0, []);
        t.same(response, []);
        t.end();
    });


    t.test("tests an edge case with empty holedArray", (t) => {
        const response = utilityFunctions.notInArray(5, []);
        t.same(response, [1, 2, 3, 4, 5]);
        t.end();
    });



    t.test("tests an edge case with all elements in holedArray", (t) => {
        const response = utilityFunctions.notInArray(5, [1, 2, 3, 4, 5]);
        t.same(response, []);
        t.end();
    });


   t.end()

   

})


//test sortArray function

tap.test('sortArray function tests', (t) => {
    
    t.test("sorts an array of positive numbers", (t) => {
        const input = [5, 3, 8, 1, 2];
        const expected = [1, 2, 3, 5, 8];
        const result = utilityFunctions.sortArray(input);
        t.same(result, expected);
        t.end();
    });

    t.test("sorts an array with negative and positive numbers", (t) => {
        const input = [3, -1, 2, -7, 5];
        const expected = [-7, -1, 2, 3, 5];
        const result = utilityFunctions.sortArray(input);
        t.same(result, expected);
        t.end();
    });

    t.test("sorts an array with duplicate numbers", (t) => {
        const input = [4, 1, 2, 4, 3];
        const expected = [1, 2, 3, 4, 4];
        const result = utilityFunctions.sortArray(input);
        t.same(result, expected);
        t.end();
    });

    t.test("handles an empty array", (t) => {
        const input : Array<number> = [];
        const expected : number[] = [];
        const result = utilityFunctions.sortArray(input);
        t.same(result, expected);
        t.end();
    });

    t.test("handles an array with one element", (t) => {
        const input = [42];
        const expected = [42];
        const result = utilityFunctions.sortArray(input);
        t.same(result, expected);
        t.end();
    });

    t.end(); // End the outer wrapper test
});



//test ramdomize index function

tap.test('randomizeIndex function tests', (t) => {

    t.test('returns a number within the expected range', (t) => {
        const length = 10;
        const result = utilityFunctions.randomizeIndex(length);
        t.ok(result >= 0 && result < length, 'result should be within the range of 0 to length-1');
        t.end();
    });

    t.test('returns 0 when length is 1', (t) => {
        const length = 1;
        const result = utilityFunctions.randomizeIndex(length);
        t.equal(result, 0, 'result should be 0 when length is 1');
        t.end();
    });

    t.test('returns NaN when length is 0', (t) => {
        const length = 0;
        const result = utilityFunctions.randomizeIndex(length);
        t.ok(!Number.isNaN(result), 'result should not be NaN when length is 0');
        t.end();
    });

    t.test('returns consistent results with stubbed Math.random', (t) => {
        const length = 10;

        const randomStub = sinon.stub(Math, 'random');

        randomStub.returns(0.1);
        t.equal(utilityFunctions.randomizeIndex(length), 1, 'result should be 1 when Math.random returns 0.1');

        randomStub.returns(0.5);
        t.equal(utilityFunctions.randomizeIndex(length), 5, 'result should be 5 when Math.random returns 0.5');

        randomStub.returns(0.99);
        t.equal(utilityFunctions.randomizeIndex(length), 9, 'result should be 9 when Math.random returns 0.99');

        randomStub.restore();
        t.end();
    });

    t.end(); // End the outer wrapper test
});
