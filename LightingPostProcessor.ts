import { Sprite, ScreenShader } from "excalibur";
import { Occluder, PointLight, AmbientLight } from "./LightingActors";
import { shader } from "./LightingShader";

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
    this._shader = new ScreenShader(gl, shader);
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
      for (let i = 0; i < this._numPointLights; i++) {
        pointLightPositions.push(this.pointLights[i].globalPos.x);
        pointLightPositions.push(this.pointLights[i].globalPos.y);
        pointLightColors.push(this.pointLights[i].color.r);
        pointLightColors.push(this.pointLights[i].color.g);
        pointLightColors.push(this.pointLights[i].color.b);
        pointLightIntensities.push(this.pointLights[i].PLintensity);
        pointLightFalloffs.push(this.pointLights[i].PLfalloff);
      }
      myShader.trySetUniformInt("uPointLightCount", this._numPointLights);
      myShader.trySetUniformFloatArray("uPointLightPositions", pointLightPositions);
      myShader.trySetUniformFloatArray("uPointLightColors", pointLightColors);
      myShader.trySetUniformFloatArray("uPointLightIntensities", pointLightIntensities);

      //Ambient Light Uniforms
      let ambientLightPositions: number[] = [];
      let ambientLightColors: number[] = [];
      let ambientLightIntensities: number[] = [];
      for (let i = 0; i < this._numAmbients; i++) {
        ambientLightPositions.push(this.ambientLights[i].globalPos.x);
        ambientLightPositions.push(this.ambientLights[i].globalPos.y);
        ambientLightColors.push(this.ambientLights[i].color.r);
        ambientLightColors.push(this.ambientLights[i].color.g);
        ambientLightColors.push(this.ambientLights[i].color.b);
        ambientLightIntensities.push(this.ambientLights[i].ALintensity);
      }
      myShader.trySetUniformInt("uAmbientLightCount", this._numAmbients);
      myShader.trySetUniformFloatArray("uAmbientLightPositions", ambientLightPositions);
      myShader.trySetUniformFloatArray("uAmbientLightColors", ambientLightColors);
      myShader.trySetUniformFloatArray("uAmbientLightIntensities", ambientLightIntensities);

      // Occlusion Shader Uniforms
      let occluderPositions: number[] = [];
      let occluderSizes: number[] = [];
      let occluderAngles: number[] = [];
      let occluderTextureAssignments: number[] = [];

      for (let i = 0; i < this._numOccluders; i++) {
        occluderPositions.push(this.occluders[i].globalPos.x);
        occluderPositions.push(this.occluders[i].globalPos.y);
        occluderSizes.push(this.occluders[i].width);
        occluderSizes.push(this.occluders[i].height);
        occluderAngles.push(this.occluders[i].rotation);
        occluderTextureAssignments.push(this.occluders[i].imageIndex);
      }
      myShader.trySetUniformInt("uOccluderCount", this._numOccluders);
      myShader.trySetUniformFloatArray("uOccluderPositions", occluderPositions);
      myShader.trySetUniformFloatArray("uOccluderSizes", occluderSizes);
      myShader.trySetUniformIntArray("uMyOcclusionTextureAssignments", occluderTextureAssignments);

      for (let i = 0; i < this.occlusionMasks.length; i++) {
        let myTexture = this.gctx.textureLoader.load(this.occlusionMasks[i].image.image);
        myShader.setTexture(i + 1, myTexture as WebGLTexture);
      }
    }
  }
}
