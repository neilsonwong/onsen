"use strict";

function Alias (){}

Alias.get = function(rawArtist, rawTitle){
	return Alias.special(
		Alias.artist(rawArtist),
		Alias.title(rawTitle)
	);
};

Alias.title = function(raw){
	return doDaWork(raw, "title");
};

Alias.artist = function(raw){
	return doDaWork(raw, "artist");
};

Alias.special = function(artist, title){
	let a = artist;
	let t = title;
	
	if (Alias.db.special[artist] && Alias.db.special[artist][title]){
		a = Alias.db.special[artist][title].artist;
		t = Alias.db.special[artist][title].title;
	}

	return [a, t];
}

function doDaWork(raw, prop){
	if (!raw){
		return null;
	}
	raw = raw.trim();
	let lRaw = raw.toLowerCase();
	if (Alias.db[prop][lRaw] !== undefined){
		return Alias.db[prop][lRaw];
	}
	else {
		return raw;
	}
}

Alias.db = {};

Alias.db.title = {
	"sora wa takaku kaze wa utau" : "空は高く風は歌う",
	
	"kimi ni okuru uta" : "キミに贈る歌",

	"mikazuki" : "三日月",
	"blue days" : "ブルーデイズ",
	"koi kogarete mita yume" : "恋焦がれて見た夢",
	"te wo tsunagou" : "手をつなごう",
	"okaeri" : "おかえり",

	"suki" : "好き",

	"kimi no shiranai monogatari" : "君の知らない物語",
	"02. 君の知らない物語" : "君の知らない物語",
	"12. さよならメモリーズ" : "さよならメモリーズ",
	"sayonara memories" : "さよならメモリーズ",
	"utakata hanabi" : "うたかた花火",
	"yakusoku wo shiyou" : "約束をしよう",

	"ikenai borderline" : "いけないボーダーライン",
	"ikenai border line ～album version～" : "いけないボーダーライン",
	"いけないボーダーライン～album version～" : "いけないボーダーライン",
	"rune ga pika to hikattara" : "ルンがピカッと光ったら",
	"rune ga pika to hikattara ～album version～" : "ルンがピカッと光ったら",
	"rune ga pikatto hikattara～album version～" :  "ルンがピカッと光ったら",
	"ルンがピカッと光ったら～album version～" : "ルンがピカッと光ったら",
	"bokura no senjou" : "僕らの戦場",
	"axia~daisuki de daikirai~" : "AXIA～ダイスキでダイキライ～",
	"axia～daisuki de daikirai～" : "AXIA～ダイスキでダイキライ～",

	"웨딩드레스 (wedding dress)" : "웨딩드레스",
	"wedding dress" : "웨딩드레스",

	"one's hope" : "ONE's hope",

	"ur-style" : "Ur-Style", 
	
	"heaven" : "Heaven",

	"orange days" : "Orange Days",

	"lull ~soshite bokura wa~" : "lull ～そして僕らは～",

	"sekai wa koi ni ochiteiru": "世界は恋に落ちている",

	"02.over the clouds" : "Over the clouds",

	"shake it!": "shake it!",

	"i wish -tri.version-": "I Wish -tri.version-",

	"blue" : "blue",
	
	"love marginal (honoka mix)": "Love marginal",

	"for you ~tsuki no hikari ga furisosogu terrace" : "For you ~Tsuki no Hikari ga Furisosogu Terrace~",

	"todokanai koi '13" : "Todokanai Koi '13",

	"styx helix" : "STYX HELIX",

	"prism" : "プリズム",
	"sora no kakera" : "空の欠片",

	"vidro moyou": "ビードロ模様",

	"ellinia tree dungeon" : "Missing You",

	"ignite": "IGNITE",

	"courage" : "courage",

	"natsuiro egao de 1, 2, jump!" : "Natsuiro Egao de 1, 2, Jump!",

	"yuki, muon, madobenite" : "Yuki, Muon, Madobe Nite",



	
};

