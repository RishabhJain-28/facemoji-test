import {
  TrackerResultAvatarController,
  FaceTrackerResultDeserializer,
  Avatar,
} from "@0xalter/alter-core";

class DeserializationAvatarController extends TrackerResultAvatarController {
  private deserializer: FaceTrackerResultDeserializer | undefined;
  // public index:number
  private index: Number;
  constructor(avatar: Avatar, _index: Number) {
    super(avatar);
    this.index = _index;

    const initListener = (
      eventKey: string,
      onEvent: (e: CustomEvent) => void
    ) =>
      window.addEventListener(eventKey, ((e: CustomEvent) =>
        onEvent(e)) as EventListener);

    // Instantiate deserializer with serialization format when received
    initListener("serializationFormat", (e) => {
      console.log("setting", this.index, e.detail);
      return (this.deserializer = FaceTrackerResultDeserializer.create(
        e.detail
      ));
    });
    // Use TrackerResultAvatarController base class method update() to animate the avatar based on received tracking data
    initListener("serializedData", (e) => {
      const a = this.deserializer?.deserialize(e.detail).trackerResult;
      // console.log('this.index', this.index, a)
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
