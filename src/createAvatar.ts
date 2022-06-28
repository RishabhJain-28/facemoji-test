import {
  Avatar,
  avatarDataUrlFromKey,
  AvatarFactory,
  AvatarMatrix,
  AvatarView,
  Col,
  FPS,
  Future,
  PeriodicExecutor,
  Try,
} from "@0xalter/alter-core";

class NewAvatar {
  private fps = new FPS(1.0);
  // private fpsCounterRef : React.RefObject<HTMLHeadingElement>
  constructor() {
    // fpsCounterRef =
  }
  createAvatar(
    canvas: HTMLCanvasElement,
    index: number
  ): [Future<Try<Avatar>>, AvatarView, AvatarFactory] {
    let avatarPresets: Array<AvatarMatrix> = [];
    let avatar: Avatar | undefined;

    let presetsSwapExecutor: PeriodicExecutor;
    let presetIndex = 0;
    const avatarFactory = AvatarFactory.create(
      avatarDataUrlFromKey(
        "d6qxwuvtmhvzt7muh5p42gjudmsgdrorkqt3uogqo36cuo3mzo3ii6q"
      ),
      canvas
    ).orThrow;

    // Create factory for downloading and creating avatars. Do not forget to get your avatar data key at https://studio.alter.xyz
    // You might want to handle errors more gracefully in your app. We just fail with an error here, as this demo makes little sense without avatars!

    // Wrap a HTML canvas with an AvatarView that handles all avatar rendering and interaction
    const avatarView = new AvatarView(canvas);

    avatarView.setOnFrameListener(() => {
      if (index === 0) {
        const messageElement = window.document.getElementById(
          "fpsMessage"
        ) as HTMLElement;

        this.fps.tick((n) => {
          messageElement.innerHTML = `FPS: ${Math.ceil(n)}`;
        });
      }
      if (
        canvas.clientWidth !== canvas.width ||
        canvas.clientHeight !== canvas.height
      ) {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
      }
    });

    // Create first avatar. Note that loading avatars can take some time (network requests etc.) so we get an asynchronous Future object
    // that resolves when the avatar is ready to display.
    const avatarFuture = avatarFactory.createAvatarFromFile(
      "avatar.json",
      avatarFactory?.bundledFileSystem
    ); // uncomment to load the Avatar matrix from app assets
    avatarFuture?.then(
      (createdAvatar) => {
        avatar = createdAvatar ?? undefined;
        avatar?.setBackgroundColor(Col.TRANSPARENT);
        avatarView.avatar = avatar;

        if (index === 0) {
          const spinner = document.getElementById("spinner");
          if (spinner) {
            spinner.style.display = "none";
          }
        }
      },
      (error) => console.error(`Failed to create avatar, ${error}`)
    );

    return [avatarFuture, avatarView, avatarFactory];
  }
}

export default new NewAvatar();
