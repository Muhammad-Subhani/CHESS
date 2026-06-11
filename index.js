let grid = [
  ["Br-L", "Bk-L", "Bb-L", "Bq-0", "BK-0", "Bb-R", "Bk-R", "Br-R"],
  ["Bp-0", "Bp-1", "Bp-2", "Bp-3", "Bp-4", "Bp-5", "Bp-6", "Bp-7"],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["Wp-0", "Wp-1", "Wp-2", "Wp-3", "Wp-4", "Wp-5", "Wp-6", "Wp-7"],
  ["Wr-L", "Wk-L", "Wb-L", "Wq-0", "WK-0", "Wb-R", "Wk-R", "Wr-R"],
];

// if check is not working then make sure the coordinates at the starting are rigth
let checkmate = [0];
let W_king_position = [0, "7-4", 0];
let B_king_position = [0, "0-4", 0];
let total_moves = [0];
let white_moves;
let black_moves;
let white_p_shift = false;
let black_p_shift = false;
let avail_moves_chk = [0];
let R_B_Qatchk = [0, 0];
let White_rook_position = [0, 0];
let Black_rook_position = [0, 0];
let black_pawn = [0, 1, 0, 0, 0, 0, 0, 0];
let white_pawn = [0, 0, 0, 0, 0, 0, 0, 0];
let white_turn = [0];
let msgbox = document.getElementById("Which_turn");
const boxes = document.querySelectorAll(".box");
let player_1 = document.getElementById("P1");
player_1.innerText = prompt("Enter the First Player Name !");
let player_2 = document.getElementById("P2");
player_2.innerText = prompt("Enter the Second Player Name !");
// funtion that diaplays the chess
function display() {
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      // getting the elements of array and sync with the boxes on frontend
      let image = grid[i][j].split("-")[0];
      let id = "b-" + i + "-" + j;
      let part = document.getElementById(id);

      if (image != "") {
        part.innerHTML = `<img src="./asset2/${image}.png">`;
      } else {
        part.innerHTML = "";
      }
    }
  }
}
// to display in the start

display();
// for moving the parts

