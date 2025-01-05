import { System, SystemType, Query, World, TransformComponent } from "excalibur";
import { PointLightComponent, AmbientLightComponent, OccluderComponent } from "./LigthingComponents";

export class LightingSystem extends System {
  systemType: SystemType = SystemType.Update;
  plQuery: Query<typeof PointLightComponent | typeof TransformComponent>;
  alQuery: Query<typeof AmbientLightComponent | typeof TransformComponent>;
  occQuery: Query<typeof OccluderComponent | typeof TransformComponent>;

  constructor(world: World) {
    super();
    this.plQuery = world.query([PointLightComponent, TransformComponent]);
    this.alQuery = world.query([AmbientLightComponent, TransformComponent]);
    this.occQuery = world.query([OccluderComponent, TransformComponent]);
  }

  update(elapsed: number): void {}
}
