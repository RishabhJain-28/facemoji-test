import {
  CameraWrapper,
  FaceTracker,
  FaceTrackerResultSerializer,
  TrackerResultAvatarController,
  FaceTrackerResultDeserializer,
  Avatar,
} from "@0xalter/alter-core";

/**
 * Avatar animation controller based on bundled helper controller
 * Receives custom browser events with serialization format and subsequent serialized tracking data
 * and animates the avatar based on deserialized results
 */
export class DeserializationAvatarController extends TrackerResultAvatarController {
  private deserializer: FaceTrackerResultDeserializer | undefined;

  constructor(avatar: Avatar) {
    super(avatar);

    const initListener = (
      eventKey: string,
      onEvent: (e: CustomEvent) => void
    ) =>
      window.addEventListener(eventKey, ((e: CustomEvent) =>
        onEvent(e)) as EventListener);

    // Instantiate deserializer with serialization format when received
    initListener(
      "serializationFormat",
      (e) =>
        (this.deserializer = FaceTrackerResultDeserializer.create(e.detail))
    );
    // Use TrackerResultAvatarController base class method update() to animate the avatar based on received tracking data
    initListener("serializedData", (e) =>
      this.update(this.deserializer?.deserialize(e.detail).trackerResult)
    );
  }
}
