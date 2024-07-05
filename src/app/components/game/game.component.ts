import { Component } from '@angular/core';

enum Player {
  None= '',
  O='O',
  X= 'X'
}
@Component({
  selector: 'app-game',
  standalone: true,
  imports: [],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})
export class GameComponent {
  cells: Player[]= new Array(9).fill(Player.None);
  currentPlayer: Player = Player.O;
  winner: Player | null = null;
  gameOver: boolean = false;
  winnerPos: number[][] = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];
  firstMove: boolean = true;
  // found = false;

  async makeMove(index: number): Promise<void> {
    if (!this.cells[index] && !this.gameOver) {
      this.cells[index] = this.currentPlayer;
      // this.currentPlayer = this.currentPlayer === Player.O ? Player.X : Player.O;
      setTimeout(() => {
        this.checkWinner();
        if (!this.gameOver) {
          this.automaticMove(index);
        }
      }, 1000);
    }
  }

  getPlayerMove(arr: string[], i: Player): number[] {
    return arr
      .map((value, index) => (value === i ? index : -1))
      .filter(index => index !== -1);
  };
  compareArrays(wins: number[], player:number[]) {
    console.log(wins.filter(item => !player.includes(item)));
    return wins.filter(item => !player.includes(item));
  };
  initialMove(index: number): void {
    let lastMove: Player = this.cells[index];
    if (index === 4) {
      const possible = [0, 2, 6, 8]
      const randomIndex = Math.floor(Math.random() * possible.length);
      const MoveIndex = possible[randomIndex];
      this.cells[MoveIndex] = this.cells[index] === Player.O ? Player.X : Player.O;
    } else {
      this.cells[4] = this.cells[index] === Player.O ? Player.X : Player.O;
    }
  }

  automaticMove(index: number): void {
    if (this.firstMove) {
      this.initialMove(index);
      this.firstMove = false;
    } else {
      this.attack(index, true);
    }
  }

  block(index: number, doBlock: boolean) {
    let lastMove: Player = this.cells[index];
    let player = this.getPlayerMove(this.cells, lastMove);
    if (!doBlock) return;
    let anotherPlayer: Player = this.cells[index] === Player.O ? Player.X : Player.O;
    let other = this.getPlayerMove(this.cells, anotherPlayer);
    let found: boolean = false;
    this.winnerPos.forEach(element => {
      if (found) return;
      let movePos = this.compareArrays(element, player);
      if (movePos.length === 1 && this.cells[movePos[0]] === Player.None) {
        this.cells[movePos[0]] = anotherPlayer;
        found = true;
      }
    });
    this.checkWinner();
    this.placeMove(index, !found);
  }

  attack(index: number, doAttack: boolean): void {
    if (!doAttack) return;
    let anotherPlayer: Player = this.cells[index] === Player.O ? Player.X : Player.O;
    let other = this.getPlayerMove(this.cells, anotherPlayer);
    let finish: boolean = false;
    this.winnerPos.forEach(element => {
      if (finish) return;
      let movePos = this.compareArrays(element, other);
      if (movePos.length === 1 && this.cells[movePos[0]] === Player.None ) {
        this.cells[movePos[0]] = anotherPlayer;
        finish = true;
      }
    });
    this.checkWinner();
    this.block(index, !finish);
  }

  placeMove(index: number, doMove: boolean) : void {
    if (!doMove) return;
    let anotherPlayer: Player = this.cells[index] === Player.O ? Player.X : Player.O;
    let other = this.getPlayerMove(this.cells, anotherPlayer);
    let finish: boolean = false;
    this.winnerPos.forEach(element => {
      if (finish) return;
      let movePos = this.compareArrays(element, other);
      if (movePos.length > 1 && this.cells[movePos[0]] === Player.None) {
        this.cells[movePos[0]] = anotherPlayer ;
        finish = true;
      } else if (movePos.length > 1 && this.cells[movePos[1]] === Player.None) {
        this.cells[movePos[1]] = anotherPlayer ;
        finish = true;
      } else if (movePos.length > 1 && this.cells[movePos[2]] === Player.None) {
        this.cells[movePos[2]] = anotherPlayer;
        finish = true;
      }
      this.checkWinner();
    });
  }

  checkWinner(): void {
    for (let [a, b, c] of this.winnerPos) {
      if (
        this.cells[a] != Player.None &&
        this.cells[a] === this.cells[b] &&
        this.cells[a] === this.cells[c]) {
          this.winner = this.cells[a];
          this.gameOver = true;
          alert("Le gagnant de cette manche est : " + this.winner);
      }
    }
  }

  reset(): void {
    this.cells.fill(Player.None);
    this.currentPlayer = Player.O;
    this.winner = null;
    this.gameOver = false;
  }
}
