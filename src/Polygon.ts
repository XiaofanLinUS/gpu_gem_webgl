
let init_polygon=() => {
    let positions = [
        // first face
        0.5, 1, 0.5,
        -0.5, 0, -0.5,
        0.5, 0, 0.5,
        -0.5, 1, -0.5,

        // second face
        0.5, 1, -0.5,
        -0.5, 0, 0.5,
        0.5, 0, -0.5,
        -0.5, 1, 0.5,
        //third face
        0.5, 1, 0,
        -0.5, 0, 0,
        0.5, 0, 0,
        -0.5, 1, 0
    ];
    let indices = [0, 1, 2, 0, 3, 1, 4, 5, 6, 4, 7, 5, 8, 9, 10, 8, 11, 9];


    return {positions, indices};

 }

 export {init_polygon};