
interface GLCanvasElement extends HTMLCanvasElement {
    loseContextInNCalls(nCalls: number): void;
    setRestoreTimeout(timeout: number): void;
}

/**
 * Use as >>> import WebGLDebugUtil from "webgl-debug";
 * @see https://www.khronos.org/webgl/wiki/Debugging
 * @see https://www.khronos.org/webgl/wiki/HandlingContextLost
 */
namespace WebGLDebugUtils {
    function makeDebugContext(gl: WebGL2RenderingContext | null, ...args: any): WebGL2RenderingContext | undefined;
    function glFunctionArgsToString(name: any, args: any): void;
    function makeLostContextSimulatingCanvas(canvas: HTMLCanvasElement): GLCanvasElement;
    function glEnumToString(value: number): string;
}

export default WebGLDebugUtils;