let row;
let column;
let target = 0;
let castle = "";
let firstpassed = false;
// for available paths
let negative_x = 0;
let negative_y = 0;
let EnPassant = "";
// display which one you selected 
function Display_selected(i , j ) {
  let image = grid[i][j].split("-")[0];
  if (white_turn[0] == 0) {
    let box = document.getElementById("small_imgW");
    box.innerHTML = `<img src="./asset2/${image}.png">`;
  }
  if (white_turn[0] == 1) {
    let box = document.getElementById("small_imgB");
    box.innerHTML = `<img src="./asset2/${image}.png">`;
  }
}
// checking if the castling saves the king from being in check 
function Castle_save (your_key , cast_type){
  let yr_king = (your_key == "W")? W_king_position[1] : B_king_position[0];
  let i = Number(yr_king.split("-")[0]);
  let j = Number(yr_king.split("-")[1]);
  switch(cast_type){
    case "K" :
    grid[i][j+2] = grid[i][j];
    grid[i][j+1] = grid[i][j+3];
    grid[i][j] = "";
    grid[i][j+3] = "";
    if(Check(i , j+2) == false){
      avail_moves_chk[0]++;
      let box = document.getElementById("b-"+i+"-"+j);
      box.classList.add("canwork")
    }
    grid[i][j] = grid[i][j+2];
    grid[i][j+3] = grid[i][j+1];
    grid[i][j+2] = "";
    grid[i][j+1] = "";
    break;
    case "Q":
     grid[i][j-2] = grid[i][j];
    grid[i][j-1] = grid[i][j-4];
    grid[i][j]= "";
    grid[i][j-4] = "";
    if(Check(i , j-2) == false){
      avail_moves_chk[0]++;
      let box = document.getElementById("b-"+i+"-"+j);
      box.classList.add("canwork")      
    }
     grid[i][j] = grid[i][j-2];
    grid[i][j-4] = grid[i][j-1];
    grid[i][j-2]= "";
    grid[i][j-1] = "";
      break;
  }
   
}
// fucntion for the shifting of white pawn 
function WShift(i , j){
  let opt ;
  opt = prompt("1=> Queen 2=> Rook 3=> Bishop 4=> Knight");
  while(opt == undefined || opt<1 || opt > 4){
    opt = prompt("1=> Queen :: 2=> Rook :: 3=> Bishop :: 4=> Knight");
  }
  switch(opt){
    case "1" :
      grid[i][j] = "Wq-0";
      break;
    
    case "2" :
      grid[i][j] = "Wr-0";
      break;
    case "3":
      grid[i][j] = "Wb-0";
      break;
    case "4":
      grid[i][j] = "Wk-0";
      break;
  }
}
// fucntion for the shifting of Black pawn 
function BShift(i , j){
  let opt ;
  opt = prompt("1=> Queen 2=> Rook 3=> Bishop 4=> Knight");
  while(opt == undefined || opt<1 || opt > 4){
    opt = prompt("1=> Queen :: 2=> Rook :: 3=> Bishop :: 4=> Knight");
  }
  switch(opt){
    case "1" :
      grid[i][j] = "Bq-0";
      break;
    
    case "2" :
      grid[i][j] = "Br-0";
      break;
    case "3":
      grid[i][j] = "Bb-0";
      break;
    case "4":
      grid[i][j] = "Bk-0";
      break;
  }
}
// checking if the particular piece to cancel is opponents king or not
function IsKing(opp, x, y) {
  if (grid[x][y].split("-")[0] == opp + "K") {
    return 0;
  } else return 1;
}
// this function would check the checkmate
function CheckMate(your_team) {
  let king = (your_team == "W") ? W_king_position : B_king_position;
  let opponent = (your_team == "W")? "Black" :"White";
  let a = Number(king[1].split("-")[0]);
  let b = Number(king[1].split("-")[1]);
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      let box = document.getElementById("b-" + i + "-" + j);
      let piece = grid[i][j];
      let piece2 = grid[i][j].split("-")[0][1];
      if (piece.split("-")[0][0] == your_team) {
        switch (piece2) {
          case "p":
            Pawn(i, j, your_team, piece.split("-")[1], "danger");
            break;
          case "r":
            Rook(i, j, your_team, "danger");
            if (R_B_Qatchk[0] == 0) box.classList.add("unclick_Check");
            break;
          case "b":
            Bishop(i, j, your_team, "danger");
            if (R_B_Qatchk[1] == 0) box.classList.add("unclick_Check");
            break;
          case "q":
            Queen(i, j, your_team);
            if (R_B_Qatchk[0] == 0 && R_B_Qatchk[1] == 0)
              box.classList.add("unclick_Check");
            break;
          case "k":
            Knigth(i, j, your_team, "danger");
            break;
          case "K":
            King(i, j, your_team, "danger");
            // if (R_B_Qatchk[2] == 0) box.classList.add("unclick_Check");
            break;
        }
      }
    }
  }
  boxes.forEach((box)=>{
    let p = box.getAttribute("id").split("-");
    let i = Number(p[1]);
    let j = Number(p[2]);
    let piece_in_grid = grid[i][j];
    if(piece_in_grid.split("-")[0][0] == your_team && (!box.classList.contains("canwork"))){
      box.classList.add("unclick_Check")
    }
  })
  console.log(avail_moves_chk[0]);
  if (avail_moves_chk[0] == 0 && Check(a, b) == true) {
    alert(`${opponent} WIns!!`);
    window.location.reload();
  }
}
// what has EnPassant effect when there is a check on the king
function Enpas_at_check(loc, ox, oy) {
  let opponent;
  let your_key;
  white_turn[0] == 0 ? (opponent = "B") : (opponent = "W");
  white_turn[0] == 0 ? (your_key = "W") : (your_key = "B");
  let yr_king_coord = opponent == "B" ? W_king_position[1] : B_king_position[1];
  let i = Number(yr_king_coord.split("-")[0]);
  let j = Number(yr_king_coord.split("-")[1]);
  let val = loc.split("-");
  let piece = val[0];
  let x = Number(val[1]);
  let y = Number(val[2]);
  switch (piece) {
    case "W":
      let old_val = grid[x + 1][y];
      grid[x + 1][y] = "";
      if (Check(i, j) == true) {
        let box = document.getElementById("b-" + ox + "-" + oy);
        box.classList.add("unclickable");
      } else {
        avail_moves_chk[0]++;
      }
      grid[x + 1][y] = old_val;
      break;
    case "B":
      let old_val1 = grid[x - 1][y];
      grid[x - 1][y] = "";
      if (Check(i, j) == true) {
        let box = document.getElementById("b-" + ox + "-" + oy);
        box.classList.add("unclickable");
      } else {
        avail_moves_chk[0]++;
      }
      grid[x - 1][y] = old_val1;
      break;
  }
}
//this is checking for available positions at checkmate
function avail_check(ox, oy, nx, ny) {
  // console.log(`the new x is ${nx} and new y is ${ny}`)
  let opponent;
  let your_key;
  white_turn[0] == 0 ? (opponent = "B") : (opponent = "W");
  white_turn[0] == 0 ? (your_key = "W") : (your_key = "B");
  let yr_king_coord = opponent == "B" ? W_king_position[1] : B_king_position[1];
  let i = Number(yr_king_coord.split("-")[0]);
  let j = Number(yr_king_coord.split("-")[1]);
  // replacing the values shortly to check either they can save the king or not
  let old_val = grid[ox][oy];
  let new_val = grid[nx][ny];
  if (grid[nx][ny].split("-")[0][1] != "K") {
    grid[nx][ny] = grid[ox][oy];
    grid[ox][oy] = "";
    if (old_val.split("-")[0] != your_key + "K") {
      // console.log(Check(i, j))
      if (Check(i, j) == false) {
        avail_moves_chk[0]++;
        let box = document.getElementById("b-" + ox + "-" + oy);
        box.classList.add("canwork");
      }
    } else if (old_val.split("-")[0] == your_key + "K") {
      if (Check(nx, ny) == false) {
        avail_moves_chk[0]++;
        let box = document.getElementById("b-" + ox + "-" + oy);
        box.classList.add("canwork");
      } 
    }
    grid[ox][oy] = old_val;
    grid[nx][ny] = new_val;
  }
}
// this will turn pink
function Turn_pink(nx, ny) {
  let box = document.getElementById("b-" + nx + "-" + ny);
  box.classList.add("underattack");
}
// this function will turn the box blue
function Turn_blue(nx, ny) {
  let box = document.getElementById("b-" + nx + "-" + ny);
  box.classList.add("available");
}
// this is the function that will decide the stalemate
function Win_Draw() {
  let opponent;
  let your_key;
  white_turn[0] == 0 ? (opponent = "B") : (opponent = "W");
  white_turn[0] == 0 ? (your_key = "W") : (your_key = "B");
  let yr_king_coord = opponent == "B" ? W_king_position[1] : B_king_position[1];
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      let box = document.getElementById("b-" + i + "-" + j);
      let piece = grid[i][j];
      let part = piece.split("-")[0][1];
      let rigth_info = piece.split("-")[1];
      if (
        !box.classList.contains("unclickable") == true &&
        piece.split("-")[0][0] == your_key
      ) {
        switch (part) {
          case "p":
            Pawn(i, j, your_key, rigth_info, false);
            break;
          case "r":
            Rook(i, j, your_key, false);
            break;
          case "b":
            Bishop(i, j, your_key, false);
            break;
          case "K":
            King(i, j, your_key, false);
            break;
          case "q":
            Queen(i, j, your_key, false);
            break;
          case "k":
            Knigth(i, j, your_key, false);
            break;
        }
      }
    }
  }
  let x_K = Number(yr_king_coord.split("-")[0]);
  let y_K = Number(yr_king_coord.split("-")[1]);
  if (your_key == "W") {
    white_moves = total_moves;
    if (total_moves[0] == 0 && Check(x_K, y_K) == false) {
      alert("This is a draw !!");
      window.location.reload();
    }
  } else if (your_key == "B") {
    black_moves = total_moves;
    if (total_moves[0] == 0 && Check(x_K, y_K) == false) {
      alert("This is a draw !!");
      window.location.reload();
    }
  }
  console.log(`total white  available moves are ${white_moves} and black are ${black_moves}`)
  total_moves[0] = 0;
}
// function of castling
function Castling(your_key, pass) {
  switch (your_key) {
    case "W":
      let i = Number(W_king_position[1].split("-")[0]);
      let j = Number(W_king_position[1].split("-")[1]);
      if (W_king_position[0] == 0 && Check(i, j) == false) {
        // Right or king castle castling
        if (
          grid[i][j + 1] == "" &&
          Check(i, j + 1) == false &&
          grid[i][j + 2] == "" &&
          Check(i, j + 2) == false
        ) {
          if (White_rook_position[1] == 0) {
            let box = document.getElementById("b-" + i + "-" + (j + 2));
            if (pass == true) {
              box.classList.add("available");
              castle = "K";
            } else if(pass == false) total_moves[0]++;
            else if(pass == "danger") Castle_save(your_key , castle);
          }
        }
        // Queen castle
        if (
          grid[i][j - 1] == "" &&
          Check(i, j - 1) == false &&
          grid[i][j - 2] == "" &&
          Check(i, j - 2) == false
        ) {
          if (White_rook_position[0] == 0) {
            let box = document.getElementById("b-" + i + "-" + (j - 2));
            if (pass == true) {
              box.classList.add("available");
              castle = "Q";
            } else if(pass == false) total_moves[0]++;
            else if(pass == "danger") Castle_save(your_key , castle);
          }
        }
      }
      break;
    case "B":
      let x = Number(B_king_position[1].split("-")[0]);
      let y = Number(B_king_position[1].split("-")[1]);
      if (B_king_position[0] == 0 && Check(x, y) == false) {
        // Right or king castle castling
        if (
          grid[x][y + 1] == "" &&
          Check(x, y + 1) == false &&
          grid[x][y + 2] == "" &&
          Check(x, y + 2) == false
        ) {
          if (Black_rook_position[1] == 0) {
            let box = document.getElementById("b-" + x + "-" + (y + 2));
            if (pass == true) {
              box.classList.add("available");
              castle = "K";
            } else if(pass == false) total_moves[0]++;
            else if(pass == "danger") Castle_save(your_key , castle);
          }
        }
        // Queen castle
        if (
          grid[x][y - 1] == "" &&
          Check(x, y - 1) == false &&
          grid[x][y - 2] == "" &&
          Check(x, y - 2) == false
        ) {
          if (Black_rook_position[0] == 0) {
            let box = document.getElementById("b-" + x + "-" + (y - 2));
            if (pass == true) {
              box.classList.add("available");
              castle = "Q";
            } else if(pass == false) total_moves[0]++;
            else if(pass == "danger") Castle_save(your_key , castle);
          }
        }
      }
  }
}
// starigth checks for rook and queen
function straight_check(i, j, opponent) {
  let ans =
    grid[i][j].split("-")[0] == opponent + "r" ||
    grid[i][j].split("-")[0] == opponent + "q" 
  return ans;
}
// a diagonal check fucntion for check
function diagonal_Check(i, j, opponent) {
  // (grid[i][j].split("-")[0] == opponent+"p") ||
  let ans =
    grid[i][j].split("-")[0] == opponent + "q" ||
    grid[i][j].split("-")[0] == opponent + "b"||
     grid[i][j].split("-")[0] == opponent + "K"
  return ans;
}
// check at pawns cutting palces 
function pawn_Check(i , j , opponent){
    let ans =
    grid[i][j].split("-")[0] == opponent + "p" ||
    grid[i][j].split("-")[0] == opponent + "q"||
     grid[i][j].split("-")[0] == opponent + "K" 
  return ans;
}
// four directions check 
function fourD_check(i , j , opponent){
      let ans =
    grid[i][j].split("-")[0] == opponent + "r" ||
  grid[i][j].split("-")[0] == opponent + "q"||
   grid[i][j].split("-")[0] == opponent + "K" 
  return ans;
}
// function for check
function Check(i, j) {
  let x = Number(i);
  let y = Number(j);
  let opponent;
  let your_key;

  // for rook
  let px = false;
  let nx = false;
  let py = false;
  let ny = false;
  // for bishops
  let f_diagonal = false;
  let s_diagonal = false;
  let t_diagonal = false;
  let fo_diagonal = false;
  let decision = false;
  let negative_x = -1;
  let negative_y = -1;
  // finding the opponent
  white_turn[0] == 0 ? (opponent = "B") : (opponent = "W");
  white_turn[0] == 0 ? (your_key = "W") : (your_key = "B");
  // checking the diagonal positions of pawn
  if (opponent == "B") {
    if (
      (x - 1 >= 0 &&
        y - 1 >= 0 &&
        pawn_Check(x-1 , y-1 , opponent)) ||
      (x - 1 >= 0 &&
        y + 1 <= 7 &&
        pawn_Check(x-1 , y+1 , opponent))
    ) {
      decision = true;
      return decision;
    }
  }
  if (opponent == "W") {
    if (
      (x + 1 <= 7 &&
        y - 1 >= 0 &&
        pawn_Check(x+1 , y-1 , opponent)) ||
      (x + 1 <= 7 &&
        y + 1 <= 7 &&
        pawn_Check(x+1 , y+1 , opponent))
    ) {
      decision = true;
      return decision;
    }
  }
  // checking the one box forward in 4 directions 
  if((x-1>=0 && fourD_check(x-1 , y , opponent)) || (y+1<=7 && fourD_check(x , y+1 , opponent)) 
  || (x+1<=7 && fourD_check(x+1 , y , opponent) || (y-1>=0 && fourD_check( x, y-1 , opponent)))
  ){
    decision = true;
    return decision
  }
  // checking the rook positions
  for (let i = x, j = y; i < 15, j < 15; i++, j++) {
    if (y > 0) negative_x = y - (j + 1 - y);
    if (x > 0) negative_y = x - (i + 1 - x);
    // positive x
    if (j + 1 <= 7 && grid[x][j + 1] != "" && px == false) {
      if (straight_check(x, j + 1, opponent)) {
        decision = true;
        return decision;
      } else if (grid[x][j + 1].split("-")[0] != your_key + "K") px = true;
    }
    // negative x
    if (negative_x >= 0 && grid[x][negative_x] != "" && nx == false) {
      if (straight_check(x, negative_x, opponent)) {
        decision = true;
        return decision;
      } else if (grid[x][negative_x].split("-")[0] != your_key + "K") nx = true;
    }
    // positive y
    if (negative_y >= 0 && grid[negative_y][y] != "" && py == false) {
      if (straight_check(negative_y, y, opponent)) {
        decision = true;
        return decision;
      } else if (grid[negative_y][y].split("-")[0] != your_key + "K") py = true;
    }
    // negative y
    if (i + 1 <= 7 && grid[i + 1][y] != "" && ny == false) {
      if (straight_check(i + 1, y, opponent)) {
        decision = true;
        return decision;
      } else if (grid[i + 1][y].split("-")[0] != your_key + "K") ny = true;
    }
  }
  // checking for the bishop positions
  for (let i = 1; i < 15; i++) {
    // first side
    if (
      f_diagonal == false &&
      x - i >= 0 &&
      y + i <= 7 &&
      grid[x - i][y + i] != ""
    ) {
      if (diagonal_Check(x - i, y + i, opponent)) {
        decision = true;
        return decision;
      } else if (grid[x - i][y + i].split("-")[0] != your_key + "K")
        f_diagonal = true;
    }
    // second side
    if (
      s_diagonal == false &&
      x - i >= 0 &&
      y - i >= 0 &&
      grid[x - i][y - i] != ""
    ) {
      if (diagonal_Check(x - i, y - i, opponent)) {
        decision = true;
        return decision;
      } else if (grid[x - i][y - i].split("-")[0] != your_key + "K")
        s_diagonal = true;
    }
    // third side
    if (
      t_diagonal == false &&
      x + i <= 7 &&
      y + i <= 7 &&
      grid[x + i][y + i] != ""
    ) {
      if (diagonal_Check(x + i, y + i, opponent)) {
        decision = true;
        return decision;
      } else if (grid[x + i][y + i].split("-")[0] != your_key + "K")
        t_diagonal = true;
    }
    // fourth
    if (
      fo_diagonal == false &&
      x + i <= 7 &&
      y - i >= 0 &&
      grid[x + i][y - i] != ""
    ) {
      if (diagonal_Check(x + i, y - i, opponent)) {
        decision = true;
        return decision;
      } else if (grid[x + i][y - i].split("-")[0] != your_key + "K")
        fo_diagonal = true;
    }
  }
  // lastly checking the kigths position
  if (
    x - 2 >= 0 &&
    y - 1 >= 0 &&
    grid[x - 2][y - 1].split("-")[0] == opponent + "k"
  ) {
    decision = true;
    return decision;
  }
  if (
    x + 2 <= 7 &&
    y + 1 <= 7 &&
    grid[x + 2][y + 1].split("-")[0] == opponent + "k"
  ) {
    decision = true;
    return decision;
  }
  if (
    x - 1 >= 0 &&
    y - 2 >= 0 &&
    grid[x - 1][y - 2].split("-")[0] == opponent + "k"
  ) {
    decision = true;
    return decision;
  }
  if (
    x + 1 <= 7 &&
    y + 2 <= 7 &&
    grid[x + 1][y + 2].split("-")[0] == opponent + "k"
  ) {
    decision = true;
    return decision;
  }
  if (
    x - 2 >= 0 &&
    y + 1 <= 7 &&
    grid[x - 2][y + 1].split("-")[0] == opponent + "k"
  ) {
    decision = true;
    return decision;
  }
  if (
    x + 2 <= 7 &&
    y - 1 >= 0 &&
    grid[x + 2][y - 1].split("-")[0] == opponent + "k"
  ) {
    decision = true;
    return decision;
  }
  if (
    x - 1 >= 0 &&
    y + 2 <= 7 &&
    grid[x - 1][y + 2].split("-")[0] == opponent + "k"
  ) {
    decision = true;
    return decision;
  }
  if (
    x + 1 <= 7 &&
    y - 2 >= 0 &&
    grid[x + 1][y - 2].split("-")[0] == opponent + "k"
  ) {
    decision = true;
    return decision;
  }
  return decision;
}
// fucntion for enpassant
function enpassant(row, column, pass) {
  if (EnPassant != "") {
    // gathering important info
    let info_about_pawn = EnPassant.split("-");
    let bl_wh = info_about_pawn[0];
    let i = Number(info_about_pawn[1]);
    let j = Number(info_about_pawn[2]);
    if (row == i && column == j) {
      switch (bl_wh) {
        case "W":
          grid[i + 1][j] = "";
          break;
        case "B":
          grid[i - 1][j] = "";
          break;
      }
      EnPassant = "";
    }
  }
}
// fucntino for the Rook decsion
function Rook(i, j, bl_wh, pass) {
  let px = false;
  let nx = false;
  let py = false;
  let ny = false;
  let x = Number(i);
  let y = Number(j);
  // this is only for test
  let negative_x = -1;
  let negative_y = -1;
  let your_key = bl_wh;
  let opponent = bl_wh == "W" ? "B" : "W";
  for (let i = x, j = y; i < 15 && j < 15; i++, j++) {
    if (y > 0) negative_x = y - (j + 1 - y);
    if (x > 0) negative_y = x - (i + 1 - x);
    //px = true
    if (j < 7 && grid[x][j + 1] != "" && px == false) {
      if (grid[x][j + 1].split("-")[0][0] == opponent) {
        // let box = document.getElementById("b-" + x + "-" + (j + 1));
        if (pass == true) {
          if (IsKing(opponent, x, j + 1) == 1) {
            Turn_pink(x, j + 1);
          }
          px = true;
        } else if (pass == false) total_moves[0]++;
        else if (pass == "danger") {
          avail_check(x, y, x, j + 1);
          R_B_Qatchk[0] = 1;
        }
      } else px = true;
    }
    // nx = true
    if (negative_x >= 0 && grid[x][negative_x] != "" && nx == false) {
      if (grid[x][negative_x].split("-")[0][0] == opponent) {
        // let box = document.getElementById("b-" + x + "-" + negative_x);
        if (pass == true) {
          if (IsKing(opponent, x, negative_x) == 1) {
            Turn_pink(x, negative_x);
          }
          nx = true;
        } else if (pass == false) total_moves[0]++;
        else if (pass == "danger") {
          avail_check(x, y, x, negative_x);
          R_B_Qatchk[0] = 1;
        }
      } else nx = true;
    }
    // ny = true
    if (i < 7 && grid[i + 1][y] != "" && ny == false) {
      if (grid[i + 1][y].split("-")[0][0] == opponent) {
        // let box = document.getElementById("b-" + (i + 1) + "-" + y);
        if (pass == true) {
          if (IsKing(opponent, i + 1, y) == 1) {
            Turn_pink(i + 1, y);
          }
          ny = true;
        } else if (pass == false) total_moves[0]++;
        else if (pass == "danger") {
          avail_check(x, y, i + 1, y);
          R_B_Qatchk[0] = 1;
        }
      } else ny = true;
    }
    // py = true
    if (negative_y >= 0 && grid[negative_y][y] != "" && py == false) {
      if (grid[negative_y][y].split("-")[0][0] == opponent) {
        // let box = document.getElementById("b-" + negative_y + "-" + y);
        if (pass == true) {
          if (IsKing(opponent, negative_y, y) == 1) {
            Turn_pink(negative_y, y);
          }
          py = true;
        } else if (pass == false) total_moves[0]++;
        else if (pass == "danger") {
          avail_check(x, y, negative_y, y);
          R_B_Qatchk[0] = 1;
        }
      } else py = true;
    }
    // setting them blue
    if (px == false && j < 7) {
      // let box = document.getElementById("b-" + x + "-" + (j + 1));
      if (pass == true) Turn_blue(x, j + 1);
      else if (pass == false) total_moves[0]++;
      else if (pass == "danger") avail_check(x, y, x, j + 1);
    }
    if (nx == false && negative_x >= 0) {
      // let box = document.getElementById("b-" + x + "-" + negative_x);
      if (pass == true) Turn_blue(x, negative_x);
      else if (pass == false) total_moves[0]++;
      else if (pass == "danger") avail_check(x, y, x, negative_x);
    }
    if (py == false && negative_y >= 0) {
      // let box = document.getElementById("b-" + negative_y + "-" + y);
      if (pass == true) Turn_blue(negative_y, y);
      else if (pass == false) total_moves[0]++;
      else if (pass == "danger") avail_check(x, y, negative_y, y);
    }
    if (ny == false && i < 7) {
      // let box = document.getElementById("b-" + (i + 1) + "-" + y);
      if (pass == true) {
        Turn_blue(i + 1, y);
      } else if (pass == false) total_moves[0]++;
      else if (pass == "danger") avail_check(x, y, i + 1, y);
    }
  }
}
// fucntion for the movement of pawn
function Pawn(i, j, bl_wh, rigth_info, pass) {
  let x = Number(i);
  let y = Number(j);
  switch (bl_wh) {
    case "W":
      if (x != 0 ) {
        // first check either they are moved or not
        if (white_pawn[rigth_info] == 0) {
          for (let i = 1; i <= 2; i++) {
            // let box = document.getElementById("b-" + (x - i) + "-" + y);
            if (pass == true && grid[x-i][y]== "") Turn_blue(x - i, y);
            else if (pass == false) total_moves[0]++;
            else if (pass == "danger") avail_check(x, y, x - i, y);
          }
        } else {
          // if moved then only one step is available
          // let box = document.getElementById("b-" + (x - 1) + "-" + y);
          if (pass == true && grid[x-1][y]== "") Turn_blue(x - 1, y);
          else if (pass == false) total_moves[0]++;
          else if (pass == "danger") avail_check(x, y, x - 1, y);
        }
      }
      // for diagonal cutting
      if (
        (x != 0 && y < 7 && grid[x - 1][y + 1] != "") ||
        (y != 0 && x != 0 && grid[x - 1][y - 1] != "")
      ) {
        if (x != 0 && y < 7 && grid[x - 1][y + 1].split("-")[0][0] == "B") {
          // let box = document.getElementById("b-" + (x - 1) + "-" + (y + 1));
          if (pass == true && IsKing("B", x - 1, y + 1) == 1)
            Turn_pink(x - 1, y + 1);
          else if (pass == false) total_moves[0]++;
          else if (pass == "danger") avail_check(x, y, x - 1, y + 1);
        }
        if (x != 0 && y != 0 && grid[x - 1][y - 1].split("-")[0][0] == "B") {
          // let box = document.getElementById("b-" + (x - 1) + "-" + (y - 1));
          if (pass == true && IsKing("B", x - 1, y - 1) == 1)
            Turn_pink(x - 1, y - 1);
          else if (pass == false) total_moves[0]++;
          else if (pass == "danger") avail_check(x, y, x - 1, y - 1);
        }
      }
      // checks for enpassant
      if (
        y < 7 &&
        grid[x][y + 1] != "" &&
        grid[x][y + 1].split("-")[0][0] == "B"
      ) {
        if (
          grid[x][y + 1].split("-")[0][0] == "B" &&
          grid[x - 1][y + 1] == ""
        ) {
          // let box = document.getElementById("b-" + (x - 1) + "-" + (y + 1));
          if (pass == true) {
            Turn_blue(x - 1, y + 1);
            EnPassant = "W" + "-" + (x - 1) + "-" + (y + 1);
          } else if (pass == false) total_moves[0]++;
          else if (pass == "danger") Enpas_at_check(EnPassant, x, y);
        }
      }
      if (
        y != 0 &&
        grid[x][y - 1] !== "" &&
        y != 0 &&
        grid[x][y - 1].split("-")[0][0] == "B"
      ) {
        if (
          grid[x][y - 1].split("-")[0][0] == "B" &&
          grid[x - 1][y - 1] == ""
        ) {
          // let box = document.getElementById("b-" + (x - 1) + "-" + (y - 1));
          if (pass == true) {
            Turn_blue(x - 1, y - 1);
            EnPassant = "W" + "-" + (x - 1) + "-" + (y - 1);
          } else if (pass == false) total_moves[0]++;
          else if (pass == "danger") Enpas_at_check(EnPassant, x, y);
        }
      }
      //* still shape changing is left
      break;
    case "B":
      if (x < 7) {
        if (black_pawn[rigth_info] == 0) {
          for (let i = 1; i <= 2; i++) {
            // let box = document.getElementById("b-" + (x + i) + "-" + y);
            if (pass == true && grid[x+i][y] == "") Turn_blue(x + i, y);
            else if (pass == false) total_moves[0]++;
            else if (pass == "danger") avail_check(x, y, x + i, y);
          }
        } else {
          // let box = document.getElementById("b-" + (x + 1) + "-" + y);
          if (pass == true && grid[x+1][y] == "") Turn_blue(x + 1, y);
          else if (pass == false) total_moves[0]++;
          else if (pass == "danger") avail_check(x, y, x + 1, y);
        }
      }
      // for diagonal cutting
      if (
        (x < 7 && y != 0 && grid[x + 1][y - 1].split("-")[0][0] == "W") ||
        (x < 7 && y < 7 && grid[x + 1][y + 1].split("-")[0][0] == "W")
      ) {
        if (x < 7 && y != 0 && grid[x + 1][y - 1].split("-")[0][0] == "W") {
          // let box = document.getElementById("b-" + (x + 1) + "-" + (y - 1));
          if (pass == true && IsKing("W", x + 1, y - 1) == 1)
            Turn_pink(x + 1, y - 1);
          else if (pass == false) total_moves[0]++;
          else if (pass == "danger") avail_check(x, y, x + 1, y - 1);
        }
        if (x < 7 && y < 7 && grid[x + 1][y + 1].split("-")[0][0] == "W") {
          // let box = document.getElementById("b-" + (x + 1) + "-" + (y + 1));
          if (pass == true && IsKing("W", x + 1, y + 1) == 1)
            Turn_pink(x + 1, y + 1);
          else if (pass == false) total_moves[0]++;
          else if (pass == "danger") avail_check(x, y, x + 1, y + 1);
        }
      }
      // checks for enpassant
      if (
        y < 7 &&
        grid[x][y + 1].split("-")[0][0] == "W" &&
        x < 7 &&
        y < 7 &&
        grid[x + 1][y + 1] == ""
      ) {
        // let box = document.getElementById("b-" + (x + 1) + "-" + (y + 1));
        if (pass == true) {
          Turn_blue(x + 1, y + 1);
          EnPassant = "B" + "-" + (x + 1) + "-" + (y + 1);
        } else if (pass == false) total_moves[0]++;
        else if (pass == "danger") Enpas_at_check(EnPassant, x, y);
      }
      if (
        y != 0 &&
        grid[x][y - 1].split("-")[0][0] == "W" &&
        x < 7 &&
        y != 0 &&
        grid[x + 1][y - 1] == ""
      ) {
        // let box = document.getElementById("b-" + (x + 1) + "-" + (y - 1));
        if (pass == true) {
          Turn_blue(x + 1, y - 1);
          EnPassant = "B" + "-" + (x + 1) + "-" + (y - 1);
        } else if (pass == false) total_moves[0]++;
        else if (pass == "danger") Enpas_at_check(EnPassant, x, y);
      }
      //* still shape changing is left
      break;
  }
}
// function for the bishop
function Bishop(i, j, bl_wh, pass) {
  let x = Number(i);
  let y = Number(j);
  let your_key = bl_wh;
  let opponent = bl_wh == "W" ? "B" : "W";
  // the checks for actuallying stopping if we encounter any piece in our trajectory
  let f_diagonal = false;
  let s_diagonal = false;
  let t_diagonal = false;
  let fo_diagonal = false;
  for (let i = 1; i < 15; i++) {
    if (f_diagonal == false && x - i >= 0 && y + i <= 7) {
      if (grid[x - i][y + i] == "") {
        // let box = document.getElementById("b-" + (x - i) + "-" + (y + i));
        if (pass == true) Turn_blue(x - i, y + i);
        else if (pass == false) total_moves[0]++;
        else if (pass == "danger") {
          avail_check(x, y, x - i, y + i);
          R_B_Qatchk[1] = 1;
        }
      } else if (grid[x - i][y + i].split("-")[0][0] == bl_wh) {
        f_diagonal = true;
      } else if (grid[x - i][y + i].split("-")[0][0] == opponent) {
        // let box = document.getElementById("b-" + (x - i) + "-" + (y + i));
        f_diagonal = true;
        if (pass == true && IsKing(opponent, x - i, y + i) == 1)
          Turn_pink(x - i, y + i);
        else if (pass == false) total_moves[0]++;
        else if (pass == "danger") {
          avail_check(x, y, x - i, y + i);
          R_B_Qatchk[1] = 1;
        }
      }
    }
    if (s_diagonal == false && x - i >= 0 && y - i >= 0) {
      if (grid[x - i][y - i] == "") {
        // let box = document.getElementById("b-" + (x - i) + "-" + (y - i));
        if (pass == true) Turn_blue(x - i, y - i);
        else if (pass == false) total_moves[0]++;
        else if (pass == "danger") {
          avail_check(x, y, x - i, y - i);
          R_B_Qatchk[1] = 1;
        }
      } else if (grid[x - i][y - i].split("-")[0][0] == bl_wh) {
        s_diagonal = true;
      } else if (grid[x - i][y - i].split("-")[0][0] == opponent) {
        // let box = document.getElementById("b-" + (x - i) + "-" + (y - i));
        s_diagonal = true;
        if (pass == true && IsKing(opponent, x - i, y - i) == 1)
          Turn_pink(x - i, y - i);
        else if (pass == false) total_moves[0]++;
        else if (pass == "danger") {
          avail_check(x, y, x - i, y - i);
          R_B_Qatchk[1] = 1;
        }
      }
    }
    if (t_diagonal == false && x + i <= 7 && y + i <= 7) {
      if (grid[x + i][y + i] == "") {
        // let box = document.getElementById("b-" + (x + i) + "-" + (y + i));
        if (pass == true) Turn_blue(x + i, y + i);
        else if (pass == false) total_moves[0]++;
        else if (pass == "danger") {
          avail_check(x, y, x + i, y + i);
          R_B_Qatchk[1] = 1;
        }
      } else if (grid[x + i][y + i].split("-")[0][0] == bl_wh) {
        t_diagonal = true;
      } else if (grid[x + i][y + i].split("-")[0][0] == opponent) {
        // let box = document.getElementById("b-" + (x + i) + "-" + (y + i));
        t_diagonal = true;
        if (pass == true && IsKing(opponent, x + i, y + i) == 1)
          Turn_pink(x + i, y + i);
        else if (pass == false) total_moves[0]++;
        else if (pass == "danger") {
          avail_check(x, y, x + i, y + i);
          R_B_Qatchk[1] = 1;
        }
      }
    }
    if (fo_diagonal == false && x + i <= 7 && y - i >= 0) {
      if (grid[x + i][y - i] == "") {
        // let box = document.getElementById("b-" + (x + i) + "-" + (y - i));
        if (pass == true) Turn_blue(x + i, y - i);
        else if (pass == false) total_moves[0]++;
        else if (pass == "danger") {
          avail_check(x, y, x + i, y - i);
          R_B_Qatchk[1] = 1;
        }
      } else if (grid[x + i][y - i].split("-")[0][0] == bl_wh) {
        fo_diagonal = true;
      } else if (grid[x + i][y - i].split("-")[0][0] == opponent) {
        // let box = document.getElementById("b-" + (x + i) + "-" + (y - i));
        fo_diagonal = true;
        if (pass == true && IsKing(opponent, x + i, y - i) == 1)
          Turn_pink(x + i, y - i);
        else if (pass == false) total_moves[0]++;
        else if (pass == "danger") {
          avail_check(x, y, x + i, y - i);
          R_B_Qatchk[1] = 1;
        }
      }
    }
  }
}
// this fucntion tells the trajectory of the King
function King(i, j, bl_wh, pass) {
  let x = Number(i);
  let y = Number(j);
  let your_key = bl_wh;
  Castling(your_key, pass);
  let opponent = bl_wh == "W" ? "B" : "W";
  // first condition
  if (x - 1 >= 0 && Check(x - 1, y) == false) {
    if (grid[x - 1][y].split("-")[0][0] == opponent) {
      // let box = document.getElementById("b-" + (x - 1) + "-" + y);
      if (pass == true && IsKing(opponent, x - 1, y) == 1) Turn_pink(x - 1, y);
      else if (pass == false) total_moves[0]++;
      else if (pass == "danger") avail_check(x, y, x - 1, y);
    } else if (grid[x - 1][y] == "") {
      // let box = document.getElementById("b-" + (x - 1) + "-" + y);
      if (pass == true) {
        Turn_blue(x - 1, y);
      } else if (pass == false) total_moves[0]++;
      else if (pass == "danger") avail_check(x, y, x - 1, y);
    }
  }
  // second condition
  if (x - 1 >= 0 && y + 1 <= 7 && Check(x - 1, y + 1) == false) {
    if (grid[x - 1][y + 1].split("-")[0][0] == opponent) {
      // let box = document.getElementById("b-" + (x - 1) + "-" + (y + 1));
      if (pass == true && IsKing(opponent, x - 1, y + 1) == 1)
        Turn_pink(x - 1, y + 1);
      else if (pass == false) total_moves[0]++;
      else if (pass == "danger") avail_check(x, y, x - 1, y + 1);
    } else if (grid[x - 1][y + 1] == "") {
      // let box = document.getElementById("b-" + (x - 1) + "-" + (y + 1));
      if (pass == true) {
        Turn_blue(x - 1, y + 1);
      } else if (pass == false) total_moves[0]++;
      else if (pass == "danger") avail_check(x, y, x - 1, y + 1);
    }
  }
  // third condition
  if (y + 1 <= 7 && Check(x, y + 1) == false) {
    if (grid[x][y + 1].split("-")[0][0] == opponent) {
      // let box = document.getElementById("b-" + x + "-" + (y + 1));
      if (pass == true && IsKing(opponent, x, y + 1) == 1) Turn_pink(x, y + 1);
      else if (pass == false) total_moves[0]++;
      else if (pass == "danger") avail_check(x, y, x, y + 1);
    } else if (grid[x][y + 1] == "") {
      // let box = document.getElementById("b-" + x + "-" + (y + 1));
      if (pass == true) {
        Turn_blue(x, y + 1);
      } else if (pass == false) total_moves[0]++;
      else if (pass == "danger") avail_check(x, y, x, y + 1);
    }
  }
  // fourth condition
  if (y - 1 >= 0 && Check(x, y - 1) == false) {
    if (grid[x][y - 1].split("-")[0][0] == opponent) {
      // let box = document.getElementById("b-" + x + "-" + (y - 1));
      if (pass == true && IsKing(opponent, x, y - 1) == 1) Turn_pink(x, y - 1);
      else if (pass == false) total_moves[0]++;
      else if (pass == "danger") avail_check(x, y, x, y - 1);
    } else if (grid[x][y - 1] == "") {
      // let box = document.getElementById("b-" + x + "-" + (y - 1));
      if (pass == true) {
        Turn_blue(x, y - 1);
      } else if (pass == false) total_moves[0]++;
      else if (pass == "danger") avail_check(x, y, x, y - 1);
    }
  }
  // fifth
  if (x + 1 <= 7 && Check(x + 1, y) == false) {
    if (grid[x + 1][y].split("-")[0][0] == opponent) {
      // let box = document.getElementById("b-" + (x + 1) + "-" + y);
      if (pass == true && IsKing(opponent, x + 1, y) == 1) Turn_pink(x + 1, y);
      else if (pass == false) total_moves[0]++;
      else if (pass == "danger") avail_check(x, y, x + 1, y);
    } else if (grid[x + 1][y] == "") {
      // let box = document.getElementById("b-" + (x + 1) + "-" + y);
      if (pass == true) {
        Turn_blue(x + 1, y);
      } else if (pass == false) total_moves[0]++;
      else if (pass == "danger") avail_check(x, y, x + 1, y);
    }
  }
  // sixth
  if (x + 1 <= 7 && y - 1 >= 0 && Check(x + 1, y - 1) == false) {
    if (grid[x + 1][y - 1].split("-")[0][0] == opponent) {
      // let box = document.getElementById("b-" + (x + 1) + "-" + (y - 1));
      if (pass == true && IsKing(opponent, x + 1, y - 1) == 1)
        Turn_pink(x + 1, y - 1);
      else if (pass == false) total_moves[0]++;
      else if (pass == "danger") avail_check(x, y, x + 1, y - 1);
    } else if (grid[x + 1][y - 1] == "") {
      // let box = document.getElementById("b-" + (x + 1) + "-" + (y - 1));
      if (pass == true) {
        Turn_blue(x + 1, y - 1);
      } else if (pass == false) total_moves[0]++;
      else if (pass == "danger") avail_check(x, y, x + 1, y - 1);
    }
  }
  // seventh
  if (x + 1 <= 7 && y + 1 <= 7 && Check(x + 1, y + 1) == false) {
    if (grid[x + 1][y + 1].split("-")[0][0] == opponent) {
      // let box = document.getElementById("b-" + (x + 1) + "-" + (y + 1));
      if (pass == true && IsKing(opponent, x + 1, y + 1) == 1)
        Turn_pink(x + 1, y + 1);
      else if (pass == false) total_moves[0]++;
      else if (pass == "danger") avail_check(x, y, x + 1, y + 1);
    } else if (grid[x + 1][y + 1] == "") {
      // let box = document.getElementById("b-" + (x + 1) + "-" + (y + 1));
      if (pass == true) {
        Turn_blue(x + 1, y + 1);
      } else if (pass == false) total_moves[0]++;
      else if (pass == "danger") avail_check(x, y, x + 1, y + 1);
    }
  }
  // eigth
  if (x - 1 >= 0 && y - 1 >= 0 && Check(x - 1, y - 1) == false) {
    if (grid[x - 1][y - 1].split("-")[0][0] == opponent) {
      // let box = document.getElementById("b-" + (x - 1) + "-" + (y - 1));
      if (pass == true && IsKing(opponent, x - 1, y - 1) == 1)
        Turn_pink(x - 1, y - 1);
      else if (pass == false) total_moves[0]++;
      else if (pass == "danger") avail_check(x, y, x - 1, y - 1);
    } else if (grid[x - 1][y - 1] == "") {
      // let box = document.getElementById("b-" + (x - 1) + "-" + (y - 1));
      if (pass == true) {
        Turn_blue(x - 1, y - 1);
      } else if (pass == false) total_moves[0]++;
      else if (pass == "danger") avail_check(x, y, x - 1, y - 1);
    }
  }
}
function Queen(i, j, bl_wh, pass) {
  Bishop(i, j, bl_wh, pass);
  Rook(i, j, bl_wh, pass);
}
// this fucntion is about the knight
function Knigth(i, j, bl_wh, pass) {
  let x = Number(i);
  let y = Number(j);
  let your_key = bl_wh;
  let opponent = bl_wh == "W" ? "B" : "W";
  // first condition
  if (x - 2 >= 0 && y - 1 >= 0) {
    if (grid[x - 2][y - 1].split("-")[0][0] == opponent) {
      // let box = document.getElementById("b-" + (x - 2) + "-" + (y - 1));
      if (pass == true && IsKing(opponent, x - 2, y - 1) == 1)
        Turn_pink(x - 2, y - 1);
      else if (pass == false) total_moves[0]++;
      else if (pass == "danger") avail_check(x, y, x - 2, y - 1);
    } else if (grid[x - 2][y - 1] == "") {
      // let box = document.getElementById("b-" + (x - 2) + "-" + (y - 1));
      if (pass == true) Turn_blue(x - 2, y - 1);
      else if (pass == false) total_moves[0]++;
      else if (pass == "danger") avail_check(x, y, x - 2, y - 1);
    }
  }
  // second condition
  if (x + 2 <= 7 && y + 1 <= 7) {
    if (grid[x + 2][y + 1].split("-")[0][0] == opponent) {
      // let box = document.getElementById("b-" + (x + 2) + "-" + (y + 1));
      if (pass == true && IsKing(opponent, x + 2, y + 1) == 1)
        Turn_pink(x + 2, y + 1);
      else if (pass == false) total_moves[0]++;
      else if (pass == "danger") avail_check(x, y, x + 2, y + 1);
    } else if (grid[x + 2][y + 1] == "") {
      // let box = document.getElementById("b-" + (x + 2) + "-" + (y + 1));
      if (pass == true) Turn_blue(x + 2, y + 1);
      else if (pass == false) total_moves[0]++;
      else if (pass == "danger") avail_check(x, y, x + 2, y + 1);
    }
  }
  // third condition
  if (x - 1 >= 0 && y - 2 >= 0) {
    if (grid[x - 1][y - 2].split("-")[0][0] == opponent) {
      // let box = document.getElementById("b-" + (x - 1) + "-" + (y - 2));
      if (pass == true && IsKing(opponent, x - 1, y - 2) == 1)
        Turn_pink(x - 1, y - 2);
      else if (pass == false) total_moves[0]++;
      else if (pass == "danger") avail_check(x, y, x - 1, y - 2);
    } else if (grid[x - 1][y - 2] == "") {
      // let box = document.getElementById("b-" + (x - 1) + "-" + (y - 2));
      if (pass == true) Turn_blue(x - 1, y - 2);
      else if (pass == false) total_moves[0]++;
      else if (pass == "danger") avail_check(x, y, x - 1, y - 2);
    }
  }
  // fourth condition
  if (x + 1 <= 7 && y + 2 <= 7) {
    if (grid[x + 1][y + 2].split("-")[0][0] == opponent) {
      // let box = document.getElementById("b-" + (x + 1) + "-" + (y + 2));
      if (pass == true && IsKing(opponent, x + 1, y + 2) == 1)
        Turn_pink(x + 1, y + 2);
      else if (pass == false) total_moves[0]++;
      else if (pass == "danger") avail_check(x, y, x + 1, y + 2);
    } else if (grid[x + 1][y + 2] == "") {
      // let box = document.getElementById("b-" + (x + 1) + "-" + (y + 2));
      if (pass == true) Turn_blue(x + 1, y + 2);
      else if (pass == false) total_moves[0]++;
      else if (pass == "danger") avail_check(x, y, x + 1, y + 2);
    }
  }
  // fifth condition
  if (x - 2 >= 0 && y + 1 <= 7) {
    if (grid[x - 2][y + 1].split("-")[0][0] == opponent) {
      // let box = document.getElementById("b-" + (x - 2) + "-" + (y + 1));
      if (pass == true && IsKing(opponent, x - 2, y + 1) == 1)
        Turn_pink(x - 2, y + 1);
      else if (pass == false) total_moves[0]++;
      else if (pass == "danger") avail_check(x, y, x - 2, y + 1);
    } else if (grid[x - 2][y + 1] == "") {
      // let box = document.getElementById("b-" + (x - 2) + "-" + (y + 1));
      if (pass == true) Turn_blue(x - 2, y + 1);
      else if (pass == false) total_moves[0]++;
      else if (pass == "danger") avail_check(x, y, x - 2, y + 1);
    }
  }
  // sixth condition
  if (x + 2 <= 7 && y - 1 >= 0) {
    if (grid[x + 2][y - 1].split("-")[0][0] == opponent) {
      // let box = document.getElementById("b-" + (x + 2) + "-" + (y - 1));
      if (pass == true && IsKing(opponent, x + 2, y - 1) == 1)
        Turn_pink(x + 2, y - 1);
      else if (pass == false) total_moves[0]++;
      else if (pass == "danger") avail_check(x, y, x + 2, y - 1);
    } else if (grid[x + 2][y - 1] == "") {
      // let box = document.getElementById("b-" + (x + 2) + "-" + (y - 1));
      if (pass == true) Turn_blue(x + 2, y - 1);
      else if (pass == false) total_moves[0]++;
      else if (pass == "danger") avail_check(x, y, x + 2, y - 1);
    }
  }
  // seventh condition
  if (x - 1 >= 0 && y + 2 <= 7) {
    if (grid[x - 1][y + 2].split("-")[0][0] == opponent) {
      // let box = document.getElementById("b-" + (x - 1) + "-" + (y + 2));
      if (pass == true && IsKing(opponent, x - 1, y + 2) == 1)
        Turn_pink(x - 1, y + 2);
      else if (pass == false) total_moves[0]++;
      else if (pass == "danger") avail_check(x, y, x - 1, y + 2);
    } else if (grid[x - 1][y + 2] == "") {
      // let box = document.getElementById("b-" + (x - 1) + "-" + (y + 2));
      if (pass == true) Turn_blue(x - 1, y + 2);
      else if (pass == false) total_moves[0]++;
      else if (pass == "danger") avail_check(x, y, x - 1, y + 2);
    }
  }
  // eigthth condition
  if (x + 1 <= 7 && y - 2 >= 0) {
    if (grid[x + 1][y - 2].split("-")[0][0] == opponent) {
      // let box = document.getElementById("b-" + (x + 1) + "-" + (y - 2));
      if (pass == true && IsKing(opponent, x + 1, y - 2) == 1)
        Turn_pink(x + 1, y - 2);
      else if (pass == false) total_moves[0]++;
      else if (pass == "danger") avail_check(x, y, x + 1, y - 2);
    } else if (grid[x + 1][y - 2] == "") {
      // let box = document.getElementById("b-" + (x + 1) + "-" + (y - 2));
      if (pass == true) Turn_blue(x + 1, y - 2);
      else if (pass == false) total_moves[0]++;
      else if (pass == "danger") avail_check(x, y, x + 1, y - 2);
    }
  }
}
// fucntion deciding which piece is selected
function decision(x, y, bl_wh, right_info, pass) {
  let piece = grid[x][y].split("-")[0][1];
  switch (piece) {
    case "r":
      Rook(x, y, bl_wh, pass);
      break;
    case "k":
      Knigth(x, y, bl_wh, pass);
      break;
    case "b":
      Bishop(x, y, bl_wh, pass);
      break;
    case "q":
      Queen(x, y, bl_wh, pass);
      break;
    case "K":
      King(x, y, bl_wh, pass);
      break;
    case "p":
      Pawn(x, y, bl_wh, right_info, pass);
      break;
  }
}
// function that handles the turns
function turn() {
  let opposing_team;
  let your_team;
    avail_moves_chk[0] = 0;
  if (white_turn[0] == 0) {
    opposing_team = "B";
    your_team = "W";
    msgbox.innerText = "White's Turn ";
    // king check
    let K_cords = W_king_position[1].split("-");
    let i = Number(K_cords[0]);
    let j = Number(K_cords[1]);
    if (Check(i, j)) {
      let box = document.getElementById("b-" + i + "-" + j);
      box.classList.add("check");
      W_king_position[2] = 1;
      checkmate[0] = 1;
      CheckMate(your_team);
    } else {
      W_king_position[2] = 0;
      boxes.forEach((box) => {
        if (box.classList.contains("unclick_Check"))
          box.classList.remove("unclick_Check");
        if (box.classList.contains("check")) box.classList.remove("check");
      });
    }
  } else {
    opposing_team = "W";
    your_team = "B";
    msgbox.innerText = "Black's Turn ";
    // king check
    let K_cords = B_king_position[1].split("-");
    let i = Number(K_cords[0]);
    let j = Number(K_cords[1]);
    if (Check(i, j)) {
      let box = document.getElementById("b-" + i + "-" + j);
      box.classList.add("check");
      B_king_position[2] = 1;
      checkmate[0] = 1;
      CheckMate(your_team);
    } else {
      B_king_position[2] = 0;
      boxes.forEach((box) => {
        if (box.classList.contains("unclick_Check"))
          box.classList.remove("unclick_Check");
        if (box.classList.contains("check")) box.classList.remove("check");
      });
    }
  }
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      let box = document.getElementById("b-" + i + "-" + j);
        let info_about_clr = grid[i][j].split("-")[0][0];
        if (
          box.classList.contains("underattack") ||
          box.classList.contains("check") 
        ) {
          box.classList.remove("unclickable");
        } else if (info_about_clr == your_team) {
          box.classList.remove("unclickable");
        } else if (info_about_clr == opposing_team) {
          box.classList.add("unclickable");
        }
      
    }
  }
  Win_Draw();
}
turn();
// event listner on every box
boxes.forEach((box) => {
  box.addEventListener("click", () => {
    if (target == 0 && firstpassed == false) {
      firstpassed = true;
      box.classList.add("activated");
      let id = box.getAttribute("id").split("-");
      row = id[1];
      column = id[2];
      Display_selected(row , column);
      // to check which one was clicked black or white one
      let black_white = grid[row][column].split("-")[0][0];
      let right_mostinfo = grid[row][column].split("-")[1];

      decision(row, column, black_white, right_mostinfo, true);
      turn();
    }
    if (target == 1) {
      target = 0;
      firstpassed = false;
      let first_box = document.getElementById("b-" + row + "-" + column);
      first_box.classList.remove("activated");
      let first_grid = grid[row][column].split("-");
      let id = box.getAttribute("id").split("-");
      let i = Number(id[1]);
      let j = Number(id[2]);
      // checking if the available box is clicked or not
      if (box.classList.contains("available")) {
        // this condition is used to keep record if pawn is moving first time or not
        if (first_grid[0][1] == "p") {
          if (first_grid[0][0] == "B") black_pawn[first_grid[1]] = 1;
          else white_pawn[first_grid[1]] = 1;
        }

        // check for enpassant
        enpassant(i, j);
        // checking the record of KING checkmate
        if (grid[row][column].split("-")[0] == "WK") {
          W_king_position[0] = 1;
          W_king_position[1] = i + "-" + j;
          // checkmate removal
          checkmate[0] = 0;
          // now checking the castling
          if (castle != "" && castle == "K") {
            console.log(castle);
            let get_Rrook = grid[i][j + 1];
            grid[i][j - 1] = get_Rrook;
            grid[i][j + 1] = "";
            castle = "";
            White_rook_position[1] = 1;
          }
          if (castle != "" && castle == "Q") {
            let get_Rrook = grid[i][j - 2];
            grid[i][j + 1] = get_Rrook;
            grid[i][j - 2] = "";
            castle = "";
            White_rook_position[0] = 1;
          }
        }
        if (grid[row][column].split("-")[0] == "BK") {
          B_king_position[0] = 1;
          B_king_position[1] = i + "-" + j;
          // checkmate removal
          checkmate[0] = 0;
          // now checking the castling
          if (castle != "" && castle == "K") {
            let get_Rrook = grid[i][j + 1];
            grid[i][j - 1] = get_Rrook;
            grid[i][j + 1] = "";
            castle = "";
            Black_rook_position[1] = 1;
          }
          if (castle != "" && castle == "Q") {
            let get_Rrook = grid[i][j - 2];
            grid[i][j + 1] = get_Rrook;
            grid[i][j - 2] = "";
            castle = "";
            Black_rook_position[0] = 1;
          }
        }
        // checking the rooks position
        if (grid[row][column].split("-")[0] == "Wr") {
          if (grid[row][column].split("-")[1] == "L")
            White_rook_position[0] = 1;
          else if(grid[row][column].split("-")[1] == "R") White_rook_position[1] = 1;
        }
        // checking the rooks position
        if (grid[row][column].split("-")[0] == "Br") {
          if (grid[row][column].split("-")[1] == "L")
            Black_rook_position[0] = 1;
          else if(grid[row][column].split("-")[1] == "R") Black_rook_position[1] = 1;
        }

        // Checking the shape shifting 
        if(first_grid[0][1] == "p" && (i == 0 || i == 7)){
          if(first_grid[0][0] == "W" && i == 0) white_p_shift = true;
          else if(first_grid[0][0] == "B" && i ==7 ) black_p_shift = true; 
        }

        // swapping
        grid[i][j] = grid[row][column];
        grid[row][column] = "";
        if(white_p_shift){
          WShift(i , j);
          white_p_shift = false;
        }
        if(black_p_shift){
          BShift(i , j);
          black_p_shift = false;
        }
        // once clicked the available box remove the blue color
        boxes.forEach((box) => {
          if (box.classList.contains("available"))
            box.classList.remove("available");
          if (box.classList.contains("underattack"))
            box.classList.remove("underattack");
          if (box.classList.contains("check")) box.classList.remove("check");
        });
        //changing the turns
        if (white_turn[0] == 0) {
          white_turn[0] = 1;
          turn();
        } else {
          white_turn[0] = 0;
          turn();
        }
        // then display the positions of chess
        console.log(White_rook_position);
        console.log(W_king_position);
        display();
      } else if (box.classList.contains("underattack")) {
        // this condition is used to keep record if pawn is moving first time or not
        if (first_grid[0][1] == "p") {
          if (first_grid[0][0] == "B") black_pawn[first_grid[1]] = 1;
          else white_pawn[first_grid[1]] = 1;
        }

        
        if (grid[row][column].split("-")[0] == "WK") {
           W_king_position[1] = i + "-" + j;
          // checkmate removal
          checkmate[0] = 0;
        }
        if (grid[row][column].split("-")[0] == "BK") {
          B_king_position[0] = 1;
          B_king_position[1] = i + "-" + j;
        }
        // checking the rooks position
        if (grid[row][column].split("-")[0] == "Wr") {
          if (grid[row][column].split("-")[1] == "L")
            White_rook_position[0] = 1;
          else White_rook_position[1] = 1;
        }
        // checking the rooks position
        if (grid[row][column].split("-")[0] == "Br") {
          if (grid[row][column].split("-")[1] == "L")
            Black_rook_position[0] = 1;
          else Black_rook_position[1] = 1;
        }

         // Checking the shape shifting 
        if(first_grid[0][1] == "p" && (i == 0 || i == 7)){
          if(first_grid[0][0] == "W" && i == 0) white_p_shift = true;
          else if(first_grid[0][0] == "B" && i ==7 ) black_p_shift = true; 
        }


        grid[i][j] = grid[row][column];
        grid[row][column] = "";

        // once clicked the available box remove the blue color
        boxes.forEach((box) => {
          if (box.classList.contains("available"))
            box.classList.remove("available");
          if (box.classList.contains("underattack"))
            box.classList.remove("underattack");
          if (box.classList.contains("check")) box.classList.remove("check");
        });

        //changing the turns
        if (white_turn[0] == 0) {
          white_turn[0] = 1;
          turn();
        } else {
          white_turn[0] = 0;
          turn();
        }
        // then display the positions of chess
        display();
      } else {
        // if wrong box is clicked  remove the blue color
        boxes.forEach((box) => {
          if (box.classList.contains("available"))
            box.classList.remove("available");
          if (box.classList.contains("underattack"))
            box.classList.remove("underattack");
        });
      
        // then display the positions of chess
        display();
        turn();
      }
    }

    if (firstpassed == true) {
      target = 1;
    }
  });
});
