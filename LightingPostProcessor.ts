import ex, { Sprite } from "excalibur";
import { Occluder, PointLight, AmbientLight } from "./LightingActors";
import shader from "./LightingShader.glsl";

export class LightingPostProcessor implements ex.PostProcessor {
  private _shader: ex.ScreenShader | undefined;
  gctx: ex.ExcaliburGraphicsContextWebGL;
  texture: WebGLTexture | null = null;

  private _numOccluders: number = 0;
  private _numPointLights: number = 0;
  private _numAmbients: number = 0;

  public occluders: Occluder[] = [];
  public pointLights: PointLight[] = [];
  public ambientLights: AmbientLight[] = [];
  public occlusionMasks: Sprite[] = [];

  constructor(public graphicsContext: ex.ExcaliburGraphicsContextWebGL) {
    this.gctx = graphicsContext;
  }

  initialize(gl: WebGL2RenderingContext): void {
    this._shader = new ex.ScreenShader(gl, shader);
  }

  getLayout(): ex.VertexLayout {
    //@ts-expect-error
    return this._shader.getLayout();
  }

  getShader(): ex.Shader {
    //@ts-expect-error
    return this._shader.getShader();
  }

  set numPointLights(num: number) {
    this._numPointLights = num;
  }

  set numAmbients(num: number) {
    this._numAmbients = num;
  }

  set numOccluders(num: number) {
    this._numOccluders = num;
  }

  onUpdate(elapsed: number): void {
    let myShader = this._shader?.getShader();
    if (myShader) {
      //Point Light Uniforms
      //create vector array for point light positions
      let pointLightPositions: number[] = [];
      let pointLightColors: number[] = [];
      let pointLightIntensities: number[] = [];
      let pointLightFalloffs: number[] = [];
      for (let i = 0; i < this.numPointLights; i++) {
        pointLightPositions.push(this.pointLights[i].position.x);
        pointLightPositions.push(this.pointLights[i].position.y);
        pointLightColors.push(this.pointLights[i].color.r);
        pointLightColors.push(this.pointLights[i].color.g);
        pointLightColors.push(this.pointLights[i].color.b);
        pointLightIntensities.push(this.pointLights[i].intensity);
        pointLightFalloffs.push(this.pointLights[i].falloff);
      }
      myShader.trySetUniformInt("uPointLightCount", this.numPointLights);
      myShader.trySetUniformFloatArray("uPointLightPositions", pointLightPositions);
      myShader.trySetUniformFloatArray("uPointLightColors", pointLightColors);
      myShader.trySetUniformFloatArray("uPointLightIntensities", pointLightIntensities);

      //Ambient Light Uniforms
      let ambientLightPositions: number[] = [];
      let ambientLightColors: number[] = [];
      let ambientLightIntensities: number[] = [];
      for (let i = 0; i < this.numAmbients; i++) {
        ambientLightPositions.push(this.ambientLights[i].position.x);
        ambientLightPositions.push(this.ambientLights[i].position.y);
        ambientLightColors.push(this.ambientLights[i].color.r);
        ambientLightColors.push(this.ambientLights[i].color.g);
        ambientLightColors.push(this.ambientLights[i].color.b);
        ambientLightIntensities.push(this.ambientLights[i].intensity);
      }
      myShader.trySetUniformInt("uAmbientLightCount", this.numAmbients);
      myShader.trySetUniformFloatArray("uAmbientLightPositions", ambientLightPositions);
      myShader.trySetUniformFloatArray("uAmbientLightColors", ambientLightColors);
      myShader.trySetUniformFloatArray("uAmbientLightIntensities", ambientLightIntensities);

      // Occlusion Shader Uniforms
      let occluderPositions: number[] = [];
      let occluderSizes: number[] = [];
      let occluderTextures: WebGLTexture[] = [];
      for (let i = 0; i < this.numOccluders; i++) {
        occluderPositions.push(this.occluders[i].position.x);
        occluderPositions.push(this.occluders[i].position.y);
        occluderSizes.push(this.occluders[i].size.x);
        occluderSizes.push(this.occluders[i].size.y);
      }
      myShader.trySetUniformInt("uOccluderCount", this.numOccluders);
      myShader.trySetUniformFloatArray("uOccluderPositions", occluderPositions);
      myShader.trySetUniformFloatArray("uOccluderSizes", occluderSizes);
      myShader.trySetUniformIntArray("uMyOcclusionTextureAssignments", 1);

      for (let i = 0; i < this.textureArray.length; i++) {
        let myTexture = this.gctx.textureLoader.load(this.textureArray[i].image.image);
        myShader.setTexture(i + 1, myTexture as WebGLTexture);
      }

      /* let myTexture = this.gctx.textureLoader.load(this.textureArray[this.frameIndex].image.image);
        myShader.setTexture(1, myTexture as WebGLTexture);
        myShader.trySetUniformFloatVector("u_texturePosition", new ex.Vector(300.0 - 32.0, 50.0 - 32.0));
        myShader.trySetUniformFloatVector("u_textureSize", new ex.Vector(64.0, 64.0));
        myShader.trySetUniformInt("u_myOcclusionTexture", 1);
  
        myShader.trySetUniformFloat("uLightIntensity", 1.0);
        myShader.trySetUniformFloatVector("uLightPosition", new ex.Vector(300.0, 50.0));
        myShader.trySetUniformFloat("uLightFalloff", 0.025); */
    }
  }
}
