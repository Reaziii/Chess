import React, { useEffect, useState } from 'react';
import bshonno from '../../ChessPiece/bshonno.png';
import wshonno from '../../ChessPiece/wshonno.png';
import wnoka from '../../ChessPiece/wnoka.png';
import bnoka from '../../ChessPiece/bnoka.png';
import wghora from '../../ChessPiece/wghora.png';
import bghora from '../../ChessPiece/bghora.png';
import whati from '../../ChessPiece/whati.png';
import bhati from '../../ChessPiece/bhati.png';
import wmontri from '../../ChessPiece/wmontri.png';
import bmontri from '../../ChessPiece/bmontri.png';
import wraja from '../../ChessPiece/wraja.png';
import braja from '../../ChessPiece/braja.png';

// find minimum between 2 values
const min = (a, b) => {
	return a > b ? b : a;
};
// find maximum value between 2 values
const max = (a, b) => {
	return a > b ? a : b;
};


// if knight can go from {x,y} to {a,b}
const ghora = (x, y, a, b) => {
	let dx = [+2, +2, -2, -2, +1, +1, -1, -1];
	let dy = [+1, -1, +1, -1, +2, -2, +2, -2];
	for (let i = 0; i < 8; i++) {
		if (x + dx[i] === a && y + dy[i] === b) return true;
	}
	return false;
};


// check king is safe or not
const isRajaSafe = (x, y, a, b, color, tempbord, tempgoti) => {
	let bord = [...tempbord];
	let goti = [...tempgoti];
	const ax = bord[x][y];
	const bx = bord[a][b];
	const cx = goti[x][y];
	const dx = goti[a][b];

	bord[a][b] = ax;
	bord[x][y] = null;
	goti[a][b] = cx;
	goti[x][y] = { color: null, goti: null };

	let arr = new Array(8).fill(0).map(() => new Array(8).fill(0));
	let raja = [-1, -1];
	for (let x1 = 0; x1 < 8; x1++) {
		for (let y1 = 0; y1 < 8; y1++) {
			if (goti[x1][y1].color === color && goti[x1][y1].goti === 5) {
				raja = [x1, y1];
			}
			if (goti[x1][y1].color === null) continue;
			if (goti[x1][y1].color !== (color ^ 1)) {
				continue;
			}

			for (let x2 = 0; x2 < 8; x2++) {
				for (let y2 = 0; y2 < 8; y2++) {
					if (x1 === x2 && y1 === y2) continue;
					const gt = goti[x1][y1].goti;
					if (goti[x1][y1].goti === 0) {
						if (shonnokatbe(x1, y1, x2, y2, bord, goti)) {
							arr[x2][y2] = 1;
						}
					} else if (gt === 1) {
						if (noka(x1, y1, x2, y2, bord)) {
							arr[x2][y2] = 2;
						}
					} else if (gt === 2) {
						if (ghora(x1, y1, x2, y2)) {
							arr[x2][y2] = 3;
						}
					} else if (gt === 3) {
						if (hati(x1, y1, x2, y2, bord)) {
							arr[x2][y2] = 4;
						}
					} else if (gt === 4) {
						if (montri(x1, y1, x2, y2, bord)) {
							arr[x2][y2] = 5;
						}
					} else if (gt === 5 && rajaHardCheck(x1, y1, x2, y2, goti[x1][y1].color, bord, goti)) {
						arr[x2][y2] = 6;
					}
				}
			}
		}
	}

	bord[x][y] = ax;
	bord[a][b] = bx;
	goti[x][y] = cx;
	goti[a][b] = dx;

	if (raja[0] === -1) return true;

	if (arr[raja[0]][raja[1]] === 0) return true;
	return false;
};


