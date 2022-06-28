import {
  Future,
  Try,
  Avatar,
  AvatarView,
  AvatarFactory,
} from "@0xalter/alter-core";

const AvatarMap: Map<
  number,
  {
    avatarFuture: Future<Try<Avatar>>;
    avatarView: AvatarView;
    avatarFactory: AvatarFactory;
    avatarPromise: Promise<{ avatar: Avatar; index: number }>;
    avatar: Avatar | null;
  }
> = new Map();

export default AvatarMap;
export const SAMPLES = 3; //! remove
