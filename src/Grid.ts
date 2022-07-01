let init_grid = (num_segs: number) => {
    let inidices = [];
    let positions = [];

    if(num_segs <= 0) {
        throw new Error('Number of segments should be larger than 0');
    }
    let dh = 2 / num_segs;

    // vertices generation
    for(let a = 0; a <= num_segs; a++) {
        for (let b = 0; b <= num_segs; b++) {
            let a_ = -1 + a * dh;
            let b_ = -1 + b * dh;

            positions.push(a_);
            positions.push(0);
            positions.push(b_);

        }
    }

    // indices generation
    for (let i = 0; i <= num_segs - 1; i++) {
        for (let j = 0; j <= num_segs - 1; j++) {
            let idx0 = i * (num_segs + 1) + j;
            let idx1 = idx0 + 1;
            let idx2 = (i + 1) * (num_segs + 1) + j;

            inidices.push(idx0, idx1, idx0, idx2);
        }
    }

    { 
        let i = num_segs;
        for (let j = 0; j <= num_segs - 1; j++) {
            let idx0 = i * (num_segs + 1) + j;
            let idx1 = idx0 + 1;

            inidices.push(idx0, idx1);
        }                
    }

    {
        let j = num_segs;
        for (let i = 0; i <= num_segs - 1; i++) {
            let idx0 = i * (num_segs + 1) + j;
            let idx1 = (i + 1) * (num_segs + 1) + j;

            inidices.push(idx0, idx1);
        }                

    }
    
    return {positions, inidices};
};

export default init_grid;