// check if King can go from {x,y} to {a,b}
const raja = (x, y, a, b, color, bord, goti) => {
	let arr = new Array(8).fill(0).map(() => new Array(8).fill(0));
	for (let x1 = 0; x1 < 8; x1++) {
		for (let y1 = 0; y1 < 8; y1++) {
			if (goti[x1][y1].color === null) continue;
			if (goti[x1][y1].color !== (color ^ 1)) {
				continue;
			}

			for (let x2 = 0; x2 < 8; x2++) {
				for (let y2 = 0; y2 < 8; y2++) {
					if (x1 === x2 && y1 === y2) continue;
					const gt = goti[x1][y1].goti;
					if (goti[x1][y1].goti === 0) {
						if (shonnokatbe(x1, y1, x2, y2, bord, goti)) {
							arr[x2][y2] = 1;
						}
					} else if (gt === 1) {
						if (noka(x1, y1, x2, y2, bord)) {
							arr[x2][y2] = 2;
						}
					} else if (gt === 2) {
						if (ghora(x1, y1, x2, y2)) {
							arr[x2][y2] = 3;
						}
					} else if (gt === 3) {
						if (hati(x1, y1, x2, y2, bord)) {
							arr[x2][y2] = 4;
						}
					} else if (gt === 4) {
						if (montri(x1, y1, x2, y2, bord)) {
							arr[x2][y2] = 5;
						}
					} else if (gt === 5 && rajaHardCheck(x1, y1, x2, y2, goti[x1][y1].color, bord, goti)) {
						arr[x2][y2] = 6;
					}
				}
			}
		}
	}

	if (rajaHardCheck(x, y, a, b, color, bord, goti) && arr[a][b] === 0) return true;
	return false;
};

// check king 
const rajaHardCheck = (x, y, a, b, color, bord, goti) => {
	if (Math.abs(x - a) <= 1 && Math.abs(y - b) <= 1) return true;
	return false;
};

// check rook can go from {x,y} to {a,b}
const noka = (x, y, a, b, bord) => {
	if (x === a) {
		for (let i = min(y, b) + 1; i <= max(y, b) - 1; i++) {
			if (bord[a][i]) return false;
		}
		return true;
	} else if (y === b) {
		for (let i = min(x, a) + 1; i <= max(x, a) - 1; i++) {
			if (bord[i][y]) return false;
		}
		return true;
	}
	return false;
};

// If Pawn reach the last point new montri append 
const newMontri = (i,j) => {
    return i==0 || i==7;
};

// check if bishop can go from {x,y} to {a,b}
const hati = (x, y, a, b, bord) => {
	if (Math.abs(x - a) !== Math.abs(y - b)) return false;
	if (a > x && b > y) {
		a = a - 1;
		b = b - 1;
		x = x + 1;
		y = y + 1;
		while (x <= a) {
			if (bord[x][y]) return false;
			x = x + 1;
			y = y + 1;
		}
		return true;
	}
	if (a < x && b < y) {
		let t = x;
		x = a;
		a = t;
		t = y;
		y = b;
		b = t;
		a = a - 1;
		b = b - 1;
		x = x + 1;
		y = y + 1;
		while (x <= a) {
			if (bord[x][y]) return false;
			x = x + 1;
			y = y + 1;
		}
		return true;
	}
	if (a > x && b < y) {
		x = x + 1;
		y = y - 1;

		a = a - 1;
		b = b + 1;

		while (x <= a) {
			if (bord[x][y]) {
				return false;
			}
			x = x + 1;
			y = y - 1;
		}

		return true;
	}
	let t = x;
	x = a;
	a = t;
	t = y;
	y = b;
	b = t;
	x = x + 1;
	y = y - 1;
	a = a - 1;
	b = b + 1;
	while (x <= a) {
		if (bord[x][y]) return false;
		x = x + 1;
		y = y - 1;
	}
	return true;
};


// check if queen can go from {x,y} to {a,b}
const montri = (x, y, a, b, bord) => {
	if (hati(x, y, a, b, bord)) return true;
	else if (noka(x, y, a, b, bord)) return true;
	return false;
};



// check if pawn can discolify any piece
const shonnokatbe = (x, y, a, b, bord, goti) => {
	if (goti[x][y].color === 1) {
		if (a === x + 1 && b === y && !bord[a][b]) return false;
		else if (a === x + 1 && b - 1 === y) return true;
		else if (a === x + 1 && b + 1 === y) return true;

		return false;
	} else {
		if (a == x - 1 && b == y && !bord[a][b]) return false;
		else if (a == x - 1 && b - 1 == y) return true;
		else if (a == x - 1 && b + 1 == y) return true;
		return false;
	}
};


