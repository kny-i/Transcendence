import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { FriendReq } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  /**
   * @param userId 探索したいユーザのID
   * @returns userIdに関連付けられたUserデータ
   */
  async getUserById(userId: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
  }

  /**
   * @param userData フレンド申請したUserId
   * @param friendId フレンド申請先のフレンドID
   * @returns フレンド申請したUserデータ
   */
  async addFriend(userId: string, friendId: string): Promise<User> {
    // const user = await this.getUserById(userId);
    // const friend = await this.getUserById(friendId);

    this.prisma.user.update({
      where: {
        id: friendId,
      },
      data: {
        friends: {
          connect: {
            id: userId,
          },
        },
      },
    });

    const ret = this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        friends: {
          connect: {
            id: friendId,
          },
        },
      },
    });
    return ret;
  }

  /**
   * @param userId 取得したフレンドリストのuserId
   * @returns userIdのユーザのフレンドリスト
   */
  async getFriend(userId: string): Promise<User[]> {
    const friends: User[] = [];

    const followings = await this.prisma.user
      .findUnique({
        where: {
          id: userId,
        },
      })
      .friends();

    const followers = await this.prisma.user
      .findUnique({ where: { id: userId } })
      .friendRelation();

    followings.forEach((following: User) => {
      const friend = followers.find((follower) => follower.id === following.id);
      if (friend !== undefined) friends.push(friend);
    });
    return friends;
  }

  /**
   * @description nameを含むfriendsを検索して返す
   */
  async searchFriend(userId: string, name: string): Promise<User[]> {
    const userFriends = await this.getFriend(userId);

    const result: User[] = userFriends.filter((friend) =>
      friend.name.includes(name),
    );

    return result;
  }
  /**
   * @description User tableに対して、imageをsetできるようにする
   * @param userId imageをsetしたいUserのID
   * @param image setしたいimageのURL
   * @return setしたUserのデータ
   */
  async addUserImage(userId: string, image: string) {
    return this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        image: image,
      },
    });
  }

  /**
   * @description Userのimageを取得する
   */
  async getUserImage(userId: string): Promise<string> {
    const user = await this.getUserById(userId);
    return user.image;
  }

  /**
   * @description Friend 申請のhandler requesterの名前をdatebaseに格納
   * @param req requestのオブジェクト
   * @return setしたrequesteeのデータ
   */
  async handleFriendReq(req: FriendReq): Promise<string[] | null> {
    const requestee = await this.prisma.user.findUnique({
      where: {
        name: req.requestee,
      },
    });
    if (!requestee) {
      return null;
    }
    const reqesters = requestee.friendReqs.filter(
      (item: string) => item !== req.requester,
    );
    if (req.requester) {
      reqesters.push(req.requester);
    }
    const updatedUser = this.prisma.user.update({
      where: {
        name: req.requestee,
      },
      data: {
        friendReqs: reqesters,
      },
    });
    updatedUser.then((user: User) => {
      return user.friendReqs;
    });
  }

  async getFriendReqs(name: string): Promise<User> {
    const req = this.prisma.user.findUnique({
      where: {
        name: name,
      },
    });
    if (!req) {
      return null;
    }
    return req;
  }

  async acceptFriendreq(userid: string, friendId: string): Promise<User> {
    let oldfriendReqs: string[];
    const useridString = JSON.stringify(userid);
    const friendString = JSON.stringify(friendId);
    const tmpuser = JSON.parse(useridString);
    const tmpfriend = JSON.parse(friendString);
    this.addFriend(tmpuser, tmpfriend);
    this.addFriend(tmpfriend, tmpuser);
    const user = this.prisma.user.findUnique({
      where: {
        id: userid,
      },
    });
    if (!user) {
      return null;
    }
    user.then((userDto: User) => {
      oldfriendReqs = userDto.friendReqs;
      const filteredArr: string[] = oldfriendReqs.filter(
        (item: string) => item !== friendId,
      );
      return this.prisma.user.update({
        where: {
          id: userid,
        },
        data: {
          friendReqs: filteredArr,
        },
      });
    });
  }
}
