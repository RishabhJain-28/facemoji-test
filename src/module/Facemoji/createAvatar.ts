import {
  Avatar,
  avatarDataUrlFromKey,
  AvatarFactory,
  AvatarView,
  Col,
  FPS,
  Future,
  Try,
} from "@0xalter/alter-core";

class NewAvatar {
  private fps = new FPS(1.0);
  constructor() {}
  createAvatar(
    canvas: HTMLCanvasElement,
    index: number
  ): [Future<Try<Avatar>>, AvatarView, AvatarFactory] {
    let avatar: Avatar | undefined;

    const avatarFactory = AvatarFactory.create(
      avatarDataUrlFromKey(
        "d6qxwuvtmhvzt7muh5p42gjudmsgdrorkqt3uogqo36cuo3mzo3ii6q"
      ),
      canvas
    ).orThrow;

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

    const avatarFuture = avatarFactory.createAvatarFromFile(
      "avatar.json",
      avatarFactory?.bundledFileSystem
    ); //! uncomment to load the Avatar matrix from app assets
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