// check if pawn can go from {x,y} to {a,b}
const shonno = (x, y, a, b, bord, goti) => {
	if (goti[x][y].color === 1) {
		if (a === x + 1 && b === y && !bord[a][b]) return true;
		else if (a === x + 1 && b - 1 === y && goti[a][b].color === 0) return true;
		else if (a === x + 1 && b + 1 === y && goti[a][b].color === 0) return true;

		return false;
	} else {
		if (a === x - 1 && b === y && !bord[a][b]) return true;
		else if (a === x - 1 && b - 1 === y && goti[a][b].color === 1) return true;
		else if (a === x - 1 && b + 1 === y && goti[a][b].color === 1) return true;
		return false;
	}
};


// valid steps for all piece
const validboxes = (x, y, goti, arr, chal) => {
	for (let i = 0; i < 8; i++) {
		for (let j = 0; j < 8; j++) {
			const clasnn = String(i) + String(j);
			if (!isRajaSafe(x, y, i, j, chal, arr, goti)) continue;
			if (goti[x][y].goti === 2) {
				if (ghora(x, y, i, j, arr) && goti[x][y].color !== goti[i][j].color) {
					document.getElementById(clasnn).style.background = '#a3a3ff';
				}
			} else if (goti[x][y].goti === 1) {
				if (noka(x, y, i, j, arr) && goti[x][y].color !== goti[i][j].color) {
					document.getElementById(clasnn).style.background = '#a3a3ff';
				}
			} else if (goti[x][y].goti === 3) {
				if (hati(x, y, i, j, arr) && goti[x][y].color !== goti[i][j].color) {
					document.getElementById(clasnn).style.background = '#a3a3ff';
				}
			} else if (goti[x][y].goti === 4) {
				if (montri(x, y, i, j, arr) && goti[x][y].color !== goti[i][j].color) {
					document.getElementById(clasnn).style.background = '#a3a3ff';
				}
			} else if (goti[x][y].goti === 5) {
				/* raja checker */
				if (raja(x, y, i, j, chal, arr, goti) && goti[x][y].color !== goti[i][j].color) {
					document.getElementById(clasnn).style.background = '#a3a3ff';
				}
			} else if (goti[x][y].goti === 0) {
				if (shonno(x, y, i, j, arr, goti) && goti[x][y].color !== goti[i][j].color) {
					document.getElementById(clasnn).style.background = '#a3a3ff';
				}
			}
		}
	}
};

