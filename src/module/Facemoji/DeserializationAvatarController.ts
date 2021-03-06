import {
  TrackerResultAvatarController,
  FaceTrackerResultDeserializer,
  Avatar,
  FaceTrackerResultSerializer,
} from "@0xalter/alter-core";

class DeserializationAvatarController extends TrackerResultAvatarController {
  private deserializer: FaceTrackerResultDeserializer | undefined;
  private index: number; //!remove ?
  constructor(avatar: Avatar, _index: number) {
    super(avatar);
    this.index = _index;
    this.deserializer = FaceTrackerResultDeserializer.create(
      FaceTrackerResultSerializer.create().serializationFormat
    );
    const initListener = (
      eventKey: string,
      onEvent: (e: CustomEvent) => void
    ) =>
      window.addEventListener(eventKey, ((e: CustomEvent) =>
        onEvent(e)) as EventListener);

    // initListener("serializationFormat", (e) => {
    // //     console.log("setting", this.index, e.detail);
    //   return (this.deserializer = FaceTrackerResultDeserializer.create(
    //     e.detail
    //   ));
    // });
    initListener("serializedData", (e) => {
      const a = this.deserializer?.deserialize(e.detail).trackerResult;
      return this.update(a);
    });
  }
  //!   public setSerailForamt(foramt: any) {
  //     this.deserializer = FaceTrackerResultDeserializer.create(foramt.detail);
  //   }

  //   public updateVal(data: any) {
  //     this.deserializer?.deserialize(data).trackerResult;
  //     // if (_trackResult) this.update(_trackResult)
  //   }
}

export default DeserializationAvatarController;
