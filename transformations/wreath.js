var gl, program;
var modelViewStack=[];
var vertices;

function main()
{
    var canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    vertices = GeneratePoints();

    initBuffers();
    
    render();
};

function initBuffers() {

    //  Configure WebGL
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

    // Associate our shader variables with our data buffer
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    // Prepare to send the model view matrix to the vertex shader
    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
}

// Form the 4x4 scale transformation matrix
function scale4(a, b, c) {
   var result = mat4();
   result[0][0] = a;
   result[1][1] = b;
   result[2][2] = c;
   return result;
}

function GeneratePoints()
{
    var vertices=[];
    
    vertices.push(vec2(0.0, 2.0));
    vertices.push(vec2(0.1, 1.0));
    vertices.push(vec2(0.4, 1.0));
    vertices.push(vec2(0.0,4.0));
    vertices.push(vec2(-1.0, -0.3));
    vertices.push(vec2(-0.5, -0.5));
   // vertices.push(vec2(0.0, 2.0));
    
    return vertices;
}

var scaleFactor1 = 1/16;

function DrawOneBranch()
{
    var s;

    // one branch
    modelViewStack.push(modelViewMatrix);   // save the previous MVM
    s = scale4(scaleFactor1, scaleFactor1, 1);
    modelViewMatrix = mult(modelViewMatrix, s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays( gl.LINE_LOOP, 0, vertices.length);
    modelViewMatrix = modelViewStack.pop();   // undo the scaling effect
}

function DrawOneStar()
{
    var r;

    modelViewStack.push(modelViewMatrix);
    // draw the full star
    for (var i=0; i<5; i++) {

         r = rotate(70, 0, 0, 1);

        modelViewMatrix =  mult(modelViewMatrix, r);
         DrawOneBranch();
    }
    modelViewStack=modelViewStack.pop();
}

function render() {
    
    gl.clear( gl.COLOR_BUFFER_BIT );
    
    var r, s, t;
    var radius = 0.65;
    var rotationStep = Math.PI/6;
    
   // modelViewMatrix = mat4();
    //DrawOneStar();
    
    
    for (var i=0; i<12; i++)  {
         t = translate(radius * Math.cos(rotationStep*i), radius * Math.sin(rotationStep*i), 0);
         modelViewMatrix=t;
         r = rotate(28*i, 0, 0, 1);
          modelViewMatrix=mult(t, r);
         DrawOneStar();
    }
}
