import { System, SystemType, Query, TransformComponent, Camera, Sprite } from "excalibur";
import { PointLightComponent, AmbientLightComponent, OccluderComponent } from "./LigthingComponents";
import { LightingPostProcessor } from "./LightingPostProcessor";
import { LightingSystemConfig } from "./LightingTypesAndDefs";
import { AmbientLight, Occluder, PointLight } from "./LightingActors";

//Maximum 50 Pt Lights, 50 Ambient Lights, 15 Occluder Masks, 50 Occluders

export class LightingSystem extends System {
  systemType: SystemType = SystemType.Update;
  plQuery: Query<typeof PointLightComponent | typeof TransformComponent>;
  alQuery: Query<typeof AmbientLightComponent | typeof TransformComponent>;
  occQuery: Query<typeof OccluderComponent | typeof TransformComponent>;
  private _pp: LightingPostProcessor;
  private _bufferSize: number;
  private _camera: Camera;
  private _occluderMasks: Array<Sprite | null> = [];

  constructor(config: LightingSystemConfig) {
    super();
    this.plQuery = config.world.query([PointLightComponent, TransformComponent]);
    this.alQuery = config.world.query([AmbientLightComponent, TransformComponent]);
    this.occQuery = config.world.query([OccluderComponent, TransformComponent]);
    this._pp = config.postProcessor;
    this._bufferSize = config.lightingBufferSize;
    this._camera = config.camera;
    this._occluderMasks.fill(null, 0, 14); // fill with nulls for the 15 texture spots
  }

  loadOccluderMask(sprite: Sprite, occluderMaskSlotIndex: number) {
    if (occluderMaskSlotIndex < 0 || occluderMaskSlotIndex > 14) throw new Error("Only 15 Occluder mask slots available");
    this._occluderMasks[occluderMaskSlotIndex] = sprite;
  }

  update(elapsed: number): void {
    let plEntities = this.plQuery.entities as PointLight[];
    let alEntities = this.alQuery.entities as AmbientLight[];
    let occEntities = this.occQuery.entities as Occluder[];
    let camPosition = this._camera.pos;

    //filter out entities that aren't visible... i.e. outside the camera view + this._buffersize
    let visiblePLs: PointLight[] = plEntities.filter((pl: PointLight) => {
      return (
        pl.globalPos.x >= camPosition.x - this._bufferSize &&
        pl.globalPos.x <= camPosition.x + this._bufferSize &&
        pl.globalPos.y >= camPosition.y - this._bufferSize &&
        pl.globalPos.y <= camPosition.y + this._bufferSize
      );
    });

    let visibleALs = alEntities.filter((al: AmbientLight) => {
      return (
        al.globalPos.x >= camPosition.x - this._bufferSize &&
        al.globalPos.x <= camPosition.x + this._bufferSize &&
        al.globalPos.y >= camPosition.y - this._bufferSize &&
        al.globalPos.y <= camPosition.y + this._bufferSize
      );
    });
    let visibleOcs = occEntities.filter((oc: Occluder) => {
      return (
        oc.globalPos.x >= camPosition.x - this._bufferSize &&
        oc.globalPos.x <= camPosition.x + this._bufferSize &&
        oc.globalPos.y >= camPosition.y - this._bufferSize &&
        oc.globalPos.y <= camPosition.y + this._bufferSize
      );
    });

    // update the postprocessor entities data

    //check for exceeding entity limits and throw Error
    if (visiblePLs.length > 50) throw new Error("Too many PointLights");
    if (visibleALs.length > 50) throw new Error("Too many AmbientLights");
    if (visibleOcs.length > 50) throw new Error("Too many Occluders");

    this._pp.numPointLights = visiblePLs.length;
    this._pp.numAmbients = visibleALs.length;
    this._pp.numOccluders = visibleOcs.length;
    this._pp.pointLights = [...visiblePLs];
    this._pp.ambientLights = [...visibleALs];
    this._pp.occluders = [...visibleOcs];
  }
}
