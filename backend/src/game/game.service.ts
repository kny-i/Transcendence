import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Game } from '@prisma/client';

let playerId = 0;
let tmpGame: Game;

@Injectable()
export class GameService {
  constructor(private prisma: PrismaService) {}
  async handleAssignPlayerReq(
    assignPlayerReqDto: string,
  ): Promise<Game | null> {
    playerId += 1;
    console.log('before', assignPlayerReqDto);
    const jsonString = JSON.stringify(assignPlayerReqDto);
    console.log('middle, jsonString', jsonString);
    const tmp = JSON.parse(jsonString);
    const playerName = tmp.playerName;
    console.log('after', playerName);
    if (playerId % 2 != 0) {
      const game = this.prisma.game.create({
        data: {
          player1: playerName,
          player2: '',
        },
      });
      // ここの処理は改善できそう
      tmpGame = await game;
      return game;
    } else {
      return this.prisma.game.update({
        where: {
          id: tmpGame.id,
        },
        data: {
          player2: playerName,
        },
      });
    }
  }
}