// reset the board color
const resetboxes = () => {
	for (let i = 0; i < 8; i++) {
		for (let j = 0; j < 8; j++) {
			const clasnn = String(i) + String(j);
			document.getElementById(clasnn).style.background = i % 2 === j % 2 ? 'white' : '#9fe89f';
		}
	}
};
const Playgame = () => {
	const [arr, setarr] = useState(new Array(8).fill(null).map(() => new Array(8).fill(null)));
	const [st, setst] = useState([null, null, null]);
	const [en, seten] = useState([null, null, null]);
	const [goti, setgoti] = useState(new Array(8).fill(null).map(() => new Array(8).fill({ color: null, goti: null })));
	const [notification, setnotification] = useState('Welcome!!');
	const [loading, setloading] = useState(1);
	const [chal, setchal] = useState(1);

    // initial state
	const init = () => {
		let temp = arr;
		let temp2 = goti;
		for (let i = 0; i < 8; i++) {
			temp[1][i] = wshonno;
			temp[6][i] = bshonno;
			temp2[1][i] = { color: 1, goti: 0 };
			temp2[6][i] = { color: 0, goti: 0 };
		}
		temp[0][0] = wnoka;
		temp[0][7] = wnoka;
		temp2[0][0] = temp2[0][7] = { color: 1, goti: 1 };
		temp[7][7] = temp[7][0] = bnoka;
		temp2[7][0] = temp2[7][7] = { color: 0, goti: 1 };
		temp[0][1] = temp[0][6] = wghora;
		temp2[0][1] = temp2[0][6] = { color: 1, goti: 2 };
		temp[7][1] = temp[7][6] = bghora;
		temp2[7][1] = temp2[7][6] = { color: 0, goti: 2 };
		temp[0][2] = temp[0][5] = whati;
		temp2[0][2] = temp2[0][5] = { color: 1, goti: 3 };
		temp[7][2] = temp[7][5] = bhati;
		temp2[7][2] = temp2[7][5] = { color: 0, goti: 3 };
		temp[0][4] = wmontri;
		temp2[0][4] = { color: 1, goti: 4 };
		temp[7][3] = bmontri;
		temp2[7][3] = { color: 0, goti: 4 };
		temp[0][3] = wraja;
		temp2[0][3] = { color: 1, goti: 5 };
		temp[7][4] = braja;
		temp2[7][4] = { color: 0, goti: 5 };
		setarr([...temp]);
		setgoti([...temp2]);
		setloading(0);
	};
	useEffect(() => {
		init();
	}, []);
	const enpont = (i, j, e) => {
		if (chal === goti[i][j].color) {
			setnotification('not valid');
			return;
		}
		let x = st[0],
			y = st[1],
			e1 = st[2];
		if (goti[x][y].goti === 2) {
			if (!ghora(x, y, i, j)) {
				setnotification('not valid for ghora');
				return 0;
			}
		} else if (goti[x][y].goti === 1) {
			if (!noka(x, y, i, j, arr)) {
				setnotification('not valid for noka');
				return;
			}
		} else if (goti[x][y].goti === 3) {
			if (!hati(x, y, i, j, arr)) {
				setnotification('not valid for hati');
				return;
			}
		} else if (goti[x][y].goti === 4) {
			if (!montri(x, y, i, j, arr)) {
				setnotification('not valid for montri');
				return;
			}
		} else if (goti[x][y].goti === 5) {
			if (!raja(x, y, i, j, chal, arr, goti)) {
				setnotification('not valid for raja');
				return;
			}
		} else if (goti[x][y].goti === 0) {
			if (!shonno(x, y, i, j, arr, goti)) {
				setnotification('not valid move for shonno');
				return;
			}
		}
		if (!isRajaSafe(x, y, i, j, chal, arr, goti)) {
			setnotification('King is not safe!!!');
			return;
		}
		
		resetboxes();

		e1.target.style.background = x % 2 === y % 2 ? 'white' : '#9fe89f';
		let temp = arr;
		let temp2 = goti;
		temp2[i][j] = goti[x][y];
		temp2[x][y] = { color: null, goti: null };
		temp[i][j] = arr[x][y];
		temp[x][y] = null;
        if (newMontri(i, j)) {
            temp[i][j] = i===0?bmontri:wmontri;
            temp2[i][j] = {color : i,goti : 4}
		}

		setgoti([...temp2]);
		setarr([...temp]);
		setst([null, null, null]);
		setchal(chal ^ 1);
	};
	const stpont = (i, j, e) => {
		if (st[0] === i && st[1] === j) {
			setst([null, null, null]);
			resetboxes();
			e.target.style.background = i % 2 === j % 2 ? 'white' : '#9fe89f';
			return;
		}
		if (st[0] !== null) {
			return enpont(i, j, e);
		}
		if (!arr[i][j]) {
			setnotification('Not valid!!!');
			return;
		}
		if (chal !== goti[i][j].color) {
			setnotification('not valid');
			return;
		} else {
			e.target.style.background = 'red';
			setst([i, j, e]);
			validboxes(i, j, goti, arr, chal);
		}
	};

	if (loading) return <></>;
	return (
		<div>
			<div className="board">
				{[0, 1, 2, 3, 4, 5, 6, 7].map((value1) => (
					<div className="rightToLeft">
						{[0, 1, 2, 3, 4, 5, 6, 7].map((value2) => (
							<div
								onClick={(e) => stpont(value1, value2, e, 1)}
								className="box"
								id={`${value1}${value2}`}
								style={value1 % 2 === value2 % 2 ? { background: 'white' } : { background: '#9fe89f' }}
							>
								{arr[value1][value2] ? <img src={arr[value1][value2]} alt="shonno" /> : null}
							</div>
						))}
					</div>
				))}
			</div>

			<div className="notifications">{notification}</div>
		</div>
	);
};

export default Playgame;
