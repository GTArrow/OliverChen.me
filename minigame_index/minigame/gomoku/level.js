const levels =[
    //level1
    [  [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
[null, null, null, null, null, null, null, null,  'O', null, null, null, null, null, null, null],
[null, null, null, null, null, null, null, null,  'X',  'O', null, null, null, null, null, null],
[null, null, null, null, null,  'O',  'X',  'X',  'X', null, null, null, null, null, null, null],
[null, null, null, null, null, null,  'O',  'X',  'X',  'O', null, null, null, null, null, null],
[null, null, null, null, null,  'O',  'X', null, null, null, null, null, null, null, null, null],
[null, null, null, null, null, null, null, null,  'O', null, null, null, null, null, null, null],
[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
],
//level2
[  [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
   [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
   [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
   [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
   [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
   [null, null, null, null, null, null, null, null,  null,  'X',  'O', null, null, null, null, null],
   [null, null, null, null, null, null, null, null,  'O', null,  null, null, null, null, null, null],
   [null, null, null, null, null, null, null,  'X',  'X',  'X',  'O', null, null, null, null, null],
   [null, null, null, null, null, null,  'O',  'O',  'X', null, null, null, null, null, null, null],
   [null, null, null, null, null,  'O',  'X',  'X', null,  'O', null, null, null, null, null, null],
   [null, null, null, null, null, null,  'O',  'O', null, null, null, null, null, null, null, null],
   [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
   [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
   [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
   [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
   [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
 ],

 //level3
 [  [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
 [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
 [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
 [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
 [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
 [null, null, null, null, null, null,  'O', null, null, null, null, null, null, null, null, null],
 [null, null, null, null, null, null, null,  'O', null, null, null, null, null, null, null, null],
 [null, null, null, null, null,  'O',  'O',  'X',  'X', null, null, null, null, null, null, null],
 [null, null, null, null, null, null, null,  'O',  null, null, null, null, null, null, null, null],
 [null, null, null, null, null, null,  'X',  'X',  'O',  'X', null, null, null, null, null, null],
 [null, null, null, null, null, null, null, null, null,  'X', null, null, null, null, null, null],
 [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
 [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
 [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
 [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
 [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
]
,
 //level4
 [  [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
 [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
 [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
 [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
 [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
 [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
 [null, null, null, null, null, null,  'X', null, null,  'O', null, null, null, null, null, null],
 [null, null, null, null, null, null, null,  'O',  'X', null, null, null, null, null, null, null],
 [null, null, null, null, null, null,  'O',  'X',  'O', null, null, null, null, null, null, null],
 [null, null, null, null, null, null,  'X',  'X',  'O',  'O', null, null, null, null, null, null],
 [null, null, null, null, null,  'X', null, null, null, null, null, null, null, null, null, null],
 [null, null, null, null,  'O', null, null, null, null, null, null, null, null, null, null, null],
 [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
 [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
 [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
 [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
 ],
  //level5
[  [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
[null, null, null, null, null, null, null, null,  'O', null, null, null, null, null, null, null],
[null, null, null, null, null, null,  'O',  'X',  'X', null, null, null, null, null, null, null],
[null, null, null, null, null, null,  'O',  'O',  'X', null, null, null, null, null, null, null],
[null, null, null, null, null,  'O',  'X',  'X',  'X',  'O', null, null, null, null, null, null],
[null, null, null, null, null, null,  'O', null, null, null, null, null, null, null, null, null],
[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
]

]