Alias.db.artist = {
	"park bom" : "박봄",

	"ayaka" : "絢香",

	"alan" : "alan",

	"yuna itou" : "伊藤由奈",
	"reira starring yuna ito" : "伊藤由奈",

	"yonezawa madoka" : "米澤円",
	"小木曽雪菜" : "米澤円",
	"ogiso setsuna" : "米澤円",

	"yanagi nagi" : "やなぎなぎ",

	"b2st" : "비스트",
	"beast" : "비스트",

	"usa" : "うさ",

	"choucho" : "ちょうちょ",

	"nakamura maiko" : "中村舞子",

	"nishino kana" : "西野カナ",

	"namie amuro" : "安室奈美恵",

	"gazelle" : "ガゼル",

	"mizuki nana" : "水樹奈々",

	"ikeda ayako" : "池田綾子",
	"ayako ikeda" : "池田綾子",

	"yoko ishida" : "石田燿子",

	"kuripurin" : "栗プリン",

	"ailee" : "에일리",

	"sugawara sayuri" : "菅原紗由理",

	"walkure" : "ワルキューレ",
	"walküre" : "ワルキューレ",
	"カナメδ安野希世乃、レイナδ東山奈央、マキナδ西田望見（from ワルキューレ）" : "ワルキューレ",
	"美雲δjunna、フレイアδ鈴木みのり、カナメδ安野希世乃（from ワルキューレ）" : "ワルキューレ",


	"ayakura mei" : "綾倉盟",

	"ritsuka" : "リツカ",

	"uehara rena" : "上原れな",

	"haruna luna" : "春奈るな",

	"kawada mami" : "川田まみ",
	"mami kawada" : "川田まみ",

	"miura sally" : "三浦サリー",
	"sally miura" : "三浦サリー",

	"masami okui" : "奥井雅美",
	"okui masami": "奥井雅美",

	"kara" : "카라",

	"wotamin" : "ヲタみん",

	"yokoyama masaru" : "横山克",
	"masaru yokoyama" : "横山克",

	"yui horie" : "堀江由衣",
	"horie yui" : "堀江由衣",

	"aoi eir" : "藍井エイル",

	"yasunori mitsuda" : "光田康典",

	"taneda risa" : "種田梨沙",

	"mika nakashima" : "中島美嘉",
	"nakashima mika" : "中島美嘉",

	"g.na" : "지나",

	"tamura yukari" : "田村ゆかり",

	"angela aki" : "アンジェラアキ",

	"kiyoura natsumi" : "清浦夏実",

	"hashimoto yukari" : "橋本由香利",

	"hashimoto miyuki" : "橋本みゆき",

	"hirano aya" : "平野綾",

	"iwasaki tarou" : "岩崎琢",
	"iwasaki taku" : "岩崎琢",

	"hatsune miku" : "初音ミク",

	"tenmon" : "天門",

	"inoue marina" : "井上麻里奈",

	"kobayashi shuntarou" : "小林俊太郎",

	"hayashibara megumi" : "林原めぐみ",
	"megumi hayashibara" : "林原めぐみ",

	"yuzu" : "ゆず",

	"fukui mai" : "福井舞",

	"fhana" : "fhána",

	"kousaka honoka" : "新田恵海",
	"emi nitta" : "新田恵海",
	"nitta emi" : "新田恵海",

	"bibi" : "BiBi",

	"aikawa nanase" : "相川七瀬",

	"wei chen ft mblaq lee joon & thunder" : "웨이천 & 이준(MBLAQ) & 천둥(MBLAQ)",

	"home made kazoku" : "HOME MADE 家族",

	"supercell": "supercell",

	"chelly": "EGOIST",
	"egoist": "EGOIST",

	"earthmind": "earthmind",

	"bigbang" : "빅뱅",
	"big bang" : "빅뱅",

	"komatsu mikako" : "小松未可子",

	"himawari" : "向日葵",

	"aim": "AiM",

	"taeyang": "태양",

	"lisa": "LiSA",

	"naoki sato": "佐藤直紀",

	"utada hikaru": "宇多田ヒカル",

	"tomatsu haruka": "戸松遥",

	"kagamine rin": "鏡音リン",

};

Alias.db.special = {
	"Printemps" : {
		"Love marginal" : {
			artist: "新田恵海",
			title: "Love marginal"
		}
	}
};

module.exports = Alias;