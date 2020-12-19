/*
 * @Author: muyin
 * @Date: 2020-12-19 09:44:46
 * @email: muyin.ph@alibaba-inc.com
 */
export const VERTEX_SHADER = `
    // gl窗口大小.
    uniform vec2 u_windowSize;

    // 纹理大小.
    uniform vec2 u_textureSize;

    attribute vec3 a_position;
    attribute vec2 a_size;
    attribute vec2 a_texCoord;

    varying vec2 v_texCoord;
    varying vec2 v_size;

    void main() {
        
        v_size = a_size/u_windowSize;
        vec2 position = vec2(a_position.x, a_position.y);

        if(a_position.z <= 1.0){
            // 第1个点
            gl_Position = vec4((position/u_windowSize *2.0 -1.0) * vec2(1, -1), 1,1);
            v_texCoord = a_texCoord/vec2(1024.0, 1024.0);
            return;
        } 
        if( a_position.z <= 2.0  ){
            // 第二个点
            gl_Position = vec4(( (position + vec2(a_size.x*2.0,0))/u_windowSize *2.0 -1.0) * vec2(1, -1), 1,1);
            v_texCoord = (a_texCoord + vec2(a_size.x*2.0,0))/vec2(1024.0, 1024.0);
            return;
        }
        if( a_position.z <= 3.0  ){
            // 第3个点
            gl_Position = vec4(( (position + vec2(0, a_size.y*2.0))/u_windowSize *2.0 -1.0) * vec2(1, -1), 1,1);
            v_texCoord = (a_texCoord + vec2(0, a_size.y*2.0))/vec2(1024.0, 1024.0);
            return;
        }
        gl_Position = vec4((position/u_windowSize *2.0 -1.0) * vec2(1, -1), 1,1);
    }
`

export const FRAGMENT_SHADER =`
    precision highp float;

    uniform sampler2D u_image;

    varying vec2 v_texCoord;

    varying vec2 v_size;

    // gl_FragCoord

    void main(){
      // gl_PointCoord
        gl_FragColor = texture2D(u_image, v_texCoord);
        // gl_FragColor = vec4(v_texCoord.x *3.0,0, 0,1);
    }